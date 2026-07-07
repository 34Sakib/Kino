<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    protected $fillable = ['order_id', 'carrier', 'tracking_number', 'status', 'shipped_at'];

    protected $casts = [
        'shipped_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
