<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DownloadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [ 
            'id' => $this->id,
            'type' => $this->type,
            'path' => $this->path ? asset('storage/' . $this->path) : '', 
            'status' => $this->status,
            'size' => ($this->status == 1)? (number_format(($this->size / 1024 / 1024), 2)  . ' MB') : $this->precent,
            'created_at' => $this->created_at,
            'updated_at' => Carbon::parse($this->updated_at)->diffForHumans(),
        ];
    }
    
    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}   
 