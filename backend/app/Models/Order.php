<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'coupon_id', 'status', 'email', 
        'subtotal', 'discount', 'shipping_cost', 'tax', 'total', 
        'payment_method', 'payment_status', 'stripe_payment_intent_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function shipment()
    {
        return $this->hasOne(Shipment::class);
    }

    public static function generateOrderNumber()
    {
        $year = date('Y');
        $random = str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
        $number = "ORD-{$year}-{$random}";

        while (self::where('order_number', $number)->exists()) {
            $random = str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
            $number = "ORD-{$year}-{$random}";
        }

        return $number;
    }
}
