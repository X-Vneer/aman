<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'title' => $this->title,
            'mobile' => $this->mobile,
            'age' => $this->age,
            'email' => $this->email,
            'video_id' => $this->video_id,
            'video_title' => $this->video?->title?? $this->program_name,
            'locale' => $this->locale,
            'content' => $this->content,
            'program_name' => $this->program_name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];


        $data = toString($data);
         // Load video relationship if requested
        //  if ($this->relationLoaded('video')) {
        //     $data['video'] = $this->video;
        // }

        $data['is_active'] = $this->is_active;
        $data['has_video'] = $this->video_id ? true : false;

        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
