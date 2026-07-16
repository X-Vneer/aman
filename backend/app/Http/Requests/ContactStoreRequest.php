<?php

namespace App\Http\Requests;

use App\Enums\ContactType;
use App\Helpers\CustomFormRequest;
use Illuminate\Contracts\Validation\Validator;

class ContactStoreRequest extends CustomFormRequest
{
    protected $roles =  [
        'name' => 'required|min:1|max:50',
        'email' => 'required|email|min:1|max:100',
        'mobile' => 'required|string',
        'subject' => 'required|min:1|max:191',
        'message' => 'required|min:1|max:1000',
        'video_id' => 'nullable|exists:videos,id',
        'images' => 'nullable|array|max:5',
        'images.*' => 'required|string|max:500',
    ];

    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();
        if ($this->isMethod('put')) {
            $this->merge(['id' => $this->route('contact')]);
            $this->roles['id'] =   'required|exists:contacts,id,deleted_at,NULL';
        }

        $types = array_map(fn($case) => $case->value, ContactType::cases());
        $this->roles['type'] = 'required|in:' . implode(',', $types);

        // Trim mobile number if provided
        if ($this->has('mobile')) {
            $this->merge(['mobile' => trimMobile($this->mobile)]);
        }
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            // Validate mobile number length (10-13 digits)
            if ($this->has('mobile')) {
                $mobile = $this->mobile;
                // Remove all non-digit characters to count only digits
                $digitsOnly = preg_replace('/\D/', '', $mobile);
                $digitCount = strlen($digitsOnly);

                if ($digitCount < 10 || $digitCount > 13) {
                    $validator->errors()->add('mobile', trans('mobileMustBeBetween10And13Digits'));
                }
            }
        });
    }
}
