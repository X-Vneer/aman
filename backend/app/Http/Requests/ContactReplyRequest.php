<?php

namespace App\Http\Requests;
 
use App\Helpers\CustomFormRequest; 
use Illuminate\Contracts\Validation\Validator; 

class ContactReplyRequest extends CustomFormRequest
{
    protected $roles =  [    
        'reply' => 'required|min:1|max:1000', 
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
    }

    protected function withValidator(Validator $validator)
    {  
        $validator->after(function ($validator) {
             
        });
    }
}
