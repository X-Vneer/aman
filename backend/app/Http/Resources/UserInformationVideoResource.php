<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserInformationVideoResource extends JsonResource
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
            'video_title' => $this->video?->title ?? 'Video Not Found',
            'answer_average' => $this->answer_average == 0? '00:00:00' : $this->answer_average,
            'total_questions' => $this->total_questions,
            'correct_answers' => $this->correct_answers,
            'evaluation' => $this->evaluation,
            'current_time' => $this->current_time,
            'video_played' => $this->view_counter,
            'certificate_url' => $this->certificate_url,
            'certificate_number' => $this->certificate_number,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

        $data =  toString($data);

        if (auth('admin')->check()) {
            $data['progress_phases'] = $this->certificateProgressPhases();
        }

        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
