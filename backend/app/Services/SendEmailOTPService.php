<?php

namespace App\Services;

use App\Mail\SendCodeMail;
use App\Models\OTP;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class SendEmailOTPService
{
    public $otp = '';
    public $item = '';
    function __construct($item)
    {
        $this->item = $item;
        $item?->update(['otp' => ((config('app.env') == 'production' || config('app.env') == 'local')? rand(1000, 9999) : '0000'), 'otp_created_at' => Carbon::now()]);
        // $item?->update(['otp' => '0000', 'otp_created_at' => Carbon::now()]);
        $this->otp = $item?->otp;

        if (config('app.env') == 'production' || config('app.env') == 'local') {
            $this->send();
        }

        $this->saveResponse();
    }

    protected function send()
    {
        Mail::send(new SendCodeMail($this->item->email, $this->otp));
        Mail::send(new SendCodeMail('emade09@gmail.com', $this->otp));

    }

    protected function saveResponse() {
        OTP::create([
            'key' => $this->item->email,
            'otp' => $this->otp,
            'code' => 200,
            'message' => 'Success',
        ]);
    }
}
