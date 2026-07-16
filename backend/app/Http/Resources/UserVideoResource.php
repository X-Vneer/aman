<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserVideoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Certificate PDF generation is not dispatched here (it ran on every API response and
     * triggered a broken self-HTTP call). It runs from RateController and from
     * UserVideoController::checkQuestionAnswer when the course is completed.
     *
     * لا نطلق توليد الشهادة من هنا لأن ذلك كان يحدث مع كل طلب API ويسبب مشاكل.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'video_id' => $this->video_id,
            'transaction_id' => $this->transaction_id,
            'answer_average' => $this->answer_average == 0? '00:00:00' : $this->answer_average,
            'hearts' => $this->hearts,
            'total_questions' => $this->total_questions,
            'correct_answers' => $this->correct_answers,
            'evaluation' => $this->evaluation,
            'progress' => $this->progress,
            'lang' => $this->lang,
            'current_time' => $this->current_time ,
            'last_question_id' => $this->last_question_id,

            'view_counter' => $this->view_counter,
            'view_complete_counter' => $this->view_complete_counter,
            'is_rated' => $this->is_rated,
            'price' => $this->price,
            'coupon_id' => $this->coupon_id,
            'coupon_code' =>  $this->coupon_code,
            'has_form' => $this->has_form,
            'discount_value' => $this->discount_value,
            'final_price' => $this->final_price,
            'paid' => $this->paid,
            'outstanding_payment' => $this->outstanding_payment,
            'status' => $this->status,

            'certificate_url' => $this->certificate_url,
            'certificate_qr_code' => $this->certificate_qr_code ? config("app.aman_api") . 'storage/qr/'.$this->certificate_number.'.png' : null,
            'certificate_number' => $this->certificate_number,
            'deleted_at' => $this->deleted_at,
        ];

        $data =  toString($data);
        $data['video'] =  new VideoResource($this->video);
        $data['user'] =  new UserResource($this->user);
        $data['is_rated'] =  $this->is_rated == "0"? false : true;
        $data['is_certificate_generated'] = $this->is_certificate_generated == "0"? false : true;
        $data['is_new'] = (bool) ($this->video?->is_new ?? 0);
        $data['coupon_code'] = $this->coupon_code;
        $data['has_form'] = $this->has_form? true : false;

        $data['has_form'] = $data['has_form'] && $this->userInfo?->id? false : $data['has_form'];
        $data['is_applicable_for_certificate'] = $this->isApplicableForCertificate();

        return $data;
    }

    public function heading(): array
    {
        return array_keys($this->toArray(request()));
    }
}
