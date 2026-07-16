<?php

namespace App\Filament\Resources\FAQs\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class FAQForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('category')
                    ->required()
                    ->placeholder('e.g. Sourcing & Materials'),
                TextInput::make('question')
                    ->required(),
                Textarea::make('answer')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('sort_order')
                    ->integer()
                    ->default(0)
                    ->required(),
            ]);
    }
}
