<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;
use App\Models\Question;
use App\Models\Scenes;
use App\Models\Video;
use Illuminate\Contracts\Validation\Validator;

class QuestionStoreRequest extends CustomFormRequest
{
    protected $roles =  [
        'video_id' => 'required',
        'question' => 'required|array',
        'question.ar' => 'required|min:1|max:1000',
        'question.en' => 'required|min:1|max:1000',
        'question.fr' => 'required|min:1|max:1000',
        'question.id' => 'required|min:1|max:1000',
        'answers_a' => 'required|array',
        'answers_a.ar' => 'required|min:1|max:1000',
        'answers_a.en' => 'required|min:1|max:1000',
        'answers_a.fr' => 'required|min:1|max:1000',
        'answers_a.id' => 'required|min:1|max:1000',
        'answers_b' => 'required|array',
        'answers_b.ar' => 'required|min:1|max:1000',
        'answers_b.en' => 'required|min:1|max:1000',
        'answers_b.fr' => 'required|min:1|max:1000',
        'answers_b.id' => 'required|min:1|max:1000',
        'answers_c' => 'nullable|array',
        'answers_c.ar' => 'nullable|min:1|max:1000',
        'answers_c.en' => 'nullable|min:1|max:1000',
        'answers_c.fr' => 'nullable|min:1|max:1000',
        'answers_c.id' => 'nullable|min:1|max:1000',
        'answers_d' => 'nullable|array',
        'answers_d.ar' => 'nullable|min:1|max:1000',
        'answers_d.en' => 'nullable|min:1|max:1000',
        'answers_d.fr' => 'nullable|min:1|max:1000',
        'answers_d.id' => 'nullable|min:1|max:1000',
        'wrong_a' => 'nullable|array',
        'wrong_a.ar' => 'nullable|min:1|max:1000',
        'wrong_a.en' => 'nullable|min:1|max:1000',
        'wrong_a.fr' => 'nullable|min:1|max:1000',
        'wrong_a.id' => 'nullable|min:1|max:1000',
        'wrong_b' => 'nullable|array',
        'wrong_b.ar' => 'nullable|min:1|max:1000',
        'wrong_b.en' => 'nullable|min:1|max:1000',
        'wrong_b.fr' => 'nullable|min:1|max:1000',
        'wrong_b.id' => 'nullable|min:1|max:1000',
        'wrong_c' => 'nullable|array',
        'wrong_c.ar' => 'nullable|min:1|max:1000',
        'wrong_c.en' => 'nullable|min:1|max:1000',
        'wrong_c.fr' => 'nullable|min:1|max:1000',
        'wrong_c.id' => 'nullable|min:1|max:1000',
        'wrong_d' => 'nullable|array',
        'wrong_d.ar' => 'nullable|min:1|max:1000',
        'wrong_d.en' => 'nullable|min:1|max:1000',
        'wrong_d.fr' => 'nullable|min:1|max:1000',
        'wrong_d.id' => 'nullable|min:1|max:1000',
        'correct_answer' => 'required|in:answer_a,answer_b,answer_c,answer_d',
        'allowed_time' => 'required|time_format',
        'appears_at' => 'required|array',
        'appears_at.ar' => 'required|time_format',
        'appears_at.en' => 'required|time_format',
        'appears_at.fr' => 'required|time_format',
        'appears_at.id' => 'required|time_format',
        'wrong_answer_audio_urls' => 'array',
        'wrong_answer_audio_urls.*' => 'nullable|min:1|max:1000',
    ];



    public function rules()
    {
        return $this->roles;
    }

    protected function prepareForValidation()
    {
        parent::prepareForValidation();
        if ($this->isMethod('put')) {
            $this->merge(['id' => $this->route('question')]);
            $this->roles['id'] =   'required';
        }
    }

    protected function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            // Validate video_id exists (including trashed)
            if ($this->video_id) {
                $video = Video::withTrashed()->where('id', $this->video_id)->first();
                if (!$video) { 
                    $validator->errors()->add('video_id', trans('validation.exists', ['attribute' => 'video_id']));
                }
            }

            // Validate question id exists (including trashed) for PUT requests
            if ($this->isMethod('put') && $this->id) {
                $question = Question::find($this->id);
                if (!$question) {
                    $validator->errors()->add('id', trans('validation.exists', ['attribute' => 'id']));
                }
            }

            // Validate unique appears_at for the video
            if ($this->appears_at && is_array($this->appears_at)) {
                $item = Question::where('video_id', $this->video_id)->get();
                if ($this->isMethod('put')) {
                    $item = $item->filter(function ($question) {
                        return $question->id != $this->id;
                    });
                }
                $appearsAtJson = json_encode($this->appears_at, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                $is_item = $item->contains(function ($question) use ($appearsAtJson) {
                    $questionAppearsAtJson = json_encode($question->appears_at, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                    return $questionAppearsAtJson === $appearsAtJson;
                });
                if($is_item) $validator->errors()->add('appears_at', trans('validation.unique', ['attribute' => trans('validation.attributes.appears_at')]));
            }
        });
    }
}
