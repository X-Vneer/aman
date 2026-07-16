<?php

namespace App\Http\Requests;

use App\Enums\CouponType;
use App\Enums\CouponTypeStatus;
use App\Helpers\CustomFormRequest;
use App\Models\Coupon;
use App\Models\Video;
use Illuminate\Contracts\Validation\Validator; 

class CheckCouponRequest extends CustomFormRequest
{
    protected $roles =  [   
        'video_id' => 'required|exists:videos,id,deleted_at,NULL',
    ]; 

    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    { 
        parent::prepareForValidation();    
    }

    protected function withValidator(Validator $validator)
    {  
        
        $validator->after(function ($validator) {
            $coupon = Coupon::whereRaw('('.Coupon::STATUS_SQL.') = ?', [CouponTypeStatus::Active->value])
                ->where('code', $this->coupon)->first();

            $video = Video::find($this->video_id);

            if(!$coupon || !in_array($this->video_id, $coupon?->video_ids)){
                $validator->errors()->add('coupon', trans('thisCouponIsNotExistOrExpired')); 
            }else if($coupon->type == CouponType::Fixed->value){
                if($video->price < $coupon->amount){
                    $validator->errors()->add('coupon', trans('thisCouponIsNotExistOrExpired')); 
                }
            }
        });
    }
}
