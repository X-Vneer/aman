<?php

namespace App\Helpers;

use App\Services\FailedValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class CustomFormRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function failedValidation(Validator $validator)
    {
        $failedValidator = new FailedValidation($validator);
        throw new ValidationException($failedValidator->validator, $failedValidator->response);
    }
}
