<?php

namespace App\Http\Resources;

use App\Enums\NotificationType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {  
        $basic_data = [
            'id' => (string) $this->id,
            'title_id' => $this->title,
            // 'title' => trans($this->title),  
            // 'type' => $this->notificationable_type,
            'notificationable_id' => $this->notificationable_id,
            // 'notificationable_column' => $this->notificationable_column, 
            'created_at' => $this->created_at,
        ];
  
        $type = $this->notificationable_type;
        // $resource = "App\Http\Resources\\$type"."Resource";
        $resource = $type == NotificationType::UserVideo->value ? UserInformationVideoResource::class : ContactResource::class;
        
        return [
            ...$basic_data,
            'user' => new UserPureResource($this->user),   
            // 'content' => 'Content',    
            'notificationable' => !$this->$type? null : new $resource($this->$type),  
        ];
    }
}
