<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use App\Models\Admin; 
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator; 

class UpdatePasswordRequest extends CustomFormRequest
{
    protected $roles =  [
        'email' => 'required|exists:admins,email,deleted_at,NULL',
        'password' => 'required|min:6|max:12',
        'otp' => 'required'
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
            $item = Admin::withTrashed()->where('email', $this->email)
                    ->where('otp', $this->otp)
                    ->first();            
            
            if ($item?->deleted_at) { 
                $validator->errors()->add('email', trans('disabledAccount'));
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
