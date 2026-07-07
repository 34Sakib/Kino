<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

class SalesChart extends ChartWidget
{
    protected ?string $heading = 'Monthly Revenue Trend';
    
    protected string $color = 'primary';

    protected function getData(): array
    {
        // Fetch paid orders of current year
        $orders = Order::where('payment_status', 'paid')
            ->whereYear('created_at', date('Y'))
            ->get();

        $monthlyRevenue = [];
        foreach ($orders as $order) {
            $month = $order->created_at->format('m');
            $monthlyRevenue[$month] = ($monthlyRevenue[$month] ?? 0.0) + (float) $order->total;
        }

        $data = [];
        $months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        foreach ($months as $m) {
            $data[] = $monthlyRevenue[$m] ?? 0.0;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Revenue ($)',
                    'data' => $data,
                    'borderColor' => '#E8B86D',
                    'backgroundColor' => 'rgba(232, 184, 109, 0.1)',
                    'fill' => 'start',
                    'tension' => 0.4,
                ],
            ],
            'labels' => $monthNames,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
