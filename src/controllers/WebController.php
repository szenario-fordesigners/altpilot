<?php

namespace szenario\craftaltpilot\controllers;

use Craft;
use craft\web\Controller;
use craft\elements\Asset;
use szenario\craftaltpilot\behaviors\AltPilotMetadata;
use craft\db\Query;
use yii\web\Response;
use szenario\craftaltpilot\AltPilot;

/**
 * Alt Pilot Web controller
 */
class WebController extends Controller
{
    public $defaultAction = 'queue';
    protected array|int|bool $allowAnonymous = self::ALLOW_ANONYMOUS_NEVER;

    /**
     * alt-pilot/alt-pilot-web action
     */
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

        Craft::info(sprintf('Queuing alt text generation for asset ID: %d on site ID: %d', $assetId, $siteId), "alt-pilot");


        $result = AltPilot::getInstance()->queueService->safelyCreateJob($asset);

        Craft::info(sprintf('Alt text generation queued for asset ID: %d on site ID: %d', $assetId, $siteId), "alt-pilot");

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

    public function actionGetPendingAltPilotJobCount(): Response
    {
        $this->requireAcceptsJson();
        return $this->successResponse([
            'count' => AltPilot::getInstance()->queueService->getPendingAltPilotJobCount(),
        ]);
    }

    public function actionGetStatusCounts(): Response
    {
        $this->requireAcceptsJson();

        $rows = (new Query())
            ->select(['status', 'count' => 'COUNT(*)'])
            ->from('{{%altpilot_metadata}}')
            ->groupBy(['status'])
            ->all();

        $counts = [
            AltPilotMetadata::STATUS_MISSING => 0,
            AltPilotMetadata::STATUS_AI_GENERATED => 0,
            AltPilotMetadata::STATUS_MANUAL => 0,
        ];
        $total = 0;

        foreach ($rows as $row) {
            $status = (int) $row['status'];
            $count = (int) $row['count'];
            if (isset($counts[$status])) {
                $counts[$status] = $count;
                $total += $count;
            }
        }

        return $this->successResponse([
            'counts' => $counts,
            'total' => $total,
        ]);
    }

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
        $elementsService = Craft::$app->getElements();

        foreach ($normalizedAltTexts as $siteId => $altText) {
            $asset = Craft::$app->assets->getAssetById($assetId, $siteId);
            if (!$asset) {
                return $this->errorResponse(sprintf('Asset %d not found for site %d', $assetId, $siteId), 404);
            }

            // Explicitly set the siteId to ensure correct site context when saving
            $asset->siteId = $siteId;
            $asset->alt = $altText;

            Craft::info(sprintf('Saving alt text for asset ID: %d, site ID: %d, alt text: %s', $assetId, $siteId, $altText), "alt-pilot");

            $behavior = $asset->getBehavior('altPilotMetadata');
            if ($behavior instanceof AltPilotMetadata) {
                $behavior->setStatus($altText === null || trim($altText) === '' ? AltPilotMetadata::STATUS_MISSING : AltPilotMetadata::STATUS_MANUAL);
            }

            if (!$elementsService->saveElement($asset)) {
                $errors = $asset->getErrors();
                Craft::error(sprintf('Failed to save asset alt text for asset ID: %d, site ID: %d. Errors: %s', $assetId, $siteId, json_encode($errors)), "alt-pilot");
                return $this->errorResponse(
                    'Failed to save asset alt text',
                    400,
                    [
                        'assetId' => $assetId,
                        'siteId' => $siteId,
                        'errors' => $errors,
                    ]
                );
            }

            Craft::info(sprintf('Successfully saved alt text for asset ID: %d, site ID: %d', $assetId, $siteId), "alt-pilot");

            $results[] = [
                'siteId' => (int) $siteId,
                'alt' => $altText,
            ];
        }

        return $this->successResponse([
            'assetId' => $assetId,
            'sites' => $results,
        ], 'Alt texts saved');
    }

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


    public function actionGetSingleAsset(): Response
    {
        $this->requireAcceptsJson();

        $assetIdParam = $this->request->getRequiredBodyParam('assetID');
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

        $uniqueAssetQuery = Asset::find()
            ->kind('image')
            ->siteId('*')
            ->unique()
            ->orderBy($orderBy);

        if ($queryParam !== null && $queryParam !== '') {
            $uniqueAssetQuery->search($queryParam);
        }

        $total = (clone $uniqueAssetQuery)->count();
        $assetIds = $uniqueAssetQuery
            ->offset($offset)
            ->limit($limit)
            ->ids();

        $assetIds = array_map('intval', $assetIds);

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

            $assetsByAssetId[$assetId][$siteKey] = $this->formatAssetForResponse($asset);
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

    private function formatAssetForResponse(Asset $asset): array
    {
        $behavior = $asset->getBehavior('altPilotMetadata');
        $status = $behavior instanceof AltPilotMetadata
            ? $behavior->getStatus()
            : AltPilotMetadata::STATUS_MISSING;

        $url = $asset->getUrl();
        if (!is_string($url)) {
            $url = '';
        }

        $altText = $asset->alt;
        $normalizedAltText = $altText === null || $altText === '' ? null : (string) $altText;

        return [
            'id' => (int) $asset->id,
            'siteId' => $asset->siteId === null ? null : (int) $asset->siteId,
            'url' => $url,
            'title' => (string) $asset->title,
            'alt' => $normalizedAltText,
            'status' => (int) $status,
        ];
    }

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
