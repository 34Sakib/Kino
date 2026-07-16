<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlistItems = $request->user()->wishlists()
            ->with(['product.category', 'product.images', 'product.variants.inventory'])
            ->get();

        // Map product items through standard product structure
        $products = $wishlistItems->map(function ($item) {
            return $item->product;
        })->filter();

        return response()->json($products->values());
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required'
        ]);

        $productId = $request->product_id;
        $user = $request->user();

        // Verify product exists
        if (is_numeric($productId)) {
            $product = Product::find($productId);
        } else {
            $product = Product::where('slug', $productId)->first();
        }

        if (!$product) {
            return response()->json(['error' => 'Product not found.'], 404);
        }

        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($exists) {
            $exists->delete();
            return response()->json([
                'status' => 'removed',
                'message' => 'Product removed from wishlist.'
            ]);
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $product->id
            ]);
            return response()->json([
                'status' => 'added',
                'message' => 'Product added to wishlist.'
            ]);
        }
    }
}
