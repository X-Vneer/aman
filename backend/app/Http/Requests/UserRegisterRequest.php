<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;

class UserRegisterRequest extends CustomFormRequest
{
    protected $roles =  [
        'mobile' => 'required|min:8|max:20',
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
            $item = User::withTrashed()->where('mobile', trimMobile($this->mobile))->first();
            if ($item?->deleted_at) {
                $validator->errors()->add('mobile', trans('disabledAccount'));
            }

            if($item?->otp_created_at && config('app.env') != 'testing'){
                $diff_otp_time = Carbon::parse($item?->otp_created_at)->diffInSeconds(Carbon::now());

                $otpDelay = (int) config('constants.otpDelay');
                $diff_reset = (int)($otpDelay - $diff_otp_time);

                if ($diff_otp_time < $otpDelay) {
                    $errorMsg = trans('tryAgainAfter', ['seconds' => $diff_reset]);
                    $validator->errors()->add('delay_seconds', $errorMsg);
                }
            }
        });
    }
}
