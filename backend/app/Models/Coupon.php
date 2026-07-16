<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'name',
        'code',
        'type',
        'amount',
        'video_ids',
        'langs',
        'date_start',
        'date_end',
        'max_uses',
        'has_form',
        'max_customer_uses',
        'uses_count',
        'paid_amount',
        'paid_amount_after_discount',
        // 'status',  // Virtual
        // 'discount_amount',  // Virtual
        'deleted_at',
    ];

    protected $casts = [
        'date_start' => 'datetime',
        'date_end' => 'datetime',
        'video_ids' => 'json',
        'langs' => 'json',
    ];

    public function getDateFromAttribute($value)
    {
        return Carbon::parse($value)->toISOString();
    }

    public function getDateToAttribute($value)
    {
        return Carbon::parse($value)->toISOString();
    }

    /**
     * Get all of the videos for the Coupon
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function userVideos(): HasMany
    {
        return $this->hasMany(UserVideo::class, 'coupon_id', 'id')->where('status', 'Accepted');;
    }
}
