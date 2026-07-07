<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with('category', 'images');

        // Filter by category slug
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Search text
        if ($request->has('q') && !empty($request->q)) {
            $search = strtolower($request->q);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('tagline', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by price bounds
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sorting
        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Paginate results
        $perPage = $request->get('limit', 24);
        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    public function show($idOrSlug)
    {
        $query = Product::where(function ($q) use ($idOrSlug) {
            if (is_numeric($idOrSlug)) {
                $q->where('id', $idOrSlug);
            } else {
                $q->where('slug', $idOrSlug);
            }
        })->with(['category', 'images', 'variants.inventory', 'reviews.user']);

        $product = $query->firstOrFail();

        // Calculate aggregate rating parameters
        $reviewsCount = $product->reviews()->count();
        $averageRating = $reviewsCount > 0 ? round($product->reviews()->avg('rating'), 1) : 0;

        return response()->json([
            'product' => $product,
            'rating_summary' => [
                'average' => $averageRating,
                'count' => $reviewsCount
            ]
        ]);
    }

    public function related($id)
    {
        $product = Product::findOrFail($id);

        $related = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('images', 'category')
            ->limit(4)
            ->get();

        // Fallback to top products if category lacks depth
        if ($related->count() < 4) {
            $additional = Product::where('id', '!=', $product->id)
                ->whereNotIn('id', $related->pluck('id'))
                ->with('images', 'category')
                ->limit(4 - $related->count())
                ->get();
            $related = $related->merge($additional);
        }

        return response()->json($related);
    }

    public function categories()
    {
        return response()->json(Category::withCount('products')->get());
    }
}
