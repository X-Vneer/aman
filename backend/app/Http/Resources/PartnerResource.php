<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartnerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'logo' => $this->logo,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];

        $data = toString($data);
        $data['isActive'] = $this->is_active;
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
