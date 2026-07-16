<?php

namespace App\Http\Resources;

use App\Enums\VideoPaymentStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserInformationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $lang = app()->getLocale();
        $title = $this->title? json_decode($this->title, true)[$lang] : null;

        $data = [
            'id' => $this->id,
            'video_id' => $this->video_id,
            'program' => $title,
            'color' => $this->color,
            'lang' => $this->lang,
            'name' => $this->full_name??  $this->mobile,
        ];

        $data =  toString($data);
        $data['user'] = [
            'id' => $this->user_id,
            'mobile' => $this->mobile,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name?? __('msg.noName'),
            'lang' => $this->lang,
            'certificate_count' => $this->certificate_count,
            'email' => $this->email,
            'deleted_at' => $this->deleted_at,
        ];
        $data['transaction'] = [
            'payment_status' => $this->status,
            'transaction_date' => $this->created_at?? $this->user_created_at,
        ];


        if($request->export){
            return [
                    'id' => $this->id,
                    'video_id' => $this->video_id,
                    'program' => $title,
                    'lang' => $this->lang,
                    'name' => $this->full_name??  $this->mobile,
                    'mobile' => $this->mobile,
                    'first_name' => $this->first_name,
                    'last_name' => $this->last_name,
                    'full_name' => $this->full_name,
                    'certificate_count' => $this->certificate_count,
                    'email' => $this->email,
                    'payment_status' => ($title != null && $this->status == VideoPaymentStatus::Accepted->value)? VideoPaymentStatus::Accepted->value : null,
                    'transaction_date' => $this->created_at ? Carbon::parse($this->created_at)->toDateTimeString() : null,
            ];
        }
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
