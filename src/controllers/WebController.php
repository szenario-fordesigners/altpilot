<?php

namespace szenario\craftaltpilot\controllers;

use Craft;
use craft\web\Controller;
use craft\elements\Asset;
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

        return $this->successResponse([
            'jobId' => $result['jobId'] ?? null,
            'queueStatus' => $result['status'] ?? 'queued',
        ], $result['message'] ?? 'Alt text generation queued');
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

        $siteResolution = $this->resolveSiteId('query');
        if ($siteResolution['error'] !== null) {
            return $this->errorResponse($siteResolution['error']);
        }
        $siteId = $siteResolution['siteId'];

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

        $assetQuery = Asset::find()
            ->kind('image')
            ->siteId($siteId === 'all' ? '*' : $siteId)
            ->orderBy('dateCreated DESC');

        $total = (clone $assetQuery)->count();
        $assets = $assetQuery
            ->offset($offset)
            ->limit($limit)
            ->all();


        $assetsByAssetId = [];
        foreach ($assets as $asset) {
            $assetsByAssetId[$asset->id][$asset->siteId] = $asset;
        }

        return $this->successResponse([
            'assets' => $assetsByAssetId,
            'pagination' => [
                'limit' => $limit,
                'offset' => $offset,
                'total' => $total,
                'hasMore' => ($offset + $limit) < $total,
            ],
        ], 'Assets fetched');
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
