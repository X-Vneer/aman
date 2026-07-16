<?php

namespace App\Http\Resources;
 
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FaqResource extends JsonResource
{
      

    public function toArray(Request $request): array
    { 
        $data = [
            'id' => $this->id,   
            'title' => $this->title,
            'description' => $this->description, 
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
