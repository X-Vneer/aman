<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Tawia extends Model
{
    use HasFactory, HasTranslations, SoftDeletes;

    protected $fillable = [
        'video_id',
        'title',
        'description',
        'symptoms',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public $translatable = [
        'title',
        'description',
        'symptoms',
    ];

    // protected $casts = [
    //     'symptoms' => 'array',
    // ];

    public function getSymptomsAttribute($value)
    {
        // Decode the JSON string to an array or return it as is if it's already an array.
        return json_decode($value, true);
    }

    public function setSymptomsAttribute($value)
    {
        // Encode the array into a JSON string for storage.
        $this->attributes['symptoms'] = json_encode($value, JSON_UNESCAPED_UNICODE);
    }

    public function video()
    {
        return $this->belongsTo(Video::class);
    }
}
