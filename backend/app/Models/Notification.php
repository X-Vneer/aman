<?php

namespace App\Models;

use App\Enums\NotificationTitle;
use App\Mail\SendNotificationMail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Mail;


class Notification extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'notifications';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'title',
        'notificationable_id',
        'notificationable_column',
        'notificationable_type',
        'user_id',
        'admin_id',
        'data',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($model) {
            // if (env('ENV') === 'production') {
                $title =  $model->title;
                if($model->title == NotificationTitle::Inquiry->value){
                    $body = $model->contact->message;
                    $title = $model->name . ": " . $model->subject;
                }else{
                    $body = "هناك عملية دفع جديدة";
                }
                if (config('app.env') == 'production' || config('app.env') == 'local') {
                    // Mail::send(new SendNotificationMail(config('app.admin_email'), $title, $body));
                }
            // }
        });

        static::saved(function ($notification) {
            logToFile('00 Push.txt', "Start: ====");
        });

    }

    function setDataAttribute($value)
    {
        $this->attributes['data'] = json_encode($value, JSON_UNESCAPED_UNICODE);
    }

    function getDataAttribute($value)
    {
        return json_decode($value);
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function notificationable(): HasOne
    {
        return $this->hasOne("App\\Models\\". $this->notificationable_type, $this->notificationable_column, 'notificationable_id');
    }


    public function contact(): HasOne
    {
        return $this->hasOne(Contact::class, 'id', 'notificationable_id');
    }

    public function UserVideo(): HasOne
    {
        return $this->hasOne(UserVideo::class, 'id', 'notificationable_id');
    }
}
