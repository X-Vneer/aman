<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class RequestRate extends Model
{

    protected $table = "request_rates";
    protected $fillable = [
        'id',
        'method',
        'url',
        'rate',
        'ip',
        'referrer',
        'body',
        'header',
    ];
}
