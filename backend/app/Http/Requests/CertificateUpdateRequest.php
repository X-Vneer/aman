<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use Illuminate\Contracts\Validation\Validator;

class CertificateUpdateRequest extends CustomFormRequest
{
    protected $roles =  [
        'certificate_url' => [
            'required',
            'string',
            'min:1',
            'max:191',
            'regex:/\.png$/i',
        ],
        'id' => 'required|exists:videos,id',
    ];

    public function rules()
    {
        return $this->roles;
    }

    public function messages()
    {
        return [
            'certificate_url.required' => trans('يجب إدخال رابط الشهادة'),
            'certificate_url.regex' => trans('يجب أن يكون رابط الشهادة بصيغة PNG'),
        ];
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();
        $this->merge(['id' => $this->route('video')]);
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $value = $this->certificate_url;
            if(!$value) return;
            if(!filter_var($value, FILTER_VALIDATE_URL) && !file_exists($value)){
                $validator->errors()->add('certificate_url', trans('هذا الملف غير موجود'));
            }
        });
    }
}
