<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $newPrice = $this->newPrice ?? $this->price;

        $data = [
            'id' => $this->id,
            'slug' => $this->slug,
            'video_url' => $this->video_url,
            'logo' => $this->logo,
            'title' => $this->title,
            'description' => $this->description,
            'length' => $this->length,
            'color' => $this->color,
            'price' => round($this->price, 2),
            'price_original' => $this->getRawOriginal('price'),

            'coupon' => $this->coupon ?? null,
            'final_price' => round($newPrice, 2),
            'discount' => (float) $this->price - (float) ($newPrice),
            'tax_percentage' => $this->tax,
            'tax_value' => round($newPrice - $newPrice / (1 + ($this->tax / 100)), 2),
            'view_counter' => $this->view_counter,
            'view_complete_counter' => $this->view_complete_counter,
            'view_count' => $this->view_complete_counter,
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
            $data['questions'] = QuestionResource::collection($this->questions ?? []);
            $data['scenes'] = ScenesResource::collection($this->scenes);
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
