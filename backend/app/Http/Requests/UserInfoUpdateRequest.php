<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use Illuminate\Contracts\Validation\Validator;

class UserInfoUpdateRequest extends CustomFormRequest
{
    protected $roles =  [
        'gender' => 'nullable|in:Male,Female',
        'nationality' => 'nullable|string|max:100',
        'sector' => 'nullable|string',
        'age' => 'nullable|numeric|min:10|max:150',
        'workplace' => 'nullable|string|max:191',
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

        });
    }
}
