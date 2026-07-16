<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use App\Models\Scenes;
use Illuminate\Contracts\Validation\Validator;

class ScenesStoreRequest extends CustomFormRequest
{
    protected $roles =  [
        'video_id' => 'required|exists:videos,id',
        'title' => 'array',
        'title.ar' => 'required|min:1|max:191',
        'title.en' => 'required|min:1|max:191',
        'title.fr' => 'required|min:1|max:191',
        'title.ur' => 'required|min:1|max:191',
        'title.fil' => 'required|min:1|max:191',
        'title.id' => 'required|min:1|max:191',
        'start_time' => 'required|time_format',
        'logo' => 'required|min:1|max:191',
        'length' => 'required|time_format',
        'end_time' => 'required|time_format|after:start_time',
    ];



    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();
        if ($this->isMethod('put')) {
            $this->merge(['id' => $this->route('scene')]);
            $this->roles['id'] =   'required|exists:scenes,id';
        }
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
             $scene = Scenes::where(['video_id'=> $this->video_id, 'start_time' => $this->start_time]);
             if ($this->isMethod('put')) {
                $scene = $scene->where('id', '<>', $this->id);
            }
            $is_scene = $scene->count()>0;
            if($is_scene) $validator->errors()->add('start_time', 'The selected start time has already been taken for this video.');
        });
    }
}
