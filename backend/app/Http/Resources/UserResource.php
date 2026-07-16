<?php

namespace App\Http\Resources;

use App\Enums\VideoPaymentStatus;
use App\Models\UserInfo;
use App\Models\UserVideo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'full_name' => !auth('admin')->check()? $this->full_name : $this->full_name?? $this->mobile,
            'lang' => $this->lang,
            'certificate_count' => $this->userVideos?->where('status', VideoPaymentStatus::Accepted->value)->where('is_certificate_generated', 1)->count() ?? 0,
            'email' => $this->email,
            'deleted_at' => $this->deleted_at,
        ];

        $data =  toString($data);
        $data['info'] = new UserInfoResource($this->info);

        $this->userVideos?->loadMissing(['video', 'user', 'userInfo']);

        $data['coupons'] = array_unique($this->userVideos?->whereNotNull('coupon_code')->pluck('coupon_code')->toArray() ?? []);

        // if request->video_ids return only the videos that are in the request->video_ids
        if($request->video_ids){
            $data['userVideos'] =  $this->userVideos ? UserInformationVideoResource::collection($this->userVideos?->where('status', VideoPaymentStatus::Accepted->value)->whereIn('video_id', $request->video_ids)) : null;
        }else{
            $data['userVideos'] =  $this->userVideos ? UserInformationVideoResource::collection($this->userVideos?->where('status', VideoPaymentStatus::Accepted->value)) : null;
        }
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
