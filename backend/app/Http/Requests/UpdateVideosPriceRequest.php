<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest; 
use Illuminate\Contracts\Validation\Validator; 

class UpdateVideosPriceRequest extends CustomFormRequest
{
    protected $roles =  [
        'prices.*' => 'required|array', 
        'prices.*.video_id' => 'required|exists:videos,id', 
        'prices.*.price' => 'required|numeric|min:0|max:100000', 
    ]; 

    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    { 
        parent::prepareForValidation();   
        

    }

    protected function withValidator(Validator $validator)
    {  
        $validator->after(function ($validator) { 
            
        });
    }
}
