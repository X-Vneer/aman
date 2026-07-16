<?php

namespace App\Models;

use App\Http\Traits\IsActiveTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rate extends Model
{
    use IsActiveTrait, SoftDeletes;

    protected $table = 'rates';

    protected $fillable = [
        'code_number',
        'user_id',
        'video_id',
        'user_video_id',
        'rate_1',
        'rate_2',
        'rate_3',
        'rate_4',
        'comment',
        'deleted_at',
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
    ];

    protected $appends = [
        'is_active',
    ];

    public function video(): HasOne
    {
        return $this->hasOne(Video::class, 'id', 'video_id');
    }

    public function userVideo(): HasOne
    {
        return $this->hasOne(UserVideo::class, 'id', 'user_video_id')->where('status', 'Accepted');
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
