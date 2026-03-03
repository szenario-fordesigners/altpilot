<?php

namespace szenario\craftaltpilot\services\ai;

use Craft;
use OpenAI\Responses\Meta\MetaInformationRateLimit;

class OpenAiRateLimiter
{
    private const EXECUTION_BUFFER_SECONDS = 3;
    private const MAX_EXECUTION_TIME_SECONDS = 55;

    private const CACHE_KEY = 'altpilot_openai_next_allowed_time';

    public function throttleIfNeeded(): void
    {
        $nextAllowedRequestTime = (int) Craft::$app->getCache()->get(self::CACHE_KEY);

        if ($nextAllowedRequestTime <= 0) {
            return;
        }

        $now = time();
        if ($now >= $nextAllowedRequestTime) {
            Craft::$app->getCache()->delete(self::CACHE_KEY);
            return;
        }

        $sleepSeconds = (int) max(1, $nextAllowedRequestTime - $now);
        $this->logThrottle('Sleeping before next OpenAI request', [
            'sleepSeconds' => $sleepSeconds,
            'nextAllowedRequestTime' => $nextAllowedRequestTime,
        ]);
        sleep($sleepSeconds);
        Craft::$app->getCache()->delete(self::CACHE_KEY);
    }

    public function handleRateLimitResponse($response): void
    {
        if ($response === null) {
            return;
        }

        $requestReset = $response->hasHeader('x-ratelimit-reset-requests') ? $response->getHeaderLine('x-ratelimit-reset-requests') : null;
        $tokenReset = $response->hasHeader('x-ratelimit-reset-tokens') ? $response->getHeaderLine('x-ratelimit-reset-tokens') : null;

        $requestResetSeconds = $this->roundSeconds($this->parseResetInterval($requestReset));
        $tokenResetSeconds = $this->roundSeconds($this->parseResetInterval($tokenReset));

        $waitSeconds = max((int)$requestResetSeconds, (int)$tokenResetSeconds);

        // Fallback to a safe 60 seconds if headers are missing or unparseable
        if ($waitSeconds <= 0) {
            $waitSeconds = 60;
        }

        $nextAllowedRequestTime = time() + $waitSeconds;
        Craft::$app->getCache()->set(self::CACHE_KEY, $nextAllowedRequestTime, $waitSeconds);

        $this->logThrottle('Scheduled next OpenAI request delay due to 429 Rate Limit error', [
            'waitSeconds' => $waitSeconds,
            'nextAllowedRequestTime' => $nextAllowedRequestTime,
            'requestResetHeader' => $requestReset,
            'tokenResetHeader' => $tokenReset,
        ]);
    }

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

        $intervals = [];

        $this->logThrottle('Starting compute intervals', [
            'requestResetSeconds' => $requestResetSeconds,
            'tokenResetSeconds' => $tokenResetSeconds,
            'requestResetSecondsRaw' => $requestLimit->reset,
            'tokenResetSecondsRaw' => $tokenLimit->reset,
            'requestRemaining' => $requestRemaining,
            'tokenRemaining' => $tokenRemaining,
            'averageTokenCount' => $averageTokenCount,
        ]);

        if ($requestResetSeconds !== null && $requestResetSeconds > 0) {
            if ($requestRemaining <= 0) {
                $intervals[] = $requestResetSeconds;
            } else {
                $intervals[] = (int) ceil($requestResetSeconds / max($requestRemaining, 1));
            }
        }

        if ($tokenResetSeconds !== null && $tokenResetSeconds > 0) {
            if ($tokenRemaining <= 0) {
                $intervals[] = $tokenResetSeconds;
            } else {
                $possibleRequests = $tokenRemaining / $averageTokenCount;
                $intervals[] = $possibleRequests > 0 ? (int) ceil($tokenResetSeconds / $possibleRequests) : $tokenResetSeconds;
            }
        }

        if ($intervals === []) {
            Craft::$app->getCache()->delete(self::CACHE_KEY);
            $this->logThrottle('Could not compute throttling interval (no headers provided).');
            return;
        }

