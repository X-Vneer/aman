<?php


namespace App\Services;

use App\Helpers\CustomLogger;
use App\Models\Transaction;
use App\Models\UserVideo;
use Illuminate\Support\Facades\Http;

class EdfaPayUserVideo
{
    protected $url;
    protected $key;
    protected $password;
    protected $order_id;
    protected $request;
    protected $response;
    public $redirect_url = null;
    protected UserVideo $userVideo;
    protected $log = 'EdfaPayUserVideo.log';

    function __construct($request, UserVideo $userVideo)
    {
        $this->request = $request;
        $this->userVideo = $userVideo;
        $this->url = config('edfapay.host');
        $this->key = config('edfapay.merchant_key');
        $this->password = config('edfapay.password');
        $this->order_id = (string) rand(1,9999999999);

        // Prepare the request body
        $body = [
            "action" => "SALE",
            "edfa_merchant_id" => $this->key,
            "order_id" => $this->order_id . '_' . $this->userVideo->id,
            "order_amount" => getNewPrice($this->userVideo->video_id, $request->coupon),
            "order_currency" => "SAR",
            "order_description" => "Payment for video " . $this->userVideo->id,
            "req_token" => "N",
            "payer_first_name" => "Inaash",
            "payer_last_name" => "Edu",
            "payer_address" => "Riyadh",
            "payer_country" => "SA",
            "payer_city" => "Riyadh",
            "payer_zip" => "12221",
            "payer_email" => "info@inaash.edu.sa",
            "payer_phone" => $this->userVideo->user->mobile,
            "payer_ip" => $request->ip(),
            // "term_url_3ds" => env("PLATFORM") .app()->getLocale()."/payment/".$this->userVideo->video->id."?success=true",
            "term_url_3ds" => route('payment.redirectPayment', [ 'local'=>app()->getLocale(), 'id'=>$this->userVideo->id]),
            "auth" => "N",
            "recurring_init" => "N",
        ];




        // Construct the string to be hashed
        $toMd5 = strtoupper(
            $body['order_id'] .
            $body['order_amount'] .
            $body['order_currency'] .
            $body['order_description'] .
            $this->password
        );

        // Generate MD5 and then SHA1
        $toMd5 = strtoupper($toMd5); // Ensure the hash is in uppercase
        $md5Hash = md5($toMd5);
        $hash = sha1($md5Hash);

        // Add the hash to the body
        $body['hash'] = $hash;

        $transaction = Transaction::create([
            'user_id' => $this->userVideo->user_id,
            'video_id' => $this->userVideo->video_id,
            'user_video_id' => $this->userVideo->id,
            'order_id' => $body['order_id'],
            'status' => 'Init',
            'request' => $body,
            'hash' => $body['hash'],
        ]);
        $this->userVideo->update(['transaction_id' => $transaction->id]);

        // Send the request
        // try {
            $response = Http::withHeaders(['Content-Type' => 'application/x-www-form-urlencoded'])
                ->timeout(10)
                ->connectTimeout(10)
                ->withoutVerifying()
                ->asForm() // Send body as form data
                ->post($this->url, $body);

            if ($response->successful()) {
                $this->response = $response->json();
                $this->redirect_url = $response->json()['redirect_url'];
                $transaction->update([
                    'result' => 'REDIRECT',
                    'response' => [$this->response]
                ]);
            } else {
                $this->response = json_decode($response->body());
                $transaction->update([
                    'status' => 'Error: ' . $response->status(),
                    'response' => [json_decode($response->body())]
                ]);
            }
        // } catch (\Exception $e) {
        //     CustomLogger::logInfo($this->log, $e->getMessage());
        // }
    }
}
