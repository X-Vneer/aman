<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\AdminVerifyOtpRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use App\Services\SendEmailOTPService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AdminAuthController  extends BaseApiController
{
    public function loginRegisterResendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|exists:admins,email',
            'password' => 'required',
        ]);

        $check = $this->checkValidator($validator);
        if ($check) return $check;

        $item = Admin::where('email', $request->email)->first();
        if (!$item) {
            return $this->sendResponse(false, null, trans('inActiveAccount'), ['email' => [trans('inActiveAccount')]], 400, $request);
        }

        if (!Hash::check($request->password, $item->password)) {
            return $this->sendResponse(false, null, trans('invalidCredentials'), ['email' => [trans('invalidCredentials')]], 401, $request);
        }

        $item->update([
            'lang' => $request->header('Accept-Language')
        ]);

        $token = $item->createToken("auth_token");
        $item->is_login = true;

        return $this->sendResponse(true, [
            'token' => $token->plainTextToken,
            'item' => new AdminResource($item),
        ], 'Successfull login', null, 200, $request);
    }

    public function requestOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|exists:admins,email,deleted_at,NULL',
        ]);

        $check = $this->checkValidator($validator);
        if ($check) return $check;

        // try {
            $item = Admin::where('email', $request->email)->first();


            if($item?->otp_created_at && config('app.env') != 'testing'){
                $diff_otp_time = Carbon::parse($item?->otp_created_at)->diffInSeconds(Carbon::now());

                $otpDelay = (int) config('constants.otpDelay');
                $diff_reset = (int) ($otpDelay - $diff_otp_time);

                if ($diff_otp_time < $otpDelay) {
                    $errorMsg = trans('tryAgainAfter', ['seconds' => $diff_reset]);
                    return $this->sendResponse(false, ['delay_seconds' => $diff_reset], $errorMsg, ['email' => [$errorMsg]], 403, $request);
                }
            }else{
                return $this->sendResponse(false, null, trans('emailNotFound'), [], 500, $request);
            }

            // try {
                $otp = new SendEmailOTPService($item);
            // } catch (\Exception  $e) {
            //     return $this->sendResponse(false, null, 'Failed to send OTP to Email.', ['message' => 'Failed to send OTP to Email.', 'error' => $e->getMessage()], 500, $request);
            // }


            return $this->sendResponse(true, [
                'ENV' => config('app.env'),
                'ip' => $request->ip(),
                'otp' => config('app.env') == 'production'? null : $otp->otp
            ], trans('OTP Has Been Sent To Your Email'), null, 200, $request);

        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        // }
    }

    public function otpVerify(AdminVerifyOtpRequest $request)
    {
        try {
            $item = Admin::withTrashed()->where('email', $request->email)
                ->where('otp', $request->otp)
                ->first();


            $item?->update([
                'lang' => $request->header('Accept-Language')
            ]);

            $token = $item?->createToken("auth_token");
            $item->is_login = true;


            return $this->sendResponse(true, [
                'token' => $token->plainTextToken,
                'item' => new  AdminResource($item),
            ], 'Successfull login', null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function updatePassword(UpdatePasswordRequest  $request)
    {
        try {
            $item = Admin::withTrashed()->where('email', $request->email)
                ->where('otp', $request->otp)
                ->first();


            $item?->update([
                'lang' => $request->header('Accept-Language'),
                'password' => $request->password
            ]);

            $token = $item?->createToken("auth_token");
            $item->is_login = true;


            return $this->sendResponse(true, [
                'token' => $token->plainTextToken,
                'item' => new  AdminResource($item),
            ], 'Successfull Password Updated', null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function updateEmail(Request $request)
    {
        try {
            $user = Admin::withTrashed()
                ->where('email', $request->old_email)
                ->where('otp', $request->otp)
                ->first();

            $id = $user?->id;

            $validator = Validator::make([...$request->all()], [
                'old_email' => 'required|exists:users,email',
                'new_email' => 'required|unique:users,email|unique:users,email,' . $id . ',id',
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


            $user->update(['otp' => '', 'email' => $request->new_email]);
            $token = $user->createToken("auth_token");
            $user->is_login = true;

            return $this->sendResponse(true, [
                'token' => $token->plainTextToken,
                'item' => new  AdminResource($user),
            ], 'Success Update Email', null, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

}
