<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $fillable = [
        'section_key', 'title', 'subtitle', 'description', 
        'cta_text', 'cta_link', 'image_url', 'meta_data'
    ];

    protected $casts = [
        'meta_data' => 'array',
    ];
}
