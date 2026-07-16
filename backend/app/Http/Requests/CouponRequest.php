<?php

namespace App\Http\Requests;

use App\Enums\CouponType;
use App\Enums\Lang;
use App\Helpers\CustomFormRequest;
use App\Models\Coupon;
use App\Models\Video;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;

class CouponRequest extends CustomFormRequest
{
    protected $roles =  [
        'name' => 'required|min:1|max:50',
        'code' => 'required|min:1|max:50|unique:coupons,code',
        'amount' => 'required|min:0|max:100000',
        'video_ids' => 'required|array',
        'video_ids.*' => 'required|exists:videos,id',
        // 'date_end' => 'required|after:date_start|date_format:Y-m-d\TH:i:s.v\Z',
        'date_end' => 'required|after:date_start',
        'has_form' => 'required|boolean|in:0,1,true,false',
        'max_uses' => 'required|numeric|max:100000',
        'max_customer_uses' => 'required|numeric:1000',
        'langs' => 'nullable|array',
    ];



    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();

        // If video_ids is empty, get all video IDs
        if (empty($this->video_ids)) {
            $this->merge([
                'video_ids' => Video::pluck('id')->toArray(),
            ]);
        }

        $this->roles['type'] = 'required|in:' .implode(',', array_map(fn($case) => $case->value, CouponType::cases()));
        $this->roles['date_start'] = 'required|after:' . Carbon::now()->subYear();
        $this->roles['lang.*'] = 'required|in:' .implode(',', array_map(fn($case) => $case->value, Lang::cases()));

        if($this->type == CouponType::Percentage->value){
            $this->roles['amount'] = 'required|min:0|max:100';
        }

        if ($this->isMethod('put')) {
            $this->merge(['id' => $this->route('coupon')]);
            $this->roles['id'] =   'required|exists:coupons,id,deleted_at,NULL';
            $this->roles['code'] =   'required|min:1|max:50|unique:coupons,code,' . $this->id;
        }

        $this->merge([
            'has_form' => $this->has_form? 1 : 0,
        ]);
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $item = Coupon::find($this->id);

            // Only check for payment-related errors if critical fields are being updated
            if ($item && $this->isMethod('put') &&
                (
                    $this->has('code') && $this->code !== $item->code ||
                    $this->has('type') && $this->type !== $item->type ||
                    $this->has('amount') && $this->amount != $item->amount
                )
            ) {
                if($item->userVideos->count() > 0){
                    $validator->errors()->add('code', __('msg.can-not-edte-coupon-having-payment'));
                }
            }
        });
    }
}
