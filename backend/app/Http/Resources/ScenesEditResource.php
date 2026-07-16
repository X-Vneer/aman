<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScenesEditResource extends JsonResource
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
            'title' => $this->getTranslations('title'),
            'logo' => $this->logo,
            'start_time' => $this->start_time,
            'length' => $this->length,
            'end_time' => $this->end_time,
        ];

        $data =  toString($data);
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
