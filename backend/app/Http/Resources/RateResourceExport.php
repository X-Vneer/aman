<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RateResourceExport extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'code_number' => $this->code_number,
            'user_name' => $this->user?->full_name,
            'user_email' => $this->user?->email,
            'user_mobile' => $this->user?->mobile,
            'video_title' => $this->video?->title,
            'certificate_number' => $this->userVideo?->certificate_number,
            'certificate_url' => $this->userVideo?->certificate_url,
            'rate_1' => $this->rate_1,
            'rate_2' => $this->rate_2,
            'rate_3' => $this->rate_3,
            'rate_4' => $this->rate_4,
            'comment' => $this->comment,
            'created_at' => $this->created_at,
        ];
        $data =  toString($data);
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
