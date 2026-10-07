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
            ->font('Inter')
            ->defaultThemeMode(ThemeMode::Dark)
            ->colors([
                'primary' => [
                    50 => '#FDFBF7',
                    100 => '#FAF4E8',
                    200 => '#F3E5C7',
                    300 => '#EBD2A0',
                    400 => '#E0BC72',
                    500 => '#D4AF37', // Signature Radiant Champagne Gold
                    600 => '#B89226',
                    700 => '#91701B',
                    800 => '#6E5316',
                    900 => '#4D3810',
                    950 => '#2B1E08',
                ],
                'gray' => [
                    50 => '#F8FAFC',
                    100 => '#F1F5F9',
                    200 => '#E2E8F0',
                    300 => '#CBD5E1',
                    400 => '#94A3B8',
                    500 => '#64748B',
                    600 => '#475569',
                    700 => '#334155',
                    800 => '#1E293B',
                    900 => '#0F172A',
                    950 => '#0B0F19', // Cool Midnight Titanium Canvas
                ],
                'success' => [
                    50 => '#ECFDF5',
                    100 => '#D1FAE5',
                    200 => '#A7F3D0',
                    300 => '#6EE7B7',
                    400 => '#34D399',
                    500 => '#10B981', // Radiant Emerald
                    600 => '#059669',
                    700 => '#047857',
                    800 => '#065F46',
                    900 => '#064E3B',
                    950 => '#022C22',
                ],
                'danger' => [
                    50 => '#FFF1F2',
                    100 => '#FFE4E6',
                    200 => '#FECDD3',
                    300 => '#FDA4AF',
                    400 => '#FB7185',
                    500 => '#F43F5E', // Luminous Rose/Crimson
                    600 => '#E11D48',
                    700 => '#BE123C',
                    800 => '#9F1239',
                    900 => '#881337',
                    950 => '#4C0519',
                ],
                'warning' => [
                    50 => '#FFFBEB',
                    100 => '#FEF3C7',
                    200 => '#FDE68A',
                    300 => '#FCD34D',
                    400 => '#FBBF24',
                    500 => '#F59E0B', // Radiant Amber
                    600 => '#D97706',
                    700 => '#B45309',
                    800 => '#92400E',
                    900 => '#78350F',
                    950 => '#451A03',
                ],
                'info' => [
                    50 => '#F0F9FF',
                    100 => '#E0F2FE',
                    200 => '#BAE6FD',
                    300 => '#7DD3FC',
                    400 => '#38BDF8', // Cool Ice Sapphire
                    500 => '#0EA5E9',
                    600 => '#0284C7',
                    700 => '#0369A1',
                    800 => '#075985',
                    900 => '#0C4A6E',
                    950 => '#082F49',
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
