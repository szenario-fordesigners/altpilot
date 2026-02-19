<?php

namespace szenario\craftaltpilot\exceptions;

use Exception;

/**
 * Custom exception for OpenAI API errors with additional metadata
 */
class OpenAiErrorException extends Exception
{
    public function __construct(
        string $message,
        int $code = 0,
        ?Exception $previous = null,
        public readonly ?string $errorCode = null,
        public readonly ?string $errorType = null,
        public readonly int $httpStatusCode = 0
    ) {
        parent::__construct($message, $code, $previous);
    }
}



