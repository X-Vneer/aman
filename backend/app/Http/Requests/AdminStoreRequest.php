<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use App\Models\Question;
use Illuminate\Contracts\Validation\Validator;

class AdminStoreRequest extends CustomFormRequest
{
    protected $roles =  [
        'name' => 'required|min:5|max:50',
        'role_name' => 'nullable|min:5|max:50',
        'mobile' => 'nullable|min:5|max:50',
        'email' => 'required|email|min:5|max:60|unique:admins,email',
        'name' => 'required|min:3|max:60|unique:admins,name',
    ];



    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();
        if ($this->isMethod('put') && $this->route('admin')) {
            $this->merge(['id' => $this->route('admin')]);
            $this->roles['id'] =   'required|exists:admins,id';
            $this->roles['email'] = 'required|email|min:5|max:60|unique:admins,email,' . $this->id;
            $this->roles['name'] = 'required|min:3|max:60|unique:admins,name,' . $this->id;
        }else{
            $this->roles['password'] =  'required|min:6|max:8';
        }
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {

        });
    }
}
