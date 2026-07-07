<?php

namespace App\Filament\Resources\Coupons\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CouponForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('code')
                    ->required(),
                Select::make('type')
                    ->options(['percentage' => 'Percentage', 'fixed' => 'Fixed', 'free_shipping' => 'Free shipping'])
                    ->required(),
                TextInput::make('value')
                    ->required()
                    ->numeric(),
                TextInput::make('min_spend')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('max_uses')
                    ->numeric(),
                TextInput::make('uses_per_user')
                    ->required()
                    ->numeric()
                    ->default(1),
                DateTimePicker::make('starts_at'),
                DateTimePicker::make('expires_at'),
            ]);
    }
}
