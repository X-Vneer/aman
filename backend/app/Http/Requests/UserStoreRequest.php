<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest; 
use Illuminate\Contracts\Validation\Validator; 

class UserStoreRequest extends CustomFormRequest
{
    protected $roles =  [
        'first_name' => 'required|min:1|max:50',
        'last_name' => 'required|min:1|max:50', 
        'email' => 'nullable|email|min:1|max:50', 
        'mobile' => 'required|sa_mobile', 
    ]; 

    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    { 
        parent::prepareForValidation();   
        $this->merge(['id' => $this->route('user')]);  
        $is_required_mobile = (auth('admin')->check())? 'required' : 'nullable';

        $this->roles['email'] =   'nullable|email|min:1|max:60|email|unique:users,email,'.$this->id;
        $this->roles['mobile'] =   $is_required_mobile .'|sa_mobile|unique:users,mobile,'.$this->id;

    }

    protected function withValidator(Validator $validator)
    {  
        $validator->after(function ($validator) {
             
        });
    }
}
