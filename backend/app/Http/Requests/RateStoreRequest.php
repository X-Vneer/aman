<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use App\Models\Rate;
use App\Models\UserVideo;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Auth;

class RateStoreRequest extends CustomFormRequest
{
    protected $roles =  [
        'video_id' => 'required|exists:videos,id,deleted_at,NULL',
        'rate_1' => 'required|numeric|min:1|max:3',
        'rate_2' => 'required|numeric|min:1|max:3',
        'rate_3' => 'required|numeric|min:1|max:3',
        'rate_4' => 'required|numeric|min:1|max:3',
        'comment' => 'nullable|min:1|max:1000',
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
            // $rate = Rate::where(['video_id'=> $this->video_id, 'user_id' => Auth::id()])->first();
            $user_video = UserVideo::where(['video_id'=> $this->video_id, 'user_id' => Auth::id()])
                    ->registered()
                    ->latest()
                    ->first();

            if($user_video?->certificate_number == null || !$user_video) $validator->errors()->add('video_id', trans('youAreNotAllowToRateThisProgram'));
            // if($user_video?->is_rated) $validator->errors()->add('video_id', trans('youAlreadyRatedThisCourse'));
            // if($rate) $validator->errors()->add('video_id', trans('youAlreadyRatedThisProgram'));
        });
    }
}
