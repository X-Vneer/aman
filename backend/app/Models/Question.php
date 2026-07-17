<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Question extends Model
{
     use HasFactory, HasTranslations;

    /**
     * DB-level default for the JSON `appears_at` column is not possible on MySQL 8,
     * so the fallback is applied here at the application layer.
     */
    protected $attributes = [
        'appears_at' => '{"ar": "00:00:00", "en": "00:00:00"}',
    ];

    protected $fillable = [
        'video_id',
        'question',
        'answers_a',
        'answers_b',
        'answers_c',
        'answers_d',
        'wrong_a',
        'wrong_b',
        'wrong_c',
        'wrong_d',
        'correct_answer',
        'allowed_time',
        'appears_at',
        'wrong_answer_audio_urls',
    ];

    protected $translatable = [
        'question',
        'answers_a',
        'answers_b',
        'answers_c',
        'answers_d',
        'wrong_a',
        'wrong_b',
        'wrong_c',
        'wrong_d',
        'wrong_answer_audio_urls',
        'appears_at',
    ];

    public function getWrongAnswerAudioUrlsAttribute($value)
    {
        // Decode the JSON string to an array or return it as is if it's already an array.
        return json_decode($value, true);
    }

    public function setWrongAnswerAudioUrlsAttribute($value)
    {
        // Encode the array into a JSON string for storage.
        $this->attributes['wrong_answer_audio_urls'] = json_encode($value, JSON_UNESCAPED_UNICODE);
    }

}
