<?php

namespace szenario\craftaltpilot\services\infrastructure;

use Craft;
use ILYAGVC\CheckHost\CheckHost;
use yii\base\Component;

/**
 * Url Reachability Checker service
 */
class UrlReachabilityChecker extends Component
{
    private ?CheckHost $_checkHost = null;

    /**
     * Get or create the CheckHost instance
     *
     * @return CheckHost
     */
    private function getCheckHost(): CheckHost
    {
        if ($this->_checkHost === null) {
            // leave all at default, except timeout which is set to 5 seconds
            $this->_checkHost = new CheckHost(
                null,
                false,
                null,
                5
            );
        }

        return $this->_checkHost;
    }

    /**
     * Check if a URL is reachable from the internet
     *
     * @param string $url The URL to check
     * @param int $maxNodes Maximum number of nodes to use for the check (default: 2)
     * @return bool True if the URL is reachable, false otherwise
     */
    public function isReachable(string $url, int $maxNodes = 2): bool
    {
        try {
            $checkHost = $this->getCheckHost();
            $result = $checkHost->runCheck($url, 'http', $maxNodes);

            if ($result === false || !isset($result['results']) || !is_array($result['results'])) {
                Craft::warning('Invalid result from check-host.net for URL: ' . $url, 'alt-pilot');
                return false;
            }

            // Results are organized by country name
            // Each country can have multiple check results
            foreach ($result['results'] as $countryResults) {
                if (!is_array($countryResults)) {
                    continue;
                }

                foreach ($countryResults as $checkResult) {
                    if (!is_array($checkResult) || !isset($checkResult['result_summary'])) {
                        continue;
                    }

                    // Check the 'ok' field in result_summary
                    // This is a boolean indicating if the HTTP check was successful
                    if (isset($checkResult['result_summary']['ok']) && $checkResult['result_summary']['ok'] === true) {
                        return true;
                    }
                }
            }

            return false;
        } catch (\Exception $e) {
            Craft::error('Error checking URL reachability: ' . $e->getMessage(), 'alt-pilot');
            return false;
        }
    }
}
