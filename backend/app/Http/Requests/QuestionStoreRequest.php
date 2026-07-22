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
        'answers_a' => 'required|array',
        'answers_a.ar' => 'required|min:1|max:1000',
        'answers_a.en' => 'required|min:1|max:1000',
        'answers_b' => 'required|array',
        'answers_b.ar' => 'required|min:1|max:1000',
        'answers_b.en' => 'required|min:1|max:1000',
        'answers_c' => 'nullable|array',
        'answers_c.ar' => 'nullable|min:1|max:1000',
        'answers_c.en' => 'nullable|min:1|max:1000',
        'answers_d' => 'nullable|array',
        'answers_d.ar' => 'nullable|min:1|max:1000',
        'answers_d.en' => 'nullable|min:1|max:1000',
        'wrong_a' => 'nullable|array',
        'wrong_a.ar' => 'nullable|min:1|max:1000',
        'wrong_a.en' => 'nullable|min:1|max:1000',
        'wrong_b' => 'nullable|array',
        'wrong_b.ar' => 'nullable|min:1|max:1000',
        'wrong_b.en' => 'nullable|min:1|max:1000',
        'wrong_c' => 'nullable|array',
        'wrong_c.ar' => 'nullable|min:1|max:1000',
        'wrong_c.en' => 'nullable|min:1|max:1000',
        'wrong_d' => 'nullable|array',
        'wrong_d.ar' => 'nullable|min:1|max:1000',
        'wrong_d.en' => 'nullable|min:1|max:1000',
        'correct_answer' => 'required|in:answer_a,answer_b,answer_c,answer_d',
        'allowed_time' => 'required|time_format',
        'appears_at' => 'required|array',
        'appears_at.ar' => 'required|time_format',
        'appears_at.en' => 'required|time_format',
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

            // Validate appears_at per language. The player keys questions by the CURRENT
            // locale's appears_at, so each language must be checked on its own — comparing
            // the full {ar,en} JSON (as before) missed both of these cases.
            if ($this->appears_at && is_array($this->appears_at)) {
                $existing = Question::where('video_id', $this->video_id)->get();
                if ($this->isMethod('put')) {
                    $existing = $existing->filter(function ($question) {
                        return $question->id != $this->id;
                    });
                }

                foreach (['ar', 'en'] as $loc) {
                    $seconds = $this->appearsAtSeconds($this->appears_at[$loc] ?? null);
                    if ($seconds === null) {
                        continue; // absent/malformed — the time_format rule reports it
                    }

                    // A question at video second 0 can never trigger: the player's poster
                    // covers t=0 and its fire-guard skips the "0" slot, so it stays invisible.
                    if ($seconds === 0) {
                        $validator->errors()->add(
                            "appears_at.$loc",
                            trans('validation.appears_at_not_zero', ['attribute' => trans("validation.attributes.appears_at.$loc")])
                        );
                        continue;
                    }

                    // Per-locale uniqueness: two questions sharing the same second in ANY
                    // language collapse to one on the player, even when the {ar,en} pair differs.
                    $clash = $existing->contains(function ($question) use ($loc, $seconds) {
                        return $this->appearsAtSeconds($question->getTranslation('appears_at', $loc)) === $seconds;
                    });
                    if ($clash) {
                        $validator->errors()->add(
                            "appears_at.$loc",
                            trans('validation.unique', ['attribute' => trans("validation.attributes.appears_at.$loc")])
                        );
                    }
                }
            }
        });
    }

    /**
     * Convert an "HH:MM:SS" time string to whole seconds, or null when absent/unparseable.
     */
    private function appearsAtSeconds(?string $time): ?int
    {
        if (!is_string($time) || trim($time) === '') {
            return null;
        }
        $parts = array_map('intval', explode(':', $time));

        return ($parts[0] ?? 0) * 3600 + ($parts[1] ?? 0) * 60 + ($parts[2] ?? 0);
    }
}
