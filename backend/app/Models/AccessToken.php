<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;

class AccessToken extends Model
{
    protected $table = "personal_access_tokens";
    protected $fillable = [
        'tokenable_type',
        'tokenable_id',
        'name',
        'token',
        'abilities', 
        'device_token',
        'last_used_at',
        'created_at',
        'updated_at' 
    ];
}
