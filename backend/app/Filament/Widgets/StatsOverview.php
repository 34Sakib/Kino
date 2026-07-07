<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Review;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $totalSales = Order::where('payment_status', 'paid')->sum('total');
        $totalOrders = Order::count();
        
        $avgOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;
        
        $avgRating = Review::avg('rating') ?? 4.8;
        
        return [
            Stat::make('Total Revenue', '$' . number_format($totalSales, 2))
                ->description('Accumulated from paid orders')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
            Stat::make('Total Orders', $totalOrders)
                ->description('All order submissions')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('warning'),
            Stat::make('Average Order Value', '$' . number_format($avgOrderValue, 2))
                ->description('Per-transaction average')
                ->descriptionIcon('heroicon-m-presentation-chart-line')
                ->color('info'),
            Stat::make('Average Rating', number_format($avgRating, 1) . ' / 5.0')
                ->description('Customer satisfaction score')
                ->descriptionIcon('heroicon-m-star')
                ->color('primary'),
        ];
    }
}
