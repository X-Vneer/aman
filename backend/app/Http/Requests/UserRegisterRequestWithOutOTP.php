<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use App\Models\User;
use Illuminate\Contracts\Validation\Validator;

class UserRegisterRequestWithOutOTP extends CustomFormRequest
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


        });
    }
}
