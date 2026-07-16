<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use App\Models\Story;
use App\Models\Video;
use Illuminate\Contracts\Validation\Validator;

class StoryRequest extends CustomFormRequest
{
    protected $roles = [
        'first_name' => 'required|string|max:100',
        'last_name' => 'required|string|max:100',
        'title' => 'required|string|max:255',
        'mobile' => 'required|string|max:20',
        'age' => 'required|integer|min:18|max:120',
        'email' => 'required|email|max:255',
        'video_id' => 'nullable|exists:videos,id',
        'content' => 'required|string',
        'program_name' => 'nullable|string|max:255',
    ];

    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();

        if ($this->isMethod('put')) {
            $this->merge(['id' => $this->route('story')]);
            $this->roles['id'] = 'required|exists:stories,id,deleted_at,NULL';
        }
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            // Additional validation logic can be added here if needed
        });
    }
}
