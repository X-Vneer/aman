<?php

namespace App\Http\Resources;

use App\Enums\ContactStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{


    public function toArray(Request $request): array
    {
        $reply = $this->reply? ContactStatus::Responded->value : ContactStatus::Pending->value;
        if(Carbon::now()->subHours(12) < $this->created_at){
            $reply =  ContactStatus::New->value;
        }

        $data = [
            'id' => $this->id,
            'type' => $this->type,
            'name' => $this->name,
            'email' => $this->email,
            'mobile' => $this->mobile,
            'subject' => $this->subject,
            'message' => $this->message,
            'images' => $this->images,
            'reply' => $this->reply,
            'status' => $this->status,
            'video_title' => $this->video?->title,
            'created_at' => $this->created_at,
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
