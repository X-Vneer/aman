<?php

namespace App\Http\Resources;

use App\Services\CreatedUpdatedHuman;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email, 
            'role_name' => $this->role_name,  
            'mobile' => $this->mobile,  
            'deleted_at' => $this->deleted_at,  
        ];  
        
        $data =  toString($data); 
        $data['permissions'] =  $this->getPermissionNames(); 
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
