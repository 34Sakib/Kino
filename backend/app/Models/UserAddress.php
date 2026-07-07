<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    protected $fillable = [
        'user_id', 'type', 'first_name', 'last_name', 
        'address_line1', 'address_line2', 'city', 
        'state', 'zip', 'country', 'phone'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
