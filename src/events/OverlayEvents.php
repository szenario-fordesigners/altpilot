<?php

namespace szenario\craftaltpilot\events;

use Craft;
use craft\events\TemplateEvent;
use craft\helpers\UrlHelper;
use craft\web\View;
use szenario\craftaltpilot\AltPilot;
use szenario\craftaltpilot\assetbundles\altpilotoverlay\AltPilotOverlayAsset;
use yii\base\Event;
use yii\web\Cookie;
use yii\web\User;

/**
 * Front-end image overlay.
 *
 * The script is injected into every site page, whatever the settings say:
 * pages may come from a static cache (e.g. Blitz) that was generated before the
 * setting changed or by a different user, so only the browser can ask. To keep
 * anonymous visitors from booting Craft on every page view, the script only
 * calls the server when the HINT_COOKIE is present. It's set on CP requests by
 * users with the plugin permission and removed on logout or when the server
 * rejects the call. It's only a hint; the controller does the real checks.
 */
final class OverlayEvents
{
    public const HINT_COOKIE = 'altpilot_overlay';

    private AltPilot $plugin;

    public function __construct(AltPilot $plugin)
    {
        $this->plugin = $plugin;
    }

    public function register(): void
    {
        Event::on(
            View::class,
            View::EVENT_BEFORE_RENDER_PAGE_TEMPLATE,
            function (TemplateEvent $event) {
                if (!$this->shouldInjectOverlay()) {
                    return;
                }

                // Both values are the same for every visitor, so they're safe in cached pages.
                $view = Craft::$app->getView();
                $view->registerJsVar('altPilotOverlay', [
                    'resolveUrl' => UrlHelper::rootRelativeUrl(UrlHelper::actionUrl('altpilot/overlay/resolve-images')),
                    'hintCookie' => self::HINT_COOKIE,
                ]);
                $view->registerAssetBundle(AltPilotOverlayAsset::class);
            }
        );

        // ponytail: set on CP requests only; a user who only ever logs in on the
        // front end gets no overlay until they open the CP once.
        Craft::$app->onInit(function () {
            $this->setHintCookieForCpUser();
        });

        Event::on(User::class, User::EVENT_AFTER_LOGOUT, function () {
            self::removeHintCookie();
        });
    }

    public static function removeHintCookie(): void
    {
        Craft::$app->getResponse()->getCookies()->remove(
            new Cookie(Craft::cookieConfig(['name' => self::HINT_COOKIE]))
        );
    }

    private function setHintCookieForCpUser(): void
    {
        $request = Craft::$app->getRequest();

        if (
            $request->getIsConsoleRequest() ||
            !$request->getIsCpRequest() ||
            $request->getCookies()->has(self::HINT_COOKIE) ||
            !Craft::$app->getUser()->checkPermission('accessPlugin-altpilot')
        ) {
            return;
        }

        // Session cookie, readable by the overlay script.
        Craft::$app->getResponse()->getCookies()->add(new Cookie(Craft::cookieConfig([
            'name' => self::HINT_COOKIE,
            'value' => '1',
            'httpOnly' => false,
        ])));
    }

    private function shouldInjectOverlay(): bool
    {
        $request = Craft::$app->getRequest();

        return (
            !$request->getIsConsoleRequest() &&
            !$request->getIsCpRequest() &&
            $request->getIsSiteRequest()
        );
    }
}
