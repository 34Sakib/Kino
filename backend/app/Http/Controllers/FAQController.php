<?php

namespace App\Http\Controllers;

use App\Models\FAQ;
use Illuminate\Http\Request;

class FAQController extends Controller
{
    public function index()
    {
        $faqs = FAQ::orderBy('sort_order')->orderBy('created_at')->get();

        // Group FAQs by category to match the frontend structure
        $grouped = $faqs->groupBy('category')->map(function ($items, $category) {
            return [
                'category' => $category,
                'items' => $items->map(function ($item) {
                    return [
                        'q' => $item->question,
                        'a' => $item->answer
                    ];
                })->values()
            ];
        })->values();

        return response()->json($grouped);
    }
}
