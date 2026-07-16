<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $tags = $this->tags;

        $isAdmin = auth('admin')->check();

        $title = $isAdmin ? $this->getTranslations('title') : $this->title;
        $shortDescription = $isAdmin ? $this->getTranslations('short_description') : $this->short_description;
        $content = $isAdmin ? $this->getTranslations('content') : $this->content;

        $data = [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $title,
            'short_description' => $shortDescription,
            'content' => $content,
            'publish_date' => $this->publish_date,
            'logo' => $this->logo ?? url('img/logo.png?v=1'),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];

        $data = toString($data);
        $data['tags'] = $tags->map(fn ($t) => [
            'id' => $t->id,
            'name' => $t->name,
            'slug' => $t->slug,
            'color' => $t->color,
        ])->values()->all();

        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
