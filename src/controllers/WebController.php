<?php

namespace szenario\craftaltpilot\controllers;

use Craft;
use craft\web\Controller;
use craft\elements\Asset;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use yii\web\ForbiddenHttpException;
use yii\web\Response;
use szenario\craftaltpilot\AltPilot;

/**
 * JSON API controller for the AltPilot control panel section (Vue frontend).
 *
 * All actions require the `accessPlugin-altpilot` permission and return JSON.
 *
 * Endpoints:
 * - POST queue            → Queue alt text generation for a single asset
 * - POST save-alt-texts   → Manually save alt texts for an asset across sites
 * - POST job-status       → Poll queue job status for a batch of assets
 * - GET  get-all-assets   → Paginated, filterable asset listing
 * - GET  get-single-asset → Single asset detail
 * - GET  get-status-counts        → Aggregate counts by alt text status
 * - GET  get-pending-alt-pilot-job-count → Number of pending queue jobs
 */
class WebController extends Controller
{
    public $defaultAction = 'queue';
    protected array|int|bool $allowAnonymous = self::ALLOW_ANONYMOUS_NEVER;

    public function beforeAction($action): bool
    {
        if (!parent::beforeAction($action)) {
            return false;
        }

        if (!Craft::$app->getUser()->checkPermission('accessPlugin-altpilot')) {
            throw new ForbiddenHttpException('User is not permitted to perform this action');
        }

        return true;
    }

    /** POST: Queue an alt text generation job for a single asset + site. */
    public function actionQueue(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $assetIdParam = $this->request->getRequiredBodyParam('assetID');

        // validate and convert the assetId to an integer
        $assetId = filter_var($assetIdParam, FILTER_VALIDATE_INT);
        if ($assetId === false) {
            return $this->errorResponse('Asset ID must be a valid integer');
        }

        $siteResolution = $this->resolveSiteId();
        if ($siteResolution['error'] !== null) {
            return $this->errorResponse($siteResolution['error']);
        }
        $siteId = $siteResolution['siteId'];

        $asset = Craft::$app->assets->getAssetById($assetId, $siteId);
        if (!$asset) {
            return $this->errorResponse('Asset not found for the requested site', 404);
        }

        Craft::info(sprintf('Queuing alt text generation for asset ID: %d on site ID: %d', $assetId, $siteId), "altpilot");


        $result = AltPilot::getInstance()->queueService->safelyCreateJob($asset);

        Craft::info(sprintf('Alt text generation queued for asset ID: %d on site ID: %d', $assetId, $siteId), "altpilot");

        $queueStatus = $result['status'] ?? 'queued';
        $message = $result['message'] ?? 'Alt text generation queued';

        if ($queueStatus === 'error') {
            return $this->errorResponse($message, 400, [
                'jobId' => $result['jobId'] ?? null,
                'queueStatus' => $queueStatus,
            ]);
        }

        return $this->successResponse([
            'jobId' => $result['jobId'] ?? null,
            'queueStatus' => $queueStatus,
        ], $message);
    }

    /**
     * Extract and validate the siteId from the request (body or query string).
     * Falls back to the current site, then the primary site.
     * Returns ['siteId' => int|'all'|null, 'error' => string|null].
     */
    private function resolveSiteId(string $mode = 'body'): array
    {
        if ($mode === 'body') {
            $siteIdParam = $this->request->getBodyParam('siteId');
        } else if ($mode === 'query') {
            $siteIdParam = $this->request->getQueryParam('siteId');
        } else {
            return [
                'siteId' => null,
                'error' => 'Invalid mode',
            ];
        }

        if ($siteIdParam !== null) {
            // special case for 'all'
            if ($siteIdParam === 'all') {
                return [
                    'siteId' => 'all',
                    'error' => null,
                ];
            }


            $siteId = filter_var($siteIdParam, FILTER_VALIDATE_INT);
            if ($siteId === false) {
                return [
                    'siteId' => null,
                    'error' => 'Site ID must be a valid integer',
                ];
            }

            if (Craft::$app->getSites()->getSiteById($siteId) === null) {
                return [
                    'siteId' => null,
                    'error' => 'Site not found',
                ];
            }

            return [
                'siteId' => $siteId,
                'error' => null,
            ];
        }

        $currentSite = Craft::$app->getSites()->getCurrentSite();
        if ($currentSite !== null) {
            return [
                'siteId' => (int) $currentSite->id,
                'error' => null,
            ];
        }

        $primarySite = Craft::$app->getSites()->getPrimarySite();
        if ($primarySite !== null) {
            return [
                'siteId' => (int) $primarySite->id,
                'error' => null,
            ];
        }

        return [
            'siteId' => null,
            'error' => 'Unable to determine site context for the request',
        ];
    }

