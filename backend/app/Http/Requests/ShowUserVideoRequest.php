<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use Illuminate\Contracts\Validation\Validator;

class ShowUserVideoRequest extends CustomFormRequest
{
    protected $roles =  [   
        'video_id' => 'required|exists:user_videos,video_id,deleted_at,NULL',
    ]; 

    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    { 
        parent::prepareForValidation();    
        if ($this->isMethod('show') && !$this->video_id) {
            $this->merge(['video_id' => $this->route('user-video')]);     
        }  
    }

    protected function withValidator(Validator $validator)
    {  
        
        $validator->after(function ($validator) {
            
        });
    }
}
