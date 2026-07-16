<?php

namespace App\Filament\Resources\ContactMessages\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class ContactMessageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->disabled()
                    ->required(),
                TextInput::make('email')
                    ->disabled()
                    ->required(),
                TextInput::make('phone')
                    ->disabled(),
                TextInput::make('subject')
                    ->disabled(),
                Select::make('status')
                    ->options([
                        'unread' => 'Unread',
                        'read' => 'Read',
                        'archived' => 'Archived',
                    ])
                    ->required(),
                Textarea::make('message')
                    ->disabled()
                    ->required()
                    ->rows(8)
                    ->columnSpanFull(),
            ]);
    }
}
