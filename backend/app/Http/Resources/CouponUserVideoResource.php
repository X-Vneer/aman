<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponUserVideoResource extends JsonResource
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
            'user_id' => $this->user_id,
            'price' => $this->price,
            'percentage' => $this->percentage,
            'number_of_time_used' => $this->number_of_time_used,
            'video_title' => $this->video?->title,
            'created_at' => $this->created_at,
        ];

        $data =  toString($data);
        $data['user'] =  new UserPureResource($this->user);
        if($request->export){
            return [
                'id' => $this->id,
                'user_id' => $this->user_id,
                'percentage' => $this->percentage,
                'number_of_time_used' => $this->number_of_time_used,

                'video_title' => $this->video?->title,

                'mobile' => $this->user?->mobile,
                'first_name' => $this->user?->first_name,
                'last_name' => $this->user?->last_name,
                'full_name' => $this->user?->full_name?? $this->user?->mobile,
                'lang' => $this->user?->lang,
                'certificate_count' => $this->user?->certificate_count,
                'email' => $this->user?->email,

            ];
        }

        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
