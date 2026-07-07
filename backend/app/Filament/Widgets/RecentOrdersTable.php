<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentOrdersTable extends BaseWidget
{
    protected static ?int $sort = 3;
    
    protected int | string | array $columnSpan = 'full';
    
    protected static ?string $heading = 'Recent Boutique Orders';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()->latest()->limit(5)
            )
            ->paginated(false)
            ->columns([
                Tables\Columns\TextColumn::make('order_number')
                    ->label('Order Number')
                    ->weight('semibold')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Customer Email')
                    ->icon('heroicon-m-envelope')
                    ->color('gray'),
                Tables\Columns\TextColumn::make('total')
                    ->label('Total Amount')
                    ->money('USD')
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('payment_status')
                    ->label('Payment')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'pending' => 'warning',
                        'failed' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('status')
                    ->label('Order Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'processing' => 'info',
                        'pending' => 'warning',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date Placed')
                    ->dateTime('M d, Y H:i')
                    ->color('gray'),
            ]);
    }
}
