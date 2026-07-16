<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use Illuminate\Contracts\Validation\Validator;

class UpdateCertificateUserName extends CustomFormRequest
{
    protected $roles =  [
        'user_video_id' => 'required|exists:user_videos,id',
        'first_name' => 'required|string|max:191',
        'last_name' => 'required|string|max:191',
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

    }
}
