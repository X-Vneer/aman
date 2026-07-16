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
            'price' => number_format($this->price, 2, '.', ''),
            'discount_value' => number_format($this->discount_value, 2, '.', ''),
            'tax_value' => number_format($this->tax_value, 2, '.', ''),
            'paid' => number_format($this->paid, 2, '.', ''),
            'coupon_code' => $this->coupon_code?? __('msg.noCoupon'),
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
        $brand = data_get(json_decode($this->response, true), 'responseBody.brand', null);
        $payment_method = $title? ($this->final_price == 0 ?  '  Coupon 100%' : ($this->card ? 'Card Payment' . ($brand ? ' - ' . $brand : '') : 'Apple Pay' . ($brand ? ' - ' . $brand : ''))) : null;
        $data['transaction'] = [
            'brand' => $brand,
            'id' => $this->transaction?->id,
            'order_id' => $this->order_id ?? null,
            'payment_method' => $this->status == VideoPaymentStatus::Accepted->value ?  $payment_method : '-',
            'payment_status' => $this->status, //($title != null && $this->status == VideoPaymentStatus::Accepted->value)? VideoPaymentStatus::Accepted->value : null,
            'transaction_date' => $this->created_at?? $this->user_created_at,
            'reject_reason' => null,
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
                    'payment_method' => $this->final_price == 0 ? 'Coupon 100%' : ($this->card ? 'Card Payment' : 'Apple Pay'),
                    'payment_status' => ($title != null && $this->status == VideoPaymentStatus::Accepted->value)? VideoPaymentStatus::Accepted->value : null,
                    'transaction_date' => $this->created_at ? Carbon::parse($this->created_at)->toDateTimeString() : null,
                    'transaction_brand' => $brand,
                    'transaction_id' => $this->transaction_id ?? null,
                    'transaction_order_id' => $this->order_id ?? null,
                    'transaction_payment_method' => $this->status == VideoPaymentStatus::Accepted->value ?  $payment_method : '-',
                    'transaction_payment_status' => $this->status,
            ];
        }
        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
