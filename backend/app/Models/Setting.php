<?php

namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;  

class Setting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'settings';
    protected $primaryKey = 'id';

    protected $fillable = [ 
        'set_key',
        'set_value',
        'type',
        'description', 

        'deleted_at',
        'created_at',
        'updated_at',
    ];
 
 
}
