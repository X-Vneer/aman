<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Faq extends Model
{
    use HasFactory, HasTranslations, SoftDeletes;
    protected $fillable = [ 
        'title',
        'description', 
        'deleted_at',
    ];

    protected $translatable = [
        'title',
        'description',
    ];
}
