<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        // Fetch recent high-quality reviews to act as global impressions/testimonials
        $reviews = Review::where('status', 'approved')
            ->where('rating', '>=', 4)
            ->with(['user', 'product'])
            ->latest()
            ->limit(10)
            ->get();

        $transformed = $reviews->map(function ($rev) {
            return [
                'id' => $rev->id,
                'name' => $rev->user ? $rev->user->name : 'Anonymous Client',
                'rating' => $rev->rating,
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
                'role' => 'Verified Collector',
                'content' => $rev->body,
                'date' => $rev->created_at->format('F d, Y'),
                'verified' => $rev->is_verified_purchase
            ];
        });

        return response()->json($transformed);
    }

    public function productReviews($productId)
    {
        // Resolve product ID if slug is passed
        if (!is_numeric($productId)) {
            $product = Product::where('slug', $productId)->first();
            $productId = $product ? $product->id : 0;
        }

        $reviews = Review::where('product_id', $productId)
            ->where('status', 'approved')
            ->with('user')
            ->latest()
            ->get();

        $transformed = $reviews->map(function ($rev) {
            return [
                'id' => $rev->id,
                'name' => $rev->user ? $rev->user->name : 'Anonymous Client',
                'rating' => $rev->rating,
                'comment' => $rev->body,
                'date' => $rev->created_at->format('F d, Y'),
                'verified' => $rev->is_verified_purchase
            ];
        });

        return response()->json($transformed);
    }

    public function store(Request $request, $productId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'body' => 'required|string|min:5',
        ]);

        // Resolve product
        if (is_numeric($productId)) {
            $product = Product::find($productId);
        } else {
            $product = Product::where('slug', $productId)->first();
        }

        if (!$product) {
            return response()->json(['error' => 'Product not found.'], 404);
        }

        $user = $request->user();

        // Check if the user has a confirmed order for this product
        $hasPurchased = Order::where('user_id', $user->id)
            ->where('status', 'confirmed')
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })->exists();

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => $request->rating,
            'body' => $request->body,
            'is_verified_purchase' => $hasPurchased,
            'status' => 'approved', // Auto-approved for this application context
        ]);

        return response()->json([
            'message' => 'Review published successfully.',
            'review' => [
                'id' => $review->id,
                'name' => $user->name,
                'rating' => $review->rating,
                'comment' => $review->body,
                'date' => $review->created_at->format('F d, Y'),
                'verified' => $review->is_verified_purchase
            ]
        ], 201);
    }
}
