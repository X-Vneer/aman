<?php

namespace App\Http\Requests;

use App\Enums\VideoPaymentStatus;
use App\Helpers\CustomFormRequest;
use App\Models\UserVideo;
use Illuminate\Contracts\Validation\Validator;

class ShowVideoRequest extends CustomFormRequest
{
    /**
     * Route `{video}` is resolved in VideoController via Video::resolveIdFromRouteParameter (slug or id).
     */
    protected $roles = [
        'coupon' => 'nullable|string|max:191',
    ];

    public function rules()
    {
        return $this->roles;
    }

    protected function withValidator(Validator $validator)
    {

        $validator->after(function ($validator) {
            if (auth('user')->check()) {
                // $userVideo = UserVideo::where('video_id', $this->id)->where('status', VideoPaymentStatus::Accepted->value)->first();
                // if(!$userVideo){
                //     $validator->errors()->add('id', 'You are not paid for this program!');
                // }
            }

        });
    }
}
