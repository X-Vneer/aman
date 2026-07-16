<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'code_number' => $this->code_number,
            'user_id' => $this->user_id,
            'user_name' => $this->user?->full_name,
            'user_email' => $this->user?->email,
            'user_mobile' => $this->user?->mobile,
            'video_id' => $this->video_id,
            'video_title' => $this->video?->title,
            'user_video_id' => $this->user_video_id,
            'rate_1' => $this->rate_1,
            'rate_2' => $this->rate_2,
            'rate_3' => $this->rate_3,
            'rate_4' => $this->rate_4,
            'comment' => $this->comment,
            'created_at' => $this->created_at,
            'deleted_at' => $this->deleted_at,
            'is_active' => $this->is_active,
        ];
        $data =  toString($data);
        $data['user'] = new RateUserResource($this->user);
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
