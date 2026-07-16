<?php

namespace App\Filament\Resources\Posts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Set;
use Illuminate\Support\Str;
use Filament\Schemas\Schema;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, $set) => $set('slug', Str::slug($state))),
                TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true),
                TextInput::make('read_time')
                    ->placeholder('e.g. 5 min read'),
                DateTimePicker::make('published_at'),
                Textarea::make('excerpt')
                    ->columnSpanFull(),
                Textarea::make('body')
                    ->required()
                    ->rows(10)
                    ->columnSpanFull(),
                TextInput::make('image_url')
                    ->columnSpanFull(),
            ]);
    }
}
