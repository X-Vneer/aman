<?php
namespace App\Services;

use App\Models\OTP;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class SendUserOTPService
{
    public $otp = '';
    public $code = '';
    public $message = '';
    protected $user;
    protected $response = null;

    function __construct($user)
    {
        $this->user = $user;
        if($this->user->mobile >= 966533000000 && $this->user->mobile <= 966533000200 || in_array($this->user->mobile, [
            '971504585852',
            '971504445744',
            '971505441393',
            '971506570414',
            '962795545689',
            '218925421960',
            '9613338588'
        ])){
            $this->user->update(['otp' => '0000', 'otp_created_at' => Carbon::now()]);
        }else{
            $user->update(['otp' => rand(1000, 9999), 'otp_created_at' => Carbon::now()]);
        }
        // $user->update(['otp' => rand(1000, 9999), 'otp_created_at' => Carbon::now()]);
        // $user->update(['otp' => '0000', 'otp_created_at' => Carbon::now()]);

        $this->otp = $user->otp;

        if (config('app.env') == 'production'
            || config('app.env') == 'local'
            || !in_array($this->user->mobile, [
                '971504585852',
                '971504445744',
                '971505441393',
                '971506570414',
                '962795545689',
                '218925421960',
                '9613338588'
            ])
        ) {
            $this->sendSMS();
        }
    }

    protected function sendSMS(){
        $body = [
            "userName" => config('msegat.user_name'),
            "numbers" => trimMobile($this->user->mobile),
            "userSender" => config('msegat.user_sender'),
            "apiKey" => config('msegat.api_key'),
            "msg" => "رمز التحقق للدخول على منصة انعاش هو : " . $this->otp,
        ];

        try {
            $this->response = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->timeout(5)
                ->connectTimeout(3)
                ->withoutVerifying()
                ->post(config('msegat.send_url') , $body);

            $this->saveResponse();
        } catch (\Throwable $th) {
            $this->saveResponse();
        }
    }

    protected function saveResponse() {
        $this->code = $this->response?->json('code')?? 401;
        $this->message = $this->response?->json('message')?? 'API Connection Error';

        OTP::create([
            'key' => 'SMS',
            'mobile' => trimMobile($this->user->mobile),
            'otp' => $this->otp,
            'code' => $this->code,
            'message' => $this->message,
        ]);
    }
}

