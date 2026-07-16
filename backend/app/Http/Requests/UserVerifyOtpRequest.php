<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator; 

class UserVerifyOtpRequest extends CustomFormRequest
{
    protected $roles =  [
        // 'mobile' => 'required|sa_mobile|exists:users,mobile',
        'otp' => 'required'
    ]; 

    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    { 
        parent::prepareForValidation(); 
        $this->merge(['mobile'=> trimMobile($this->mobile)]);

    }

    protected function withValidator(Validator $validator)
    {  
        $validator->after(function ($validator) {
            $item = User::withTrashed()->where('mobile', trimMobile($this->mobile))
                    ->where('otp', $this->otp)
                    ->first();            
            
            if ($item?->deleted_at) { 
                $validator->errors()->add('mobile', trans('disabledAccount'));
            }

            if (!$item) {
                $errorMsg = trans('invalidOtp');
                $validator->errors()->add('otp', $errorMsg);
            }

            $diff_otp_time = Carbon::now()->diffInSeconds(Carbon::parse($item?->otp_created_at));
            if ($diff_otp_time > 600) {
                $errorMsg = trans('otpHasBeenExpired!');
                $validator->errors()->add('otp', $errorMsg);
            }
        });
    }
}
