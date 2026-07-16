<?php

namespace App\Filament\Resources\Settings\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Table;

class SettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('company_name')
                    ->searchable()
                    ->sortable(),
                ImageColumn::make('logo')
                    ->disk('public'),
                ImageColumn::make('favicon')
                    ->disk('public'),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
