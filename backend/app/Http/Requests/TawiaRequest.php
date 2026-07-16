<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use Illuminate\Contracts\Validation\Validator;

class TawiaRequest extends CustomFormRequest
{
    protected $roles =  [
        'video_id' => 'required|exists:videos,id',
        'title' => 'required|array',
        'title.ar' => 'required|min:1|max:255',
        'title.en' => 'required|min:1|max:255',
        'title.fr' => 'required|min:1|max:255',
        'title.id' => 'required|min:1|max:255',
        'description' => 'required|array',
        'description.ar' => 'required|min:1|max:1000',
        'description.en' => 'required|min:1|max:1000',
        'description.fr' => 'required|min:1|max:1000',
        'description.id' => 'required|min:1|max:1000',
        'symptoms' => 'required|array',
        'symptoms.ar' => 'required|array',
        'symptoms.ar.*' => 'required|min:1|max:1000',
        'symptoms.en' => 'required|array',
        'symptoms.en.*' => 'required|min:1|max:1000',
        'symptoms.fr' => 'required|array',
        'symptoms.fr.*' => 'required|min:1|max:1000',
        'symptoms.id' => 'required|array',
        'symptoms.id.*' => 'required|min:1|max:1000',
    ];



    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();
        if ($this->isMethod('put')) {
            $this->merge(['id' => $this->route('awareness')]);
            $this->roles['id'] =   'required|exists:tawias,id';
        }
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {

        });
    }
}
