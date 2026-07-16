<?php

namespace App\Http\Requests;

use App\Enums\VideoPaymentStatus;
use App\Helpers\CustomFormRequest;
use App\Models\Question;
use App\Models\UserAnswer;
use App\Models\UserVideo;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Auth;

class CheckAnswerRequest extends CustomFormRequest
{
    protected $roles =  [
        'video_id' => 'required|exists:videos,id,deleted_at,NULL',
        'question_id' => 'required|exists:questions,id',
        'answer' => 'nullable|in:answer_a,answer_b,answer_c,answer_d',
        'answer_time' => 'required|time_format',
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
            $item = UserVideo::where(['user_id'=>Auth::id(), 'video_id'=>$this->video_id])
                ->where('status', VideoPaymentStatus::Accepted->value)
                ->registered()
                ->first();


            if(!$item){
                $validator->errors()->add('video_id', trans('youAreNotRegisteredInThisProgram'));
            }


            $last_answer = UserAnswer::where(['user_video_id'=> $item->id, 'user_id'=>Auth::id(), 'video_id'=>$this->video_id])
                ->orderBy('id', 'DESC')
                ->limit(1)
                ->first();



            $locale = app()->getLocale(); // مثل ar أو en

            $lastTime = $last_answer?->question?->appears_at ?? '00:00:00';

            $next_question = Question::where('video_id', $this->video_id)
                ->whereRaw(
                    "STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(appears_at, '$.\"$locale\"')), '%H:%i:%s')
                        > STR_TO_DATE(?, '%H:%i:%s')",
                    [$lastTime]
                )
                ->orderByRaw(
                    "STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(appears_at, '$.\"$locale\"')), '%H:%i:%s') ASC"
                )
                ->first();



            if($this->question_id != $next_question?->id){
                $validator->errors()->add('video_id', trans('Sorry you skipped the some questions, please answer the questions in order!: '));
                // $validator->errors()->add('video_id',  $this->question_id . ' != ' . $next_question?->id);
                // $validator->errors()->add('video_id',  $next_question?->appears_at . ' != ' . $lastTime);
            }

            $answer = UserAnswer::where([
                'user_video_id'=> $item->id,
                'user_id'=>Auth::id(),
                'video_id'=>$this->video_id,
                'question_id'=>$this->question_id,
            ])
            ->where("created_at", '>', now()->subMinute(3))
            ->first();

            if($answer || $item?->certificate_number){
                // $validator->errors()->add('question_id', trans('youAlreadyAnsweredThisQuestion'));
            }
        });
    }
}
