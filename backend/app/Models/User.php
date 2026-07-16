<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'mobile',
        'otp',
        'otp_created_at',
        'first_name',
        'last_name',
        // 'full_name', // virtual
        'lang',
        'email',
        'certificate_count',
        'deleted_at',
    ];

    // protected $hidden =[
    //     'otp'
    // ];

    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = trim($value)? strtolower(trim($value)) : null;
    }

    /**
     * Get all of the userVideo for the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function userVideos(): HasMany
    {
        return $this->hasMany(UserVideo::class, 'user_id', 'id')->where('status', 'Accepted');
    }

    /**
     * Get the info associated with the User
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function info(): HasOne
    {
        return $this->hasOne(UserInfo::class, 'user_id', 'id');
    }

}
