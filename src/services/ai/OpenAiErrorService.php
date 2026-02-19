<?php

namespace szenario\craftaltpilot\services\ai;

use Craft;
use OpenAI\Exceptions\ErrorException;
use OpenAI\Exceptions\RateLimitException;
use yii\base\Component;
use szenario\craftaltpilot\exceptions\OpenAiErrorException;

/**
 * Service for handling OpenAI API errors
 */
class OpenAiErrorService extends Component
{
    /**
     * Handle exceptions from OpenAI API calls
     *
     * @param \Exception $e The caught exception
     * @return \Exception The processed exception (OpenAiErrorException or original)
     */
    public function handleException(\Exception $e): \Exception
    {
        if ($e instanceof RateLimitException) {
            $message = 'OpenAI API rate limit exceeded. Please try again later.';
            $sanitizedMessage = $this->sanitizeErrorMessage($e->getMessage());
            Craft::error('OpenAI API rate limit error: ' . $sanitizedMessage, 'altpilot');

            return new OpenAiErrorException(
                $message,
                429,
                $e,
                'rate_limit_exceeded',
                'rate_limit_error',
                429
            );
        }

        if ($e instanceof ErrorException) {
            $errorCode = $e->getErrorCode();
            $errorType = $e->getErrorType();
            $errorMessage = $e->getErrorMessage();
            $statusCode = $e->getStatusCode();

            // Create a user-friendly message based on the error code
            $userMessage = $this->getUserFriendlyErrorMessage($errorCode, $errorMessage, $statusCode);

            // Sanitize error message before logging to prevent API key exposure
            $sanitizedErrorMessage = $this->sanitizeErrorMessage($errorMessage);

            // Log detailed error information (with sanitized message)
            Craft::error(
                sprintf(
                    'OpenAI API error [%s]: %s (Type: %s, Code: %s, Status: %d)',
                    $errorCode ?? 'unknown',
                    $sanitizedErrorMessage,
                    $errorType ?? 'unknown',
                    $errorCode ?? 'unknown',
                    $statusCode
                ),
                'altpilot'
            );

            // Create custom exception with error metadata
            return new OpenAiErrorException(
                $userMessage,
                $statusCode,
                $e,
                $errorCode !== null ? (string) $errorCode : null,
                $errorType,
                $statusCode
            );
        }

        if ($e instanceof OpenAiErrorException) {
            return $e;
        }

        $sanitizedMessage = $this->sanitizeErrorMessage($e->getMessage());

        // Don't log here if it's not a specific OpenAI exception we're transforming
        // The caller might want to log generic exceptions differently or let them bubble up
        // But for consistency with previous logic, we can log it here if we assume this handles all API interaction errors
        Craft::error('OpenAI API error: ' . $sanitizedMessage, 'altpilot');

        // Wrap generic exceptions in OpenAiErrorException for consistent handling upstream?
        // Or just return the original. Previous logic re-threw the original.
        // Let's return a new OpenAiErrorException to wrap it, so we can ensure sanitization in the message
        return new OpenAiErrorException(
            'Unexpected error communicating with OpenAI API: ' . $sanitizedMessage,
            $e->getCode() ?: 500,
            $e,
            'unexpected_error',
            'api_error',
            $e->getCode() ?: 500
        );
    }

    /**
     * Validate the response from OpenAI API
     *
     * @param mixed $response The response object or array
     * @throws OpenAiErrorException If the response is invalid
     */
    public function validateResponse(mixed $response): void
    {
        // Check for error in response
        $this->checkResponseForError($response);

        // Check structure
        $hasChoices = false;
        if (is_object($response)) {
            $hasChoices = isset($response->choices) && is_array($response->choices) && !empty($response->choices);
        } elseif (is_array($response)) {
            $hasChoices = isset($response['choices']) && is_array($response['choices']) && !empty($response['choices']);
        }

        if (!$hasChoices) {
            $errorMessage = 'Invalid response from OpenAI API: missing or empty choices array';
            $responseDebug = is_object($response) ? json_encode($response) : (is_array($response) ? json_encode($response) : (string) $response);
            // Truncate huge responses
            $responseDebug = substr($responseDebug, 0, 1000);

            Craft::error($errorMessage . ' - Response type: ' . gettype($response) . ' - Response: ' . $responseDebug, 'altpilot');

            throw new OpenAiErrorException(
                'Invalid response from OpenAI API. The API may have returned an error. Please check your API key and configuration.',
                500,
                null,
                'invalid_response',
                'api_error',
                500
            );
        }
    }

