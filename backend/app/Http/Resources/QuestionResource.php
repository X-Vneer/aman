<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $appears_at = $this->appears_at;


        $data = [ 
            'id' => $this->id,
            'video_id' => $this->video_id,
            'question' => $this->question,
            'answers_a' => $this->answers_a,
            'answers_b' => $this->answers_b,
            'answers_c' => $this->answers_c,
            'answers_d' => $this->answers_d,
            'wrong_a' => $this->wrong_a,
            'wrong_b' => $this->wrong_b,
            'wrong_c' => $this->wrong_c,
            'wrong_d' => $this->wrong_d,
            'correct_answer' =>  $this->correct_answer,
            'allowed_time' => $this->allowed_time,
            'appears_at' => $appears_at,
        ];
        $data =  toString($data);

        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
