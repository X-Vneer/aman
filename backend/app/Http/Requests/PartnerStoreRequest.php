<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use Illuminate\Contracts\Validation\Validator;

class PartnerStoreRequest extends CustomFormRequest
{
    protected $roles = [
        'name' => 'required|string|min:1|max:191',
        'logo' => 'nullable|string|max:500',
    ];

    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();
        if ($this->isMethod('put')) {
            $this->merge(['id' => $this->route('partner')]);
            $this->roles['id'] = 'required|exists:partners,id,deleted_at,NULL';
        }
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            // Additional validation logic can be added here if needed
        });
    }
}
