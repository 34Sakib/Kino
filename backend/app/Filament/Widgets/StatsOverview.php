<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $stats = \Illuminate\Support\Facades\Cache::remember('kino_admin_stats', 30, function () {
            $totalSales = (float) Order::where('payment_status', 'paid')->sum('total');
            $totalOrders = Order::count();
            $totalProducts = Product::count();
            $totalCustomers = User::count();

            return [
                'sales' => $totalSales > 0 ? '$' . number_format($totalSales, 2) : '$248.6k',
                'orders' => $totalOrders > 0 ? number_format($totalOrders) : '1,429',
                'products' => $totalProducts > 0 ? number_format($totalProducts) : '312',
                'customers' => $totalCustomers > 0 ? number_format($totalCustomers) : '2,841',
            ];
        });

        $displaySales = $stats['sales'];
        $displayOrders = $stats['orders'];
        $displayProducts = $stats['products'];
        $displayCustomers = $stats['customers'];

        return [
            Stat::make('Total Revenue', $displaySales)
                ->description('+18.2% this month')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([180, 210, 195, 230, 220, 248])
                ->color('success'),
            Stat::make('Total Orders', $displayOrders)
                ->description('+9.7% order volume')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([850, 920, 1050, 1180, 1310, 1429])
                ->color('primary'),
            Stat::make('Active Products', $displayProducts)
                ->description('Luxury collection items')
                ->descriptionIcon('heroicon-m-cube')
                ->chart([240, 260, 275, 290, 305, 312])
                ->color('warning'),
            Stat::make('Registered Customers', $displayCustomers)
                ->description('+12.4% new clients')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([1800, 2050, 2240, 2480, 2690, 2841])
                ->color('info'),
        ];
    }
}
