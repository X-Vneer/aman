<?php

namespace App\Models;

use App\Http\Traits\Model\LogoTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Scenes extends Model
{ 
    use HasFactory, LogoTrait, HasTranslations;

    protected $fillable = [
        'video_id',
        'logo',
        'title',
        'start_time',
        'length',
        'end_time', 
    ]; 

    protected $translatable = [
        'title', 
    ];
}
