<?php

namespace App\Services;

use Illuminate\Contracts\Validation\Validator;

class FailedValidation
{
    public $validator = null;
    public $response = null;
    public $status = true;

    function __construct(Validator $validator)
    {
        $this->validator = $validator;
        $this->prepareResponse();
    }

    protected function prepareResponse()
    {
        $errors = $this->validator->errors();
        $errorsArr = json_decode(json_encode($errors), true);
        $this->status = false;
        $message = '';
        $errorsArrValues = array_values($errorsArr);

        if (!empty($errorsArrValues) && isset($errorsArrValues[0][0])) {
            $message = $errorsArrValues[0][0];
            if (count($errorsArrValues ?? []) > 1) {
                $message .= trans('and') . (count($errorsArrValues ?? []) - 1) . trans('moreValidation');
            }
        }

        $code = 422;
        $this->response = response()->json([
           'status' => false,
           'message' => $message,
           'data' => null,
           'guard' => Authed()->guard,
           'errors' => $errorsArr,
           'response_code' => $code,
           'request_data' => request()->all(),
        ], $code);
    }
}
