<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TawiaEditResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'video_id' => $this->video_id,
            'title' => $this->getTranslations('title'),
            'description' => $this->getTranslations('description'),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];

        $data =  toString($data);
        $data['video'] =  new VideoResource($this->video);
        $data['symptoms'] =  collect( $this->getTranslations('symptoms'))
                                ->map(fn($value) => json_decode($value, true));

        return $data;

    }

    /**
     * Get the headings for the resource.
     */
    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
