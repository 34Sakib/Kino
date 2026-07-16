<?php

namespace App\Http\Controllers;

use App\Models\PageSection;
use Illuminate\Http\Request;

class PageSectionController extends Controller
{
    public function show($key)
    {
        $section = PageSection::where('section_key', $key)->firstOrFail();
        return response()->json($section);
    }

    public function index()
    {
        // Return sections keyed by their section_key for easy client-side lookup
        $sections = PageSection::all()->keyBy('section_key');
        return response()->json($sections);
    }
}
