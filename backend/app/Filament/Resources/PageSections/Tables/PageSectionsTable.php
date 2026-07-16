<?php

namespace App\Filament\Resources\PageSections\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PageSectionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('section_key')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('title')
                    ->searchable(),
                TextColumn::make('subtitle')
                    ->searchable(),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
