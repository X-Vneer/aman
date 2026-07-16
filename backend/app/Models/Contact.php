<?php

namespace App\Models;

use App\Enums\NotificationTitle;
use App\Enums\NotificationType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Contact extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * SQL expression that reproduces the (former MariaDB virtual) `status` column.
     * MySQL 8 forbids NOW() in generated columns, so `status` is computed at read
     * time instead: in PHP via the accessor below (display) and in SQL via this
     * constant (filtering — see User\ContactController::index). Keep both in sync.
     */
    public const STATUS_SQL = "CASE
        WHEN `reply` IS NOT NULL THEN 'Responded'
        WHEN `reply` IS NULL AND `created_at` > (NOW() - INTERVAL 12 HOUR) THEN 'New'
        ELSE 'Pending'
    END";

    protected $fillable = [
        'type',
        'name',
        'email',
        'mobile',
        'subject',
        'message',
        'images',
        'reply',
        'video_id',
    ];

    protected $casts = [
        'reply' => 'json',
        'images' => 'json'
    ];

    protected $appends = ['status'];

    protected function status(): Attribute
    {
        return Attribute::make(get: function ($value, $attributes) {
            if (! is_null($attributes['reply'] ?? null)) {
                return 'Responded';
            }
            $createdAt = $attributes['created_at'] ?? null;
            if ($createdAt && Carbon::parse($createdAt)->gt(now()->subHours(12))) {
                return 'New';
            }
            return 'Pending';
        });
    }

    protected static function boot()
    {
        parent::boot();

        static::created(function ($model) {
             $notification = Notification::create([
                'title' => NotificationTitle::Inquiry->value,
                'notificationable_id' => $model->id,
                'notificationable_column' => 'id',
                'notificationable_type' => NotificationType::Contact->value,
                'user_id' => auth()->user()?->id,
                'admin_id' => null
             ]);
        });
    }

    function video() : \Illuminate\Database\Eloquent\Relations\BelongsTo {
        return $this->belongsTo(Video::class, 'video_id', 'id')->withTrashed();
    }
}
