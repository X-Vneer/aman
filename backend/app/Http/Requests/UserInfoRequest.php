<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator;

class UserInfoRequest extends CustomFormRequest
{
    protected $roles =  [
        'gender' => 'required|in:Male,Female',
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

         if ($this->isMethod('put')) {
            $this->roles['birth_date'] =   [
                'nullable',
                'date',
                'before_or_equal:' . Carbon::now()->subYears(7)->format('Y-m-d'), // Ensures at least 7 years old
            ];
        }
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {

        });
    }
}
