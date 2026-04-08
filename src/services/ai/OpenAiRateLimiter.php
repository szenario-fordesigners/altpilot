<?php

namespace szenario\craftaltpilot\services\ai;

use Craft;
use OpenAI\Responses\Meta\MetaInformationRateLimit;

/**
 * Paces OpenAI API requests to stay within rate limits.
 *
 * Uses Craft's cache to store the earliest time the next request is allowed.
 * Two entry points:
 * - throttleIfNeeded(): called BEFORE a request — sleeps if needed
 * - scheduleNextRequestDelay(): called AFTER a request — calculates wait from response headers
 * - handleRateLimitResponse(): called when a 429 is received — uses reset headers to schedule delay
 */
class OpenAiRateLimiter
{
    private const EXECUTION_BUFFER_SECONDS = 3;
    /** Hard ceiling to avoid exceeding PHP's max_execution_time inside a queue job */
    private const MAX_EXECUTION_TIME_SECONDS = 55;
    private const CACHE_KEY = 'altpilot_openai_next_allowed_time';

    /**
     * If a previous request scheduled a delay, sleep until that time has passed.
     * Called at the start of each API request in OpenAiService.
     */
    public function throttleIfNeeded(): void
    {
        $nextAllowed = (int) Craft::$app->getCache()->get(self::CACHE_KEY);
        if ($nextAllowed <= 0) {
            return;
        }

        $now = time();
        if ($now >= $nextAllowed) {
            Craft::$app->getCache()->delete(self::CACHE_KEY);
            return;
        }

        $sleep = max(1, $nextAllowed - $now);
        Craft::info("Rate limiter: sleeping {$sleep}s before next request", 'altpilot');
        sleep($sleep);
        Craft::$app->getCache()->delete(self::CACHE_KEY);
    }

    /**
     * Called when OpenAI returns a 429 rate limit error.
     * Reads the x-ratelimit-reset-* headers to determine how long to wait,
     * then stores that delay in cache for throttleIfNeeded() to pick up.
     */
    public function handleRateLimitResponse($response): void
    {
        if ($response === null) {
            return;
        }

        $requestReset = $response->hasHeader('x-ratelimit-reset-requests') ? $response->getHeaderLine('x-ratelimit-reset-requests') : null;
        $tokenReset = $response->hasHeader('x-ratelimit-reset-tokens') ? $response->getHeaderLine('x-ratelimit-reset-tokens') : null;

        $waitSeconds = max(
            (int) $this->roundSeconds($this->parseResetInterval($requestReset)),
            (int) $this->roundSeconds($this->parseResetInterval($tokenReset))
        );

        if ($waitSeconds <= 0) {
            $waitSeconds = 60;
        }

        $this->scheduleDelay($waitSeconds);
    }

    /**
     * Called after a successful API response. Uses the response's rate-limit metadata
     * to calculate an optimal delay before the next request.
     *
     * The idea: spread remaining requests evenly over the reset window.
     *
     * For request limits: divide reset time by remaining requests.
     * For token limits: estimate how many requests fit in the remaining tokens
     * (using the rolling average), then spread over the reset window.
     *
     * The delay is capped by PHP's max_execution_time to avoid killing the queue worker.
     */
    public function scheduleNextRequestDelay(
        MetaInformationRateLimit $tokenLimit,
        MetaInformationRateLimit $requestLimit,
        int $averageTokenCount,
        int $averageRequestDuration,
        int $lastRequestDuration
    ): void {
        $averageTokenCount = max(1, $averageTokenCount);

        $tokenRemaining = max(0, (int) $tokenLimit->remaining);
        $requestRemaining = max(0, (int) $requestLimit->remaining);
        $tokenResetSeconds = $this->roundSeconds($this->parseResetInterval($tokenLimit->reset));
        $requestResetSeconds = $this->roundSeconds($this->parseResetInterval($requestLimit->reset));

        // Calculate per-request interval for both limits, pick the larger one
        $intervals = [];

        if ($requestResetSeconds !== null && $requestResetSeconds > 0) {
            $intervals[] = $requestRemaining <= 0
                ? $requestResetSeconds
                : (int) ceil($requestResetSeconds / max($requestRemaining, 1));
        }

        if ($tokenResetSeconds !== null && $tokenResetSeconds > 0) {
            if ($tokenRemaining <= 0) {
                $intervals[] = $tokenResetSeconds;
            } else {
                $possibleRequests = $tokenRemaining / $averageTokenCount;
                $intervals[] = $possibleRequests > 0
                    ? (int) ceil($tokenResetSeconds / $possibleRequests)
                    : $tokenResetSeconds;
            }
        }

        if ($intervals === []) {
            Craft::$app->getCache()->delete(self::CACHE_KEY);
            return;
        }

        // Subtract the time the request itself will take (we're already "waiting" during execution)
        $waitSeconds = max(0, max($intervals) - $averageRequestDuration);
        $maxBudget = $this->getMaxDelayBudget($lastRequestDuration);

        if ($maxBudget === 0 || $waitSeconds <= 0) {
            Craft::$app->getCache()->delete(self::CACHE_KEY);
            return;
        }

        $this->scheduleDelay(min($waitSeconds, $maxBudget));
    }

    /** Store the delay in Craft's cache so the next throttleIfNeeded() call picks it up. */
    private function scheduleDelay(int $seconds): void
    {
        if ($seconds <= 0) {
            return;
        }

        $nextAllowed = time() + $seconds;
        Craft::$app->getCache()->set(self::CACHE_KEY, $nextAllowed, $seconds);
        Craft::info("Rate limiter: scheduled {$seconds}s delay", 'altpilot');
    }

    /**
     * Calculate how many seconds we can safely sleep without exceeding PHP's max_execution_time.
     * Returns 0 if there's no budget left (the request itself already used most of the time).
     */
    private function getMaxDelayBudget(int $lastRequestDuration): int
    {
        $phpMax = (int) ini_get('max_execution_time');
        $ceiling = $phpMax > 0
            ? min($phpMax, self::MAX_EXECUTION_TIME_SECONDS)
            : self::MAX_EXECUTION_TIME_SECONDS;

        return max(0, $ceiling - $lastRequestDuration - self::EXECUTION_BUFFER_SECONDS);
    }

    /**
     * Parse OpenAI's rate-limit reset header into seconds.
     * Handles multiple formats: plain numbers, duration strings ("1m30s", "500ms"), ISO timestamps.
     */
    private function parseResetInterval(?string $reset): ?float
    {
        if ($reset === null || $reset === '') {
            return null;
        }

        $trimmed = trim($reset);

        if (is_numeric($trimmed)) {
            return (float) $trimmed;
        }

        if (preg_match_all('/(\d+(?:\.\d+)?)(ms|s|m)/i', $trimmed, $matches, PREG_SET_ORDER) && $matches !== []) {
            $total = 0.0;
            foreach ($matches as $match) {
                $value = (float) $match[1];
                $total += match (strtolower($match[2])) {
                    'ms' => $value / 1000,
                    's' => $value,
                    'm' => $value * 60,
                    default => 0,
                };
            }
            return $total > 0 ? $total : null;
        }

        $timestamp = strtotime($trimmed);
        if ($timestamp !== false) {
            $seconds = $timestamp - time();
            return $seconds > 0 ? (float) $seconds : null;
        }

        return null;
    }

    /** Round up to the nearest whole second. Returns null if input is null or <= 0. */
    private function roundSeconds(?float $value): ?int
    {
        if ($value === null) {
            return null;
        }
        $rounded = (int) ceil($value);
        return $rounded > 0 ? $rounded : null;
    }
}
