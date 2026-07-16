<?php

namespace App\Http\Requests;

use App\Enums\VideoStatus;
use App\Helpers\CustomFormRequest;
use Illuminate\Validation\Rule;

class UpdateVideoStatusRequest extends CustomFormRequest
{
    public function rules(): array
    {
        return [
            'status' => [
                'present',
                'nullable',
                'string',
                Rule::in(array_map(fn (VideoStatus $c) => $c->value, VideoStatus::cases())),
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();
        if ($this->has('status') && $this->input('status') === '') {
            $this->merge(['status' => null]);
        }
    }
}
