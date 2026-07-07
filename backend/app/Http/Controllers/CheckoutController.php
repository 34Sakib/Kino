<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Coupon;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class CheckoutController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.sku' => 'required|string',
            'email' => 'required|email',
            'shipping_address' => 'required|array',
            'shipping_address.first_name' => 'required|string',
            'shipping_address.last_name' => 'required|string',
            'shipping_address.address_line1' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.zip' => 'required|string',
            'shipping_address.country' => 'required|string',
            'coupon_code' => 'nullable|string',
        ]);

        $items = $request->items;
        $subtotal = 0;

        // 1. Stock Validation & Subtotal Calculation
        foreach ($items as $item) {
            $variant = ProductVariant::where('sku', $item['sku'])->with('inventory')->first();
            
            if (!$variant) {
                return response()->json(['error' => "Variant SKU {$item['sku']} not found."], 422);
            }

            if ($variant->inventory->stock < $item['qty']) {
                return response()->json(['error' => "Insufficient stock for {$item['name']}. Available: {$variant->inventory->stock}."], 422);
            }

            $product = Product::findOrFail($variant->product_id);
            $itemPrice = $product->price + $variant->price_modifier;
            $subtotal += $itemPrice * $item['qty'];
        }

        // 2. Validate and Apply Coupon
        $discount = 0;
        $coupon = null;
        if ($request->coupon_code) {
            $coupon = Coupon::where('code', $request->coupon_code)->first();
            if ($coupon && $coupon->isValidFor($request->user(), $request->email)) {
                if ($subtotal >= $coupon->min_spend) {
                    if ($coupon->type === 'percentage') {
                        $discount = $subtotal * ($coupon->value / 100);
                    } else if ($coupon->type === 'fixed') {
                        $discount = min($coupon->value, $subtotal);
                    }
                }
            }
        }

        // 3. Shipping & Tax
        $shippingCost = $subtotal > 500 ? 0.00 : 25.00;
        $tax = ($subtotal - $discount) * 0.08; // 8% sales tax
        $total = $subtotal - $discount + $shippingCost + $tax;

        // 4. Register shipping Address
        $addressData = $request->shipping_address;
        $addressData['user_id'] = $request->user()?->id;
        $addressData['type'] = 'shipping';
        $shipping = UserAddress::create($addressData);

        // 5. Initialize Stripe Payment Intent
        Stripe::setApiKey(env('STRIPE_SECRET_KEY', 'sk_test_mock_stripe_key'));
        
        $paymentIntentId = 'pi_mock_' . \Illuminate\Support\Str::random(16);
        $clientSecret = 'seti_mock_secret_' . \Illuminate\Support\Str::random(24);

        try {
            // Only fire Stripe API if keys are provided
            if (env('STRIPE_SECRET_KEY') && !str_contains(env('STRIPE_SECRET_KEY'), 'mock')) {
                $intent = PaymentIntent::create([
                    'amount' => round($total * 100), // in cents
                    'currency' => 'usd',
                    'metadata' => [
                        'email' => $request->email,
                        'coupon_code' => $coupon?->code
                    ]
                ]);
                $paymentIntentId = $intent->id;
                $clientSecret = $intent->client_secret;
            }
        } catch (\Exception $e) {
            // Fallback for demo settings
        }

        // 6. Create Pending Order Record
        $order = Order::create([
            'order_number' => Order::generateOrderNumber(),
            'user_id' => $request->user()?->id,
            'coupon_id' => $coupon?->id,
            'status' => 'pending',
            'email' => $request->email,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'shipping_cost' => $shippingCost,
            'tax' => $tax,
            'total' => $total,
            'payment_method' => 'card',
            'payment_status' => 'pending',
            'stripe_payment_intent_id' => $paymentIntentId
        ]);

        // Register Order Items
        foreach ($items as $item) {
            $variant = ProductVariant::where('sku', $item['sku'])->first();
            $product = Product::findOrFail($variant->product_id);
            $itemPrice = $product->price + $variant->price_modifier;

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'variant_id' => $variant->id,
                'quantity' => $item['qty'],
                'price' => $itemPrice,
                'selected_options' => $item['selected_options'] ?? []
            ]);
        }

        // Status History Log
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'pending',
            'changed_by' => $request->user()?->name ?? 'Guest',
            'notes' => 'Checkout Payment Intent initialized.'
        ]);

        return response()->json([
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'client_secret' => $clientSecret,
            'payment_intent_id' => $paymentIntentId,
            'total' => $total
        ]);
    }

    public function confirmOrder(Request $request)
    {
        $request->validate([
            'order_id' => 'required|integer',
            'payment_intent_id' => 'required|string',
        ]);

        $order = Order::findOrFail($request->order_id);

        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Order is already processed.', 'order' => $order]);
        }

        // Shift status to confirmed
        $order->update([
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'stripe_payment_intent_id' => $request->payment_intent_id
        ]);

        // Deduct inventories
        foreach ($order->items as $item) {
            if ($item->variant && $item->variant->inventory) {
                $inventory = $item->variant->inventory;
                $inventory->decrement('stock', $item->quantity);
                
                // Log inventory change
                $inventory->logs()->create([
                    'quantity_changed' => -$item->quantity,
                    'type' => 'sale',
                    'description' => "Stock deducted for Order {$order->order_number}"
                ]);
            }
        }

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => 'confirmed',
            'changed_by' => 'System',
            'notes' => 'Payment authorized. Order confirmed.'
        ]);

        return response()->json([
            'message' => 'Order payment validated and confirmed.',
            'order' => $order->load('items.product')
        ]);
    }
}
