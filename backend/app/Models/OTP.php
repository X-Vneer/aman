<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class OTP extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'otps';
    protected $primaryKey = 'id';

    protected $fillable = [
        'key',
        'otp',
        'code',
        'message',
    ];
}
