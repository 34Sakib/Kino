<?php

namespace App\Filament\Resources\FAQs\Pages;

use App\Filament\Resources\FAQs\FAQResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFAQs extends ListRecords
{
    protected static string $resource = FAQResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
