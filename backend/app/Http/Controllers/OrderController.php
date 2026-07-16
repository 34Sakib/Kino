<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with(['items.product', 'items.variant'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform database records into the format expected by the frontend
        $transformedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'date' => $order->created_at->format('F d, Y'),
                'status' => $order->status,
                'pricing' => [
                    'subtotal' => (float)$order->subtotal,
                    'discount' => (float)$order->discount,
                    'shipping' => (float)$order->shipping_cost,
                    'tax' => (float)$order->tax,
                    'total' => (float)$order->total,
                ],
                'items' => $order->items->map(function ($item) {
                    $selectedColor = null;
                    $selectedSize = null;

                    // Unpack color/size details if they exist in selected_options
                    if (is_array($item->selected_options)) {
                        foreach ($item->selected_options as $opt) {
                            if (isset($opt['name'])) {
                                if (strtolower($opt['name']) === 'color') {
                                    $selectedColor = [
                                        'name' => $opt['value'],
                                        'hex' => $opt['meta'] ?? '#000000'
                                    ];
                                }
                                if (strtolower($opt['name']) === 'size') {
                                    $selectedSize = $opt['value'];
                                }
                            }
                        }
                    }

                    return [
                        'id' => $item->product_id,
                        'name' => $item->product->name,
                        'price' => (float)$item->price,
                        'qty' => $item->quantity,
                        'selectedColor' => $selectedColor,
                        'selectedSize' => $selectedSize
                    ];
                })
            ];
        });

        return response()->json($transformedOrders);
    }

    public function track(Request $request, $orderNumber)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $email = $request->query('email');

        $order = \App\Models\Order::where('order_number', $orderNumber)
            ->where('email', $email)
            ->with(['shipment', 'statusHistories', 'items.product'])
            ->first();

        if (!$order) {
            // Check via user table email fallback
            $order = \App\Models\Order::where('order_number', $orderNumber)
                ->whereHas('user', function ($q) use ($email) {
                    $q->where('email', $email);
                })
                ->with(['shipment', 'statusHistories', 'items.product'])
                ->first();
        }

        if (!$order) {
            return response()->json(['error' => 'Order not found with matching credentials.'], 404);
        }

        $history = $order->statusHistories->map(function ($h) {
            return [
                'status' => ucfirst($h->status),
                'location' => 'Kino Atelier Center',
                'date' => $h->created_at->format('F d, Y'),
                'time' => $h->created_at->format('h:i A'),
                'detail' => $h->notes ?? "Order transitioned to " . $h->status
            ];
        });

        if ($history->isEmpty()) {
            $history = collect([[
                'status' => 'Authorized',
                'location' => 'Kino Atelier Center',
                'date' => $order->created_at->format('F d, Y'),
                'time' => $order->created_at->format('h:i A'),
                'detail' => 'Payment validation and checkout log authorized.'
            ]]);
        }

        $address = \App\Models\UserAddress::where('user_id', $order->user_id)
            ->where('type', 'shipping')
            ->first();

        $shippingData = [
            'firstName' => $address ? $address->first_name : ($order->user ? explode(' ', $order->user->name)[0] : 'Valued'),
            'lastName' => $address ? $address->last_name : ($order->user ? (explode(' ', $order->user->name)[1] ?? 'Collector') : 'Collector'),
            'address' => $address ? $address->address_line1 : 'Handled by Kino Logistics',
            'city' => $address ? $address->city : 'Copenhagen',
            'zip' => $address ? $address->zip : 'DK-1050',
            'country' => $address ? $address->country : 'Denmark'
        ];

        $itemsData = $order->items->map(function ($item) {
            return [
                'name' => $item->product ? $item->product->name : 'Atelier Object',
                'qty' => $item->quantity,
                'price' => (float)$item->price
            ];
        });

        $pricingData = [
            'total' => (float)$order->total
        ];

        return response()->json([
            'order_number' => $order->order_number,
            'status' => $order->status,
            'tracking_number' => $order->shipment ? $order->shipment->tracking_number : 'PENDING-DISPATCH',
            'carrier' => $order->shipment ? $order->shipment->carrier : 'Kino Premium Delivery',
            'history' => $history,
            'shipping' => $shippingData,
            'items' => $itemsData,
            'pricing' => $pricingData
        ]);
    }
}
