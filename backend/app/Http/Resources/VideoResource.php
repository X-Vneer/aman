<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'slug' => $this->slug,
            'video_url' => $this->video_url,
            'logo' => $this->logo,
            'title' => $this->title,
            'description' => $this->description,
            'length' => $this->length,
            'color' => $this->color,
            'view_counter' => $this->view_counter,
            'view_complete_counter' => $this->view_complete_counter,
            'view_count' => $this->view_complete_counter,
            'deleted_at' => $this->deleted_at,
        ];

        $data = toString($data);
        // Ensure boolean is preserved (toString() would coerce to string)
        $data['is_new'] = (bool) ($this->is_new ?? 0);
        $data['status'] = $this->status?->value;

        if (auth('admin')->check() || auth('user')->check()) {
            $data['questions'] = QuestionResource::collection($this->questions ?? []);
            $data['scenes'] = ScenesResource::collection($this->scenes);
        }

        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
