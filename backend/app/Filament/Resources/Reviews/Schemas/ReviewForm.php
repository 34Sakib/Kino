<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('product_id')
                    ->required()
                    ->numeric(),
                TextInput::make('order_id')
                    ->numeric(),
                TextInput::make('rating')
                    ->required()
                    ->numeric(),
                TextInput::make('title'),
                Textarea::make('body')
                    ->required()
                    ->columnSpanFull(),
                Toggle::make('is_verified_purchase')
                    ->required(),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                TextInput::make('helpful_count')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
