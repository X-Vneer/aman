<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionEditResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {



        $data = [ 
            'id' => $this->id,
            'video_id' => $this->video_id,
            'question' => $this->getTranslations('question'),
            'answers_a' => $this->getTranslations('answers_a'),
            'answers_b' => $this->getTranslations('answers_b'),
            'answers_c' => $this->getTranslations('answers_c'),
            'answers_d' => $this->getTranslations('answers_d'),
            'wrong_a' => $this->getTranslations('wrong_a'),
            'wrong_b' => $this->getTranslations('wrong_b'),
            'wrong_c' => $this->getTranslations('wrong_c'),
            'wrong_d' => $this->getTranslations('wrong_d'),
            'correct_answer' => $this->correct_answer,
            'allowed_time' => $this->allowed_time,
            'appears_at' => $this->getTranslations('appears_at'),
        ];
        $data =  toString($data);

        $data['wrong_answer_audio_urls'] = collect($this->getTranslations('wrong_answer_audio_urls'))
            ->map(fn($value) => json_decode($value, true));
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