    /** GET: Return the number of AltPilot jobs still in the queue. */
    public function actionGetPendingAltPilotJobCount(): Response
    {
        $this->requireAcceptsJson();
        return $this->successResponse([
            'count' => AltPilot::getInstance()->queueService->getPendingAltPilotJobCount(),
        ]);
    }

    /** GET: Return aggregate counts of assets by status (missing / AI-generated / manual). */
    public function actionGetStatusCounts(): Response
    {
        $this->requireAcceptsJson();

        $statusCounts = AltPilot::getInstance()->databaseService->getStatusCounts();

        return $this->successResponse($statusCounts);
    }

    /**
     * POST: Save manually-edited alt texts for a single asset across multiple sites.
     * Expects { assetID: int, altTexts: { [siteId]: string|null, ... } }.
     */
    public function actionSaveAltTexts(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $assetIdParam = $this->request->getRequiredBodyParam('assetID');
        $assetId = filter_var($assetIdParam, FILTER_VALIDATE_INT);
        if ($assetId === false) {
            return $this->errorResponse('Asset ID must be a valid integer');
        }

        $altTextsPayload = $this->request->getBodyParam('altTexts');
        if (!is_array($altTextsPayload) || $altTextsPayload === []) {
            return $this->errorResponse('altTexts must be a non-empty object or array');
        }

        $sitesService = Craft::$app->getSites();
        $validSiteIds = array_map(static fn($site) => (int) $site->id, $sitesService->getAllSites());

        $normalizedAltTexts = [];
        foreach ($altTextsPayload as $key => $value) {
            if (is_array($value)) {
                $siteId = filter_var($value['siteId'] ?? null, FILTER_VALIDATE_INT);
                $altText = array_key_exists('alt', $value) ? (string) $value['alt'] : null;
            } else {
                $siteId = filter_var($key, FILTER_VALIDATE_INT);
                $altText = $value === null ? null : (string) $value;
            }

            if ($siteId === false || !in_array($siteId, $validSiteIds, true)) {
                return $this->errorResponse('Invalid siteId provided in altTexts');
            }

            $normalizedAltTexts[$siteId] = $altText;
        }

        $results = [];
        $errors = [];
        $elementsService = Craft::$app->getElements();

        foreach ($normalizedAltTexts as $siteId => $altText) {
            $asset = Craft::$app->assets->getAssetById($assetId, $siteId);
            if (!$asset) {
                $errors[$siteId] = sprintf('Asset %d not found for site %d', $assetId, $siteId);
                continue;
            }

            // Explicitly set the siteId to ensure correct site context when saving
            $asset->siteId = $siteId;
            $asset->alt = $altText;

            Craft::info(sprintf('Saving alt text for asset ID: %d, site ID: %d, alt text: %s', $assetId, $siteId, $altText), "altpilot");

            $behavior = $asset->getBehavior('altPilotMetadata');
            if ($behavior instanceof AltPilotMetadata) {
                $behavior->setStatus($altText === null || trim($altText) === '' ? AltPilotMetadata::STATUS_MISSING : AltPilotMetadata::STATUS_MANUAL);
            }

            if (!$elementsService->saveElement($asset)) {
                $assetErrors = $asset->getErrors();
                Craft::error(sprintf('Failed to save asset alt text for asset ID: %d, site ID: %d. Errors: %s', $assetId, $siteId, json_encode($assetErrors)), "altpilot");
                $errors[$siteId] = $assetErrors;
                continue;
            }

            Craft::info(sprintf('Successfully saved alt text for asset ID: %d, site ID: %d', $assetId, $siteId), "altpilot");

            $results[] = [
                'siteId' => (int) $siteId,
                'alt' => $altText,
            ];
        }

        if ($errors !== []) {
            return $this->errorResponse(
                'Failed to save alt text for some sites',
                400,
                [
                    'assetId' => $assetId,
                    'successfulSites' => $results,
                    'errors' => $errors,
                ]
            );
        }

        return $this->successResponse([
            'assetId' => $assetId,
            'sites' => $results,
        ], 'Alt texts saved');
    }

