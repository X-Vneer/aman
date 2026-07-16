<?php

namespace App\Models;

use App\Enums\NotificationTitle;
use App\Enums\NotificationType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory, SoftDeletes;
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
