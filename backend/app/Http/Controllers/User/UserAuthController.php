<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\UserRegisterRequest;
use App\Http\Requests\UserRegisterRequestWithOutOTP;
use App\Http\Requests\UserVerifyOtpRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\SendUserOTPService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;


class UserAuthController extends BaseApiController
{
    public function loginRegisterResendOtp(UserRegisterRequest $request)
    {
        try {
            $item = User::withTrashed()->where('mobile', trimMobile($request->mobile))->first();

            if (!$item) {
                $item = User::create(['mobile' => trimMobile($request->mobile)]);
            }

            if($item?->otp_created_at && config('app.env') != 'testing'){
                $diff_otp_time = Carbon::parse($item?->otp_created_at)->diffInSeconds(Carbon::now());

                $otpDelay = (int) config('constants.otpDelay');
                $diff_reset = (int) ($otpDelay - $diff_otp_time);

                if ($diff_otp_time < $otpDelay) {
                    $errorMsg = trans('tryAgainAfter', ['seconds' => $diff_reset]);
                    return $this->sendResponse(false, ['delay_seconds' => $diff_reset], $errorMsg, ['email' => [$errorMsg]], 403);
                }
            }

            try {
                $sendUserOTPService = new SendUserOTPService($item);
            } catch (\Exception  $e) {
                return response()->json(['message' => 'Failed to send OTP SMS.', 'error' => $e->getMessage()], 500);
            }


            return $this->sendResponse(true, [
                'ENV' => config('app.env'),
                'ip' => $request->ip(),
                'sms_response_code' => $sendUserOTPService->code,
                'sms_response_message' => $sendUserOTPService->message,
                'otp' => config('app.env') == 'production'? null : $sendUserOTPService->otp,
            ], trans('otpHasBeenSentToYourMobile'), null, 200, $request);

        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function loginRegister(UserRegisterRequestWithOutOTP $request)
    {
        try {
            $item = User::withTrashed()->where('mobile', trimMobile($request->mobile))->first();

            if (!$item) {
                $item = User::create(['mobile' => trimMobile($request->mobile)]);
            }

            $token = $item?->createToken("auth_token");
            $item->is_login = true;


            return $this->sendResponse(true, [
                'token' => $token->plainTextToken,
                'timeout_audio' => json_decode(settings('timeout_audio')->set_value, JSON_UNESCAPED_UNICODE)[app()->getLocale()] ,
                'item' => new  UserResource($item),
            ], 'Successful login', null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function otpVerify(UserVerifyOtpRequest $request)
    {
        try {

            $item = User::withTrashed()->where('mobile', trimMobile($request->mobile))
                ->where('otp', $request->otp)
                ->first();


            $item?->update([
                'otp' => '', 'mobile_verified_at' => Carbon::now(),
                'lang' => $request->header('Accept-Language')
            ]);

            $token = $item?->createToken("auth_token");
            $item->is_login = true;


            return $this->sendResponse(true, [
                'token' => $token->plainTextToken,
                'timeout_audio' => json_decode(settings('timeout_audio')->set_value, JSON_UNESCAPED_UNICODE)[app()->getLocale()] ,
                'item' => new  UserResource($item),
            ], 'Successfull login', null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function updateMobile(Request $request)
    {
        try {
            $user = User::withTrashed()
                ->where('mobile', $request->old_mobile)
                ->where('otp', $request->otp)
                ->first();

            $id = $user?->id;
            $inputs = $request->all();
            $inputs['mobile'] = trimMobile($request->mobile);

            $validator = Validator::make($inputs, [
                'old_mobile' => 'required|sa_mobile|exists:users,mobile',
                'new_mobile' => 'required|sa_mobile|unique:brands,mobile|unique:users,mobile,' . $id . ',id',
                'otp' => 'required'
            ]);



            $validator->after(function ($validator) use ($user) {
                // Check if the user exists
                if (!$user) {
                    $errorMsg = trans('invalidOtp');
                    $validator->errors()->add('otp', $errorMsg);
                } else {
                    // Check if OTP has expired
                    $diff_otp_time = Carbon::now()->diffInSeconds(Carbon::parse($user?->otp_created_at));
                    if ($diff_otp_time > 600) {
                        $errorMsg = trans('otpHasBeenExpired!');
                        $validator->errors()->add('otp', $errorMsg);
                    }
                }
            });

            $check = $this->checkValidator($validator);
            if ($check) return $check;

            // Custom validation rules using closure


            $user->update(['otp' => '', 'mobile' => trimMobile($request->new_mobile)]);
            $token = $user->createToken("auth_token");
            $user->is_login = true;

            return $this->sendResponse(true, [
                'token' => $token->plainTextToken,
                'item' => new  userResource($user),
            ], 'Successfull UpdateMobile', null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }
}
