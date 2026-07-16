<?php

namespace App\Http\Resources;

use App\Enums\VideoPaymentStatus;
use App\Models\UserVideo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResourceExport extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userVideos = null;

        // if request->video_ids return only the videos that are in the request->video_ids
        if($request->video_ids){
            $userVideos = implode(', ', UserInformationVideoResource::collection($this->userVideos?->where('status', VideoPaymentStatus::Accepted->value)->whereIn('video_id', $request->video_ids))->pluck('video.title')->toArray());
        }else{
            $userVideos = implode(', ', UserInformationVideoResource::collection($this->userVideos?->where('status', VideoPaymentStatus::Accepted->value))->pluck('video.title')->toArray());
        }

        $data = [
            'id' => $this->id,
            'mobile' => $this->mobile,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => !auth('admin')->check()? $this->full_name : $this->full_name?? $this->mobile,


            'lang' => $this->lang,
            'certificate_count' => $this->userVideos?->where('status', VideoPaymentStatus::Accepted->value)->where('is_certificate_generated', 1)->count() ?? 0,
            'email' => $this->email,

            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at,
            'deleted_at'=>$this->deleted_at,

        ];

        $data['userVideos'] = $userVideos;
        $data =  toString($data);

        // $data['programs'] = $this->userVideos ? $this->userVideos->map(function ($item) {
        //     return json_decode($item->video->title);
        // })->unique()->toArray() : null;
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
