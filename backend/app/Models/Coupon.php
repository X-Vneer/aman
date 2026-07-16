<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * SQL expression that reproduces the (former MariaDB virtual) `status` column.
     * MySQL 8 forbids NOW() in generated columns, so `status` is computed at read
     * time instead: in PHP via the accessor below (display) and in SQL via this
     * constant (filter + sort — see Admin\CouponController::index). Keep both in sync.
     */
    public const STATUS_SQL = "CASE
        WHEN `deleted_at` IS NOT NULL OR `date_start` > NOW() THEN 'Inactive'
        WHEN `uses_count` >= `max_uses` OR NOW() > `date_end` THEN 'Expired'
        ELSE 'Active'
    END";

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

    protected $appends = ['status'];

    protected function status(): Attribute
    {
        return Attribute::make(get: function ($value, $attributes) {
            $now = now();
            if (! is_null($attributes['deleted_at'] ?? null)
                || Carbon::parse($attributes['date_start'])->gt($now)) {
                return 'Inactive';
            }
            if (($attributes['uses_count'] ?? 0) >= ($attributes['max_uses'] ?? 0)
                || $now->gt(Carbon::parse($attributes['date_end']))) {
                return 'Expired';
            }
            return 'Active';
        });
    }

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
