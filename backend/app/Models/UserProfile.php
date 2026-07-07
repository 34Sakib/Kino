<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = ['user_id', 'avatar', 'phone', 'preferences'];

    protected $casts = [
        'preferences' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
