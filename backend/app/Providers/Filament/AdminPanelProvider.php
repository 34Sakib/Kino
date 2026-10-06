<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Enums\ThemeMode;
use Filament\Support\Assets\Css;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->spa()
            ->brandName(function () {
                return \App\Models\Setting::current()?->company_name ?? 'Kino';
            })
            ->brandLogo(fn () => view('filament.logo'))
            ->brandLogoHeight('3.4rem')
            ->favicon(function () {
                $setting = \App\Models\Setting::current();
                if ($setting && $setting->favicon) {
                    return str_starts_with($setting->favicon, 'http') ? $setting->favicon : asset('storage/' . $setting->favicon);
                }
                return asset('favicon.ico');
            })
            ->font('Inter')
            ->defaultThemeMode(ThemeMode::Light)
            ->colors([
                'primary' => [
                    50 => '#FAF6EF',
                    100 => '#F5ECDF',
                    200 => '#EBD7BE',
                    300 => '#E0C29E',
                    400 => '#D0A873',
                    500 => '#B8935A', // Signature Kino Gold
                    600 => '#9C7A48', // Deep Gold
                    700 => '#7C6036',
                    800 => '#5C4626',
                    900 => '#3D2D18',
                    950 => '#21170A',
                ],
                'gray' => [
                    50 => '#FBF9F6',
                    100 => '#F6F3EF',
                    200 => '#F1EDE7',
                    300 => '#E8E2D9',
                    400 => '#D9D0C3',
                    500 => '#8C8681',
                    600 => '#5F5A56',
                    700 => '#433F3C',
                    800 => '#2C2A29',
                    900 => '#1E1C1B',
                    950 => '#121110',
                ],
                'success' => [
                    50 => '#F0F7F5',
                    100 => '#E0F0EB',
                    200 => '#B8DDD3',
                    300 => '#8FCABF',
                    400 => '#5AA895',
                    500 => '#3A7E6E', // Accent Teal
                    600 => '#2E6659',
                    700 => '#234F45',
                    800 => '#193931',
                    900 => '#10241F',
                    950 => '#0B1714',
                ],
                'danger' => [
                    50 => '#F9F2F4',
                    100 => '#F3E4E9',
                    200 => '#E4BDCA',
                    300 => '#D494A9',
                    400 => '#B86583',
                    500 => '#8B5A6B', // Accent Plum
                    600 => '#734656',
                    700 => '#5A3442',
                    800 => '#42242F',
                    900 => '#2B161E',
                    950 => '#1C0D13',
                ],
                'warning' => [
                    50 => '#FAF6EF',
                    100 => '#F5ECDF',
                    200 => '#EBD7BE',
                    300 => '#E0C29E',
                    400 => '#D0A873',
                    500 => '#B8935A',
                    600 => '#9C7A48',
                    700 => '#7C6036',
                    800 => '#5C4626',
                    900 => '#3D2D18',
                    950 => '#21170A',
                ],
                'info' => [
                    50 => '#F0F5FA',
                    100 => '#E1ECF5',
                    200 => '#BDD6E8',
                    300 => '#94BCDA',
                    400 => '#6B9FC9',
                    500 => '#4A7C9B',
                    600 => '#3B6580',
                    700 => '#2D4E63',
                    800 => '#203746',
                    900 => '#14222B',
                    950 => '#0C151B',
                ],
            ])
            ->navigationGroups([
                'Catalog',
                'Sales & Orders',
                'Content & CMS',
                'Customer & Inquiries',
                'Management & Settings',
            ])
            ->renderHook(
                \Filament\View\PanelsRenderHook::HEAD_END,
                fn () => view('filament.custom-styles')
            )
            ->renderHook(
                \Filament\View\PanelsRenderHook::STYLES_AFTER,
                fn () => view('filament.custom-styles')
            )
            ->assets([
                Css::make('custom-filament-styles', asset('css/custom-filament.css')),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                \App\Filament\Widgets\StatsOverview::class,
                \App\Filament\Widgets\SalesChart::class,
                \App\Filament\Widgets\RecentOrdersTable::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
