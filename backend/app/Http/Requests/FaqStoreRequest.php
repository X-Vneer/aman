<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use Illuminate\Contracts\Validation\Validator;

class FaqStoreRequest extends CustomFormRequest
{
    protected $roles =  [
        'title' => 'array',
        'title.ar' => 'required|min:1|max:191',
        'title.en' => 'required|min:1|max:191',
        'title.fr' => 'required|min:1|max:191',
        'title.id' => 'required|min:1|max:191',
        'description' => 'array',
        'description.ar' => 'required|min:1|max:1000',
        'description.en' => 'required|min:1|max:1000',
        'description.fr' => 'required|min:1|max:1000',
        'description.id' => 'required|min:1|max:1000',
    ];



    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();
        if ($this->isMethod('put')) {
            $this->merge(['id' => $this->route('faq')]);
            $this->roles['id'] =   'required|exists:faqs,id,deleted_at,NULL';
        }

    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {

        });
    }
}
