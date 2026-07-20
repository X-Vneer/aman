<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;

class CertificateImageUpdateRequest extends CustomFormRequest
{
    public function rules()
    {
        return [
            'image' => ['required', 'string', 'min:1', 'max:191', 'regex:/\.(png|jpe?g)$/i'],
        ];
    }

    public function messages()
    {
        return [
            'image.required' => trans('يجب إدخال رابط الشهادة'),
            'image.regex' => trans('يجب أن يكون رابط الشهادة بصيغة PNG أو JPG'),
        ];
    }
}