    /**
     * POST: Poll the status of queue jobs for a batch of assets.
     * Used by the frontend to update the UI while generation is in progress.
     */
    public function actionJobStatus(): Response
    {
        $this->requirePostRequest();
        $this->requireAcceptsJson();

        $assetsPayload = $this->request->getBodyParam('assets', []);
        if (!is_array($assetsPayload) || $assetsPayload === []) {
            return $this->errorResponse('Assets payload must be a non-empty array');
        }

        $assetsToCheck = [];
        foreach ($assetsPayload as $assetPayload) {
            if (!is_array($assetPayload)) {
                continue;
            }

            $assetId = filter_var($assetPayload['assetId'] ?? null, FILTER_VALIDATE_INT);
            if ($assetId === false) {
                continue;
            }

            $siteIdRaw = $assetPayload['siteId'] ?? null;
            $siteId = $siteIdRaw === null || $siteIdRaw === '' ? null : filter_var($siteIdRaw, FILTER_VALIDATE_INT);
            $assetsToCheck[] = [
                'assetId' => $assetId,
                'siteId' => $siteId === false ? null : $siteId,
            ];
        }

        if ($assetsToCheck === []) {
            return $this->errorResponse('No valid assets specified');
        }

        $results = AltPilot::getInstance()->queueService->getJobStatuses($assetsToCheck);

        return $this->successResponse([
            'assets' => $results,
        ]);
    }


    /** GET: Return full details for a single asset (used by the asset detail panel). */
    public function actionGetSingleAsset(): Response
    {
        $this->requireAcceptsJson();

        $assetIdParam = $this->request->getQueryParam('assetID');
        if ($assetIdParam === null) {
            $assetIdParam = $this->request->getBodyParam('assetID');
        }

        if ($assetIdParam === null || $assetIdParam === '') {
            return $this->errorResponse('Missing required parameter: assetID');
        }

        $assetId = filter_var($assetIdParam, FILTER_VALIDATE_INT);
        if ($assetId === false) {
            return $this->errorResponse('Asset ID must be a valid integer');
        }

        $siteResolution = $this->resolveSiteId('query');
        if ($siteResolution['error'] !== null) {
            return $this->errorResponse($siteResolution['error']);
        }
        $siteId = $siteResolution['siteId'];

        $asset = Craft::$app->assets->getAssetById($assetId, $siteId);
        if (!$asset) {
            return $this->errorResponse('Asset not found', 404);
        }

        return $this->successResponse([
            'asset' => $asset->toArray([], [], true),
        ]);
    }



