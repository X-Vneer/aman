<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoEditResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'slug' => $this->slug,
            'video_url' => $this->getTranslations('video_url'),
            'logo' => $this->logo,
            'title' => $this->getTranslations('title'),
            'description' => $this->getTranslations('description'),
            'length' => $this->length,
            'color' => $this->color,
            'price_original' => $this->getRawOriginal('price'),
            'price' => $this->price,
            'coupon' => $this->coupon ?? null,
            'final_price' => $this->newPrice ?? null,
            'discount' => (float) $this->price - (float) ($this->newPrice ?? $this->price),
            'view_counter' => $this->view_counter,
            'view_complete_counter' => $this->view_complete_counter,
            'deleted_at' => $this->deleted_at,
        ];

        if (auth('admin')->check()) {
            $data['certificate_url'] = $this->certificate_url;
        }
        $data = toString($data);
        // Ensure boolean is preserved (toString() would coerce to string)
        $data['is_new'] = (bool) ($this->is_new ?? 0);
        $data['status'] = $this->status?->value;

        if (auth()->check()) {
            $data['questions'] = QuestionEditResource::collection($this->questions ?? []);
            $data['scenes'] = ScenesEditResource::collection($this->scenes);
        }

        if (auth('admin')->check()) {
            $data['total_price'] = $this->total_price;
            $data['total_paid'] = $this->total_paid;
            $data['total_discount'] = $this->total_discount;
        }

        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
