<?php

namespace App\Http\Requests;

use App\Enums\VideoPaymentStatus;
use App\Helpers\CustomFormRequest;
use App\Models\UserVideo;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Auth;

class UserVideoStoreRequest extends CustomFormRequest
{
    protected $roles =  [
        'video_id' => 'required|exists:videos,id,deleted_at,NULL',
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
            $video = UserVideo::withTrashed()
                    ->where(['video_id'=> $this->video_id, 'user_id' => Auth::id()])
                    ->where('status', VideoPaymentStatus::Accepted->value)->registered();

            $is_video = $video->count()>0;
            if($is_video) $validator->errors()->add('user_id', trans('youAlreadyRegisteredInThisProgram'));
        });
    }
}
