<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code', 'type', 'value', 'min_spend', 
        'max_uses', 'uses_per_user', 'starts_at', 'expires_at'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function usages()
    {
        return $this->hasMany(CouponUsage::class);
    }

    public function isValidFor(User $user = null, $email = null)
    {
        $now = now();
        if ($this->starts_at && $this->starts_at->isFuture()) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;

        // Check max uses
        if ($this->max_uses && $this->usages()->count() >= $this->max_uses) return false;

        // Check uses per user
        if ($user) {
            $userUses = $this->usages()->where('user_id', $user->id)->count();
            if ($userUses >= $this->uses_per_user) return false;
        } elseif ($email) {
            $emailUses = $this->usages()->where('email', $email)->count();
            if ($emailUses >= $this->uses_per_user) return false;
        }

        return true;
    }
}
