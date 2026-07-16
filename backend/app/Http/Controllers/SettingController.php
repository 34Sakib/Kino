<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $setting = Setting::firstOrCreate(
            ['id' => 1],
            ['company_name' => 'Kino Atelier']
        );
        return response()->json($setting);
    }
}
