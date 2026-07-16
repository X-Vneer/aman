<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TestController extends BaseApiController
{

   function edfaPayment(Request $request)
   {
       $url = config('edfapay.host');
       $key = config('edfapay.merchant_key');
       $password = config('edfapay.password');

       // Prepare the request body
       $body = [
           "action" => "SALE",
           "edfa_merchant_id" => $key,
           "order_id" => rand(1,16225),
           "order_amount" => "5",
           "order_currency" => "SAR",
           "order_description" => "Payment for video 1",
           "req_token" => "N",
           "payer_first_name" => "Ahmed",
           "payer_last_name" => "Alyouns",
           "payer_address" => "Riyadh",
           "payer_country" => "SA",
           "payer_city" => "Riyadh",
           "payer_zip" => "12221",
           "payer_email" => "info@inaash.edu.sa",
           "payer_phone" => "966565555555",
           "payer_ip" => $request->ip(),
           "term_url_3ds" => config("app.platform"),
           "auth" => "Y",
           "recurring_init" => "N",
       ];

       // Construct the string to be hashed
       $toMd5 = strtoupper(
           $body['order_id'] .
           $body['order_amount'] .
           $body['order_currency'] .
           $body['order_description'] .
           $password
       );

       // Generate MD5 and then SHA1
       $toMd5 = strtoupper($toMd5); // Ensure the hash is in uppercase
       $md5Hash = md5($toMd5);
       $hash = sha1($md5Hash);

       // Add the hash to the body
       $body['hash'] = $hash;

       // Send the request
       try {
           $response = Http::withHeaders(['Content-Type' => 'application/x-www-form-urlencoded'])
               ->timeout(10)
               ->connectTimeout(10)
               ->withoutVerifying()
               ->asForm() // Send body as form data
               ->post($url, $body);

           if ($response->successful()) {
               return $this->sendResponse(true, ['item' => $response->json()], 'Payment Success', null, 200, $request);
           } else {
               return $this->sendResponse(false, [
                   'errors' => json_decode($response->body()),
                   'url' => $url,
                   'response_status' => $response->status(),
                   'payload' => $body,
                   'key' => $key,
                   'password' => $password,
               ], 'Payment Failed', ['message' => 'Payment Failed'], 422, $request);
           }
       } catch (\Exception $e) {
           return $this->sendResponse(false, null, 'Payment Error', ['message' => $e->getMessage()], 500, $request);
       }
   }

}