    /**
     * GET: Paginated listing of image assets, with optional search and status filter.
     *
     * Query params: limit, offset, sort (dateCreated|dateUpdated|filename),
     * query (free text, supports "id:123" and "term1 OR term2"), filter (all|missing|manual|ai-generated).
     *
     * Returns assets grouped by assetId, with each site's data nested inside.
     */
    public function actionGetAllAssets(): Response
    {
        $this->requireAcceptsJson();

        $limitParam = $this->request->getQueryParam('limit', 50);
        $offsetParam = $this->request->getQueryParam('offset', 0);

        $limit = filter_var($limitParam, FILTER_VALIDATE_INT, [
            'options' => [
                'min_range' => 1,
                'default' => 50,
            ],
        ]);

        if ($limit === false) {
            return $this->errorResponse('Limit must be a positive integer');
        }

        $offset = filter_var($offsetParam, FILTER_VALIDATE_INT, [
            'options' => [
                'min_range' => 0,
                'default' => 0,
            ],
        ]);

        if ($offset === false) {
            return $this->errorResponse('Offset must be zero or a positive integer');
        }

        $sortParam = $this->request->getQueryParam('sort', 'dateCreated');
        $queryParam = $this->request->getQueryParam('query');
        $filterParam = $this->request->getQueryParam('filter', 'all');

        switch ($sortParam) {
            case 'dateUpdated':
                $orderBy = 'dateUpdated DESC';
                break;
            case 'filename':
                $orderBy = 'filename ASC';
                break;
            case 'dateCreated':
            default:
                $orderBy = 'dateCreated DESC';
                break;
        }

        $uniqueAssetQuery = AltPilot::getInstance()
            ->databaseService
            ->createAssetStatusQuery($filterParam, $orderBy);

        if ($queryParam !== null && $queryParam !== '') {
            $queryTokens = preg_split('/\s+OR\s+/i', (string) $queryParam) ?: [];
            $idFilterValues = [];
            $searchTokens = [];

            foreach ($queryTokens as $token) {
                $token = trim($token);
                if ($token === '') {
                    continue;
                }

                if (preg_match('/^id:(\d+)$/i', $token, $matches)) {
                    $idFilterValues[] = (int) $matches[1];
                    continue;
                }

                $searchTokens[] = $token;
            }

            $allIds = [];

            if ($idFilterValues !== []) {
                $idFilterValues = array_values(array_unique($idFilterValues));
                $idQuery = clone $uniqueAssetQuery;
                $idQuery->id($idFilterValues);
                $allIds = array_merge($allIds, array_map('intval', $idQuery->ids()));
            }

            if ($searchTokens !== []) {
                $searchQuery = clone $uniqueAssetQuery;
                $searchQuery->search(implode(' OR ', $searchTokens));
                $allIds = array_merge($allIds, array_map('intval', $searchQuery->ids()));
            }

            // Fallback for legacy/free-form search values that don't tokenize cleanly.
            if ($allIds === []) {
                $fallbackQuery = clone $uniqueAssetQuery;
                $fallbackQuery->search((string) $queryParam);
                $allIds = array_map('intval', $fallbackQuery->ids());
            }

            // Fetch all IDs first to manually deduplicate, avoiding unique() search bug
            $uniqueIds = array_values(array_unique($allIds));

            $total = count($uniqueIds);
            $assetIds = array_slice($uniqueIds, $offset, $limit);
        } else {
            // For standard listing, DB-level unique is safe and efficient
            $uniqueAssetQuery->unique();

            $total = (clone $uniqueAssetQuery)->count();
            $assetIds = $uniqueAssetQuery
                ->offset($offset)
                ->limit($limit)
                ->ids();

            $assetIds = array_map('intval', $assetIds);
        }

        if ($assetIds === []) {
            return $this->successResponse([
                'assets' => [],
                'pagination' => [
                    'limit' => $limit,
                    'offset' => $offset,
                    'total' => $total,
                    'hasMore' => ($offset + $limit) < $total,
                ],
            ], 'Assets fetched');
        }

        $assets = Asset::find()
            ->kind('image')
            ->id($assetIds)
            ->siteId('*')
            ->fixedOrder()
            ->all();

        $assetsByAssetId = [];

        foreach ($assetIds as $assetId) {
            $assetsByAssetId[$assetId] = [];
        }

        foreach ($assets as $asset) {
            $assetId = (int) $asset->id;
            $siteKey = $asset->siteId;

            if ($siteKey === null || !array_key_exists($assetId, $assetsByAssetId)) {
                continue;
            }

            $assetsByAssetId[$assetId][$siteKey] = AltPilotMetadata::formatAssetForApi($asset);
        }

        return $this->successResponse([
            'assets' => $assetsByAssetId,
            'assetIds' => array_values($assetIds),
            'pagination' => [
                'limit' => $limit,
                'offset' => $offset,
                'total' => $total,
                'hasMore' => ($offset + $limit) < $total,
            ],
        ], 'Assets fetched');
    }

    /** Wrap data in a standard { status: "success", data: {...} } JSON envelope. */
    private function successResponse(array $data = [], ?string $message = null, int $statusCode = 200): Response
    {
        $payload = [
            'status' => 'success',
            'data' => $data,
        ];

        if ($message !== null) {
            $payload['message'] = $message;
        }

        $response = $this->asJson($payload);
        $response->setStatusCode($statusCode);
        return $response;
    }

    /** Wrap an error in a standard { status: "error", message: "..." } JSON envelope. */
    private function errorResponse(string $message, int $statusCode = 400, array $data = []): Response
    {
        $payload = [
            'status' => 'error',
            'message' => $message,
        ];

        if ($data !== []) {
            $payload['data'] = $data;
        }

        $response = $this->asJson($payload);
        $response->setStatusCode($statusCode);
        return $response;
    }
}
