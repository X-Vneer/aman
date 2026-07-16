<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; 

class Downloads extends Model
{ 

    
    

    public $timestamps = false;

    protected $table = "downloads";
    protected $fillable = [
        'type',
        'path',
        'status',
        'size',
        'count',
        'exported',
        'updated_at',
    ];

    protected $hidden = [
 
    ];

    // public function getPathAttribute($value)
    // {
    //     if (filter_var($value, FILTER_VALIDATE_URL)) {
    //         return $value;
    //     } 
    //     return $value ? asset('storage/' . $value) : '';
    // }

}
