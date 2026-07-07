<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function get(Request $request)
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            $profile = UserProfile::create([
                'user_id' => $request->user()->id,
                'preferences' => ['cart' => []]
            ]);
        }

        $cart = $profile->preferences['cart'] ?? [];

        return response()->json($cart);
    }

    public function update(Request $request)
    {
        $request->validate([
            'cart' => 'required|array'
        ]);

        $profile = $request->user()->profile;

        if (!$profile) {
            $profile = UserProfile::create([
                'user_id' => $request->user()->id,
                'preferences' => ['cart' => $request->cart]
            ]);
        } else {
            $preferences = $profile->preferences ?? [];
            $preferences['cart'] = $request->cart;
            $profile->update(['preferences' => $preferences]);
        }

        return response()->json([
            'message' => 'Cart updated successfully',
            'cart' => $profile->preferences['cart']
        ]);
    }

    public function merge(Request $request)
    {
        $request->validate([
            'guest_cart' => 'required|array'
        ]);

        $user = $request->user();
        $profile = $user->profile;

        if (!$profile) {
            $profile = UserProfile::create([
                'user_id' => $user->id,
                'preferences' => ['cart' => $request->guest_cart]
            ]);
        } else {
            $preferences = $profile->preferences ?? [];
            $dbCart = $preferences['cart'] ?? [];

            // Merge guest cart items into db cart items
            foreach ($request->guest_cart as $guestItem) {
                $foundIdx = -1;
                foreach ($dbCart as $idx => $dbItem) {
                    if ($dbItem['id'] === $guestItem['id'] && 
                        ($dbItem['selectedColor']['name'] ?? '') === ($guestItem['selectedColor']['name'] ?? '') &&
                        ($dbItem['selectedSize'] ?? '') === ($guestItem['selectedSize'] ?? '')) {
                        $foundIdx = $idx;
                        break;
                    }
                }

                if ($foundIdx !== -1) {
                    // Update quantity
                    $dbCart[$foundIdx]['qty'] += $guestItem['qty'];
                } else {
                    // Add new item
                    $dbCart[] = $guestItem;
                }
            }

            $preferences['cart'] = $dbCart;
            $profile->update(['preferences' => $preferences]);
        }

        return response()->json([
            'message' => 'Guest cart merged successfully',
            'cart' => $profile->preferences['cart']
        ]);
    }
}
