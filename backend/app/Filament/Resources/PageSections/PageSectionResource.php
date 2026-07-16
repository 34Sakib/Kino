<?php

namespace App\Filament\Resources\PageSections;

use App\Filament\Resources\PageSections\Pages\EditPageSection;
use App\Filament\Resources\PageSections\Pages\ListPageSections;
use App\Filament\Resources\PageSections\Schemas\PageSectionForm;
use App\Filament\Resources\PageSections\Tables\PageSectionsTable;
use App\Models\PageSection;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PageSectionResource extends Resource
{
    protected static ?string $model = PageSection::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static ?string $recordTitleAttribute = 'section_key';

    public static function form(Schema $schema): Schema
    {
        return PageSectionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PageSectionsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPageSections::route('/'),
            'edit' => EditPageSection::route('/{record}/edit'),
        ];
    }
}
