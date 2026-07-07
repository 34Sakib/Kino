<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Set;
use Illuminate\Support\Str;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->required(),
                TextInput::make('name')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true),
                TextInput::make('tagline'),
                Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('original_price')
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                TextInput::make('badge'),
                Select::make('status')
                    ->options(['draft' => 'Draft', 'published' => 'Published', 'archived' => 'Archived'])
                    ->default('draft')
                    ->required(),
                Repeater::make('images')
                    ->relationship('images')
                    ->schema([
                        FileUpload::make('url')
                            ->label('Image File')
                            ->acceptedFileTypes(['image/*'])
                            ->disk('public')
                            ->visibility('public')
                            ->directory('products')
                            ->required(),
                        TextInput::make('sort_order')
                            ->numeric()
                            ->default(1),
                    ])
                    ->columns(2)
                    ->columnSpanFull(),
            ]);
    }
}