    /**
     * Check if response contains an error object/array
     */
    private function checkResponseForError(mixed $response): void
    {
        // Convert to array to safely check for error property
        $responseArray = null;
        if (is_array($response)) {
            $responseArray = $response;
        } elseif (is_object($response)) {
            // Try to convert object to array for error checking
            try {
                $responseArray = json_decode(json_encode($response), true);
            } catch (\Exception $e) {
                // If conversion fails, continue with object access
            }
        }

        if ($responseArray !== null && isset($responseArray['error'])) {
            $errorInfo = $responseArray['error'];

            // Extract error information
            $errorCode = null;
            $errorMessage = 'OpenAI API returned an error';
            $errorType = null;

            if (is_array($errorInfo)) {
                $errorCode = $errorInfo['code'] ?? null;
                $errorMessage = $errorInfo['message'] ?? $errorMessage;
                $errorType = $errorInfo['type'] ?? null;
            } elseif (is_string($errorInfo)) {
                $errorMessage = $errorInfo;
            }

            $userMessage = $this->getUserFriendlyErrorMessage($errorCode, $errorMessage, 400);

            Craft::error(
                sprintf(
                    'OpenAI API error in response [%s]: %s (Type: %s)',
                    $errorCode ?? 'unknown',
                    $errorMessage,
                    $errorType ?? 'unknown'
                ),
                'altpilot'
            );

            throw new OpenAiErrorException(
                $userMessage,
                400,
                null,
                $errorCode !== null ? (string) $errorCode : 'api_error',
                $errorType ?? 'api_error',
                400
            );
        }
    }

    /**
     * Extract content from response
     *
     * @param mixed $response
     * @return string
     * @throws OpenAiErrorException
     */
    public function extractContent(mixed $response): string
    {
        $content = null;
        if (is_object($response)) {
            if (!isset($response->choices[0]) || !isset($response->choices[0]->message) || !isset($response->choices[0]->message->content)) {
                $this->throwStructureError('object', get_class($response));
            }
            $content = $response->choices[0]->message->content;
        } elseif (is_array($response)) {
            if (!isset($response['choices'][0]) || !isset($response['choices'][0]['message']) || !isset($response['choices'][0]['message']['content'])) {
                $this->throwStructureError('array');
            }
            $content = $response['choices'][0]['message']['content'];
        }

        if (empty($content)) {
            throw new OpenAiErrorException(
                'No content returned from OpenAI API',
                500,
                null,
                'empty_content',
                'api_error',
                500
            );
        }

        return trim($content);
    }

    private function throwStructureError(string $type, string $class = ''): void
    {
        $errorMessage = 'Invalid response structure from OpenAI API: missing content';
        $details = $type === 'object' ? ' - Response type: ' . $class : ' - Response is array';

        Craft::error($errorMessage . $details, 'altpilot');

        throw new OpenAiErrorException(
            'Invalid response structure from OpenAI API. Please check your API configuration.',
            500,
            null,
            'invalid_response_structure',
            'api_error',
            500
        );
    }

    /**
     * Sanitize error messages to remove API keys and other sensitive information
     *
     * @param string $message The error message to sanitize
     * @return string Sanitized error message
     */
    public function sanitizeErrorMessage(string $message): string
    {
        // Remove API keys (sk- followed by alphanumeric characters)
        $message = preg_replace('/sk-[a-zA-Z0-9]{20,}/', 'sk-***REDACTED***', $message);

        // Remove any other potential API key patterns
        $message = preg_replace('/api[_-]?key["\']?\s*[:=]\s*["\']?[a-zA-Z0-9_-]{20,}/i', 'api_key=***REDACTED***', $message);

        // Remove OpenAI error messages that might contain partial keys
        $message = preg_replace('/Incorrect API key provided:\s*[^\s]+/i', 'Incorrect API key provided: ***REDACTED***', $message);

        return $message;
    }

    /**
     * Get a user-friendly error message based on OpenAI error code
     *
     * @param string|int|null $errorCode The OpenAI error code
     * @param string $errorMessage The original error message
     * @param int $statusCode The HTTP status code
     * @return string User-friendly error message
     */
    private function getUserFriendlyErrorMessage($errorCode, string $errorMessage, int $statusCode): string
    {
        // Map common OpenAI error codes to user-friendly messages
        $errorMessages = [
            'invalid_api_key' => 'Invalid OpenAI API key. Please check your API key in the plugin settings.',
            'insufficient_quota' => 'OpenAI API quota exceeded. Please check your billing and usage limits.',
            'rate_limit_exceeded' => 'OpenAI API rate limit exceeded. Please try again later.',
            'billing_not_active' => 'OpenAI billing is not active. Please set up billing in your OpenAI account.',
            'model_not_found' => 'The specified OpenAI model was not found. Please check your model configuration.',
            'invalid_request_error' => 'Invalid request to OpenAI API: ' . $errorMessage,
            'server_error' => 'OpenAI API server error. Please try again later.',
            'timeout' => 'Request to OpenAI API timed out. Please try again.',
        ];

        // Check for specific error codes
        if ($errorCode !== null && isset($errorMessages[(string) $errorCode])) {
            return $errorMessages[(string) $errorCode];
        }

        // Check HTTP status codes for common errors
        if ($statusCode === 401) {
            return 'OpenAI API authentication failed. Please check your API key.';
        }
        if ($statusCode === 429) {
            return 'OpenAI API rate limit exceeded. Please try again later.';
        }
        if ($statusCode === 500 || $statusCode === 502 || $statusCode === 503) {
            return 'OpenAI API server error. Please try again later.';
        }

        // Fallback to original message with prefix
        return 'OpenAI API error: ' . $errorMessage;
    }
}