        $requiredInterval = max($intervals);
        $waitSeconds = max(0, $requiredInterval - $averageRequestDuration);

        $this->logThrottle('Computed throttle interval', [
            'tokenRemaining' => $tokenRemaining,
            'tokenResetSeconds' => $tokenResetSeconds,
            'requestRemaining' => $requestRemaining,
            'requestResetSeconds' => $requestResetSeconds,
            'requiredInterval' => $requiredInterval,
            'averageRequestDuration' => $averageRequestDuration,
            'lastRequestDuration' => $lastRequestDuration,
            'initialWaitSeconds' => $waitSeconds,
        ]);

        $maxDelayBudget = $this->determineMaxDelayBudget($lastRequestDuration);

        if ($maxDelayBudget === 0) {
            $this->logThrottle('Skipping throttle due to exhausted PHP max_execution_time budget.', [
                'maxExecutionTime' => ini_get('max_execution_time'),
                'lastRequestDuration' => $lastRequestDuration,
            ]);
            Craft::$app->getCache()->delete(self::CACHE_KEY);
            return;
        }

        if ($waitSeconds > $maxDelayBudget) {
            $this->logThrottle('Trimming throttle interval due to PHP max_execution_time budget.', [
                'requestedWaitSeconds' => $waitSeconds,
                'maxDelayBudget' => $maxDelayBudget,
            ]);
            $waitSeconds = $maxDelayBudget;
        }

        if ($waitSeconds <= 0) {
            Craft::$app->getCache()->delete(self::CACHE_KEY);
            $this->logThrottle('Throttle interval resolved to 0 seconds. No delay scheduled.');
            return;
        }

        $nextAllowedRequestTime = time() + $waitSeconds;
        Craft::$app->getCache()->set(self::CACHE_KEY, $nextAllowedRequestTime, $waitSeconds);
        
        $this->logThrottle('Scheduled next OpenAI request', [
            'waitSeconds' => $waitSeconds,
            'nextAllowedRequestTime' => $nextAllowedRequestTime,
        ]);
    }

    private function roundSeconds(?float $value): ?int
    {
        if ($value === null) {
            return null;
        }

        $rounded = (int) ceil($value);
        return $rounded > 0 ? $rounded : null;
    }

    private function determineMaxDelayBudget(int $lastRequestDuration): int
    {
        $phpMaxExecutionTime = (int) ini_get('max_execution_time');

        $executionCeiling = !$phpMaxExecutionTime
            ? self::MAX_EXECUTION_TIME_SECONDS
            : min($phpMaxExecutionTime, self::MAX_EXECUTION_TIME_SECONDS);

        $budget = $executionCeiling - $lastRequestDuration - self::EXECUTION_BUFFER_SECONDS;

        $this->logThrottle('Calculated execution-time budget for throttling.', [
            'phpMaxExecutionTime' => $phpMaxExecutionTime,
            'configuredMaxExecutionTime' => self::MAX_EXECUTION_TIME_SECONDS,
            'executionCeilingSeconds' => $executionCeiling,
            'lastRequestDuration' => $lastRequestDuration,
            'bufferSeconds' => self::EXECUTION_BUFFER_SECONDS,
            'budget' => $budget,
        ]);

        return max(0, $budget);
    }

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
            $totalSeconds = 0.0;

            foreach ($matches as $match) {
                $value = (float) $match[1];
                $unit = strtolower($match[2]);

                $totalSeconds += match ($unit) {
                    'ms' => $value / 1000,
                    's' => $value,
                    'm' => $value * 60,
                    default => 0,
                };
            }

            if ($totalSeconds > 0) {
                return $totalSeconds;
            }
        }

        $timestamp = strtotime($trimmed);
        if ($timestamp !== false) {
            $seconds = $timestamp - time();
            return $seconds > 0 ? (float) $seconds : null;
        }

        return null;
    }

    private function logThrottle(string $message, array $context = []): void
    {
        $payload = $context === [] ? $message : sprintf('%s %s', $message, json_encode($context));
        Craft::info($payload, 'altpilot');
    }
}
