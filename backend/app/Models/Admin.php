<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
 
use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; 
use Spatie\Permission\Traits\HasRoles; 

class Admin extends Authenticatable
{
    use HasApiTokens, SoftDeletes, Notifiable, HasFactory, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'admins';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id',
        'name',
        'email',
        'mobile',
        'role_name',
        'password', 
        'otp_created_at', 
        'otp', 
        'last_read_notification_id', 

        'deleted_at',
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [ 
        'password' => 'hashed',
    ];
 
  
    
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = trim(strtolower($value));
    }
}
