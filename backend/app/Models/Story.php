<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Http\Traits\IsActiveTrait;

class Story extends Model
{
    use HasFactory, SoftDeletes, IsActiveTrait;

    protected $fillable = [
        'first_name',
        'last_name',
        'title',
        'mobile',
        'email',
        'age',
        'video_id',
        'locale',
        'content',
        'program_name',
        'deleted_at',
    ];

    protected $casts = [
        'video_id' => 'integer',
    ];

    /**
     * Get the video that owns the story
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class, 'video_id');
    }
}
