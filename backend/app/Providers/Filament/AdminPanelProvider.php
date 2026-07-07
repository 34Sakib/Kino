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
            ->brandName('Kino Design')
            ->brandLogo(fn () => view('filament.logo'))
            ->favicon(asset('favicon.ico'))
            ->font('Outfit')
            ->defaultThemeMode(ThemeMode::Light)
            ->colors([
                'primary' => [
                    50 => '#fdfcf7',
                    100 => '#fbf7eb',
                    200 => '#f5ebcd',
                    300 => '#eeddaf',
                    400 => '#e8ce91',
                    500 => '#e8b86d', // Gold
                    600 => '#d09f53',
                    700 => '#a87e3d',
                    800 => '#7f5d2b',
                    900 => '#563e1c',
                    950 => '#3a2912',
                ],
                'gray' => [
                    50 => '#f9f9f9',
                    100 => '#f3f3f3',
                    200 => '#e3e3e3',
                    300 => '#c8c8c8',
                    400 => '#a4a4a4',
                    500 => '#818181',
                    600 => '#666666',
                    700 => '#4d4d4d',
                    800 => '#1e1e1e', // Surface Dark
                    900 => '#0d0d0d', // Near Black
                    950 => '#050505',
                ],
            ])
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
