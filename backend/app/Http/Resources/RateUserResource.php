<?php

namespace App\Http\Resources;
 
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RateUserResource extends JsonResource
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
            'mobile' => $this->mobile,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'lang' => $this->lang,
            'certificate_count' => $this->certificate_count,
            'email' => $this->email,
            'deleted_at' => $this->deleted_at,
        ];
        
        $data =  toString($data);  
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
