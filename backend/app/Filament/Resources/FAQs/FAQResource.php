<?php

namespace App\Filament\Resources\FAQs;

use App\Filament\Resources\FAQs\Pages\CreateFAQ;
use App\Filament\Resources\FAQs\Pages\EditFAQ;
use App\Filament\Resources\FAQs\Pages\ListFAQs;
use App\Filament\Resources\FAQs\Schemas\FAQForm;
use App\Filament\Resources\FAQs\Tables\FAQsTable;
use App\Models\FAQ;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FAQResource extends Resource
{
    protected static ?string $model = FAQ::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQuestionMarkCircle;

    protected static ?string $recordTitleAttribute = 'question';

    public static function form(Schema $schema): Schema
    {
        return FAQForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FAQsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFAQs::route('/'),
            'create' => CreateFAQ::route('/create'),
            'edit' => EditFAQ::route('/{record}/edit'),
        ];
    }
}
