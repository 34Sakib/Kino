<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = ['company_name', 'logo', 'favicon'];

    protected static function booted()
    {
        static::saved(function () {
            Cache::forget('kino_site_setting');
        });

        static::deleted(function () {
            Cache::forget('kino_site_setting');
        });
    }

    public static function current(): ?self
    {
        return Cache::remember('kino_site_setting', 3600, function () {
            return static::first();
        });
    }
}

