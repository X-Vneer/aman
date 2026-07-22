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
        'appears_at',
    ];
}
