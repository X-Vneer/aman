<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'video_id',
        'user_video_id',
        'order_id',
        'status',
        'card',
        'request',
        'response',
        'trans_id',
        'hash',
        'result',
    ];

    protected $casts = [
        'request' => 'json',
        'response' => 'json',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($model) {

        });
    }



    public function video(): HasOne
    {
        return $this->hasOne(Video::class, 'id', 'video_id');
    }

    public function userVideo(): HasOne
    {
        return $this->hasOne(UserVideo::class, 'id', 'user_video_id');
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function paymentCallbackLogs(): HasMany
    {
        return $this->hasMany(PaymentCallbackLog::class, 'order_id', 'order_id')
            ->orderBy('created_at', 'desc');
    }
}
