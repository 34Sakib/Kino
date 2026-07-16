<?php

namespace App\Filament\Resources\Settings\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('company_name')
                    ->required()
                    ->columnSpanFull(),
                FileUpload::make('logo')
                    ->acceptedFileTypes(['image/*'])
                    ->disk('public')
                    ->visibility('public')
                    ->directory('settings')
                    ->columnSpanFull(),
                FileUpload::make('favicon')
                    ->acceptedFileTypes(['image/*'])
                    ->disk('public')
                    ->visibility('public')
                    ->directory('settings')
                    ->columnSpanFull(),
            ]);
    }
}
