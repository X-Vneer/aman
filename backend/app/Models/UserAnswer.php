<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserAnswer extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_video_id',
        'user_id',
        'video_id',
        'question_id',
        'user_answer',
        'status',
        'answer_time',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id', 'id');
    }
}
