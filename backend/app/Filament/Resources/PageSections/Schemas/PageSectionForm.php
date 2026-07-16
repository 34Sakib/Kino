<?php

namespace App\Filament\Resources\PageSections\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\KeyValue;
use Filament\Schemas\Schema;

class PageSectionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('section_key')
                    ->required()
                    ->disabled()
                    ->dehydrated(true)
                    ->columnSpanFull(),
                TextInput::make('title')
                    ->required(),
                TextInput::make('subtitle'),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('cta_text'),
                TextInput::make('cta_link'),
                TextInput::make('image_url')
                    ->columnSpanFull(),
                Textarea::make('meta_data')
                    ->columnSpanFull()
                    ->rows(10)
                    ->rules(['json'])
                    ->helperText('Input configuration parameters in valid JSON format. Example: {"email": "atelier@kino.design"}')
                    ->afterStateHydrated(fn ($component, $state) => $component->state(json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)))
                    ->dehydrateStateUsing(fn ($state) => json_decode($state, true)),
            ]);
    }
}
