<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserInfoResource extends JsonResource
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
            'gender'=>$this->gender,
            'age'=> $this->age,
            'nationality'=>$this->nationality,
            'sector'=>$this->sector,
            'workplace'=>$this->workplace,
        ];

        $data =  toString($data);
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
