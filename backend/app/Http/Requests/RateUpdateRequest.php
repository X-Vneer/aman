<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;

class RateUpdateRequest extends CustomFormRequest
{
    protected $rules = [
        'rate_1' => 'required|numeric|min:1|max:3',
        'rate_2' => 'required|numeric|min:1|max:3',
        'rate_3' => 'required|numeric|min:1|max:3',
        'rate_4' => 'required|numeric|min:1|max:3',
        'comment' => 'nullable|string|max:1000',
    ];

    public function rules(): array
    {
        return $this->rules;
    }
}
