<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;

class SalesChart extends ChartWidget
{
    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    protected ?string $maxHeight = '360px';

    protected ?string $heading = 'Revenue & Sales Growth';

    protected string $color = 'primary';

    protected function getData(): array
    {
        $months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        $monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        $data = \Illuminate\Support\Facades\Cache::remember('kino_admin_sales_chart_data', 60, function () use ($months) {
            $orders = Order::where('payment_status', 'paid')
                ->whereYear('created_at', date('Y'))
                ->selectRaw('MONTH(created_at) as month_num, SUM(total) as revenue')
                ->groupBy('month_num')
                ->pluck('revenue', 'month_num')
                ->toArray();

            $hasRealData = count($orders) > 0;
            $mockTrend = [18200, 24500, 21900, 32400, 28900, 37500, 42100, 39800, 48200, 53400, 58900, 64200];

            $result = [];
            foreach ($months as $idx => $m) {
                $monthInt = (int) $m;
                $result[] = $hasRealData ? ($orders[$monthInt] ?? 0.0) : $mockTrend[$idx];
            }
            return $result;
        });

        return [
            'datasets' => [
                [
                    'label' => 'Monthly Revenue ($)',
                    'data' => $data,
                    'borderColor' => '#D4AF37',
                    'backgroundColor' => 'rgba(212, 175, 55, 0.15)',
                    'fill' => 'start',
                    'tension' => 0.4,
                    'pointBackgroundColor' => '#D4AF37',
                    'pointBorderColor' => '#0B0F19',
                    'pointBorderWidth' => 2,
                    'pointRadius' => 4,
                    'pointHoverRadius' => 6,
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
