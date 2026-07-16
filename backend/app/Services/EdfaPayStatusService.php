<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class EdfaPayStatusService
{
    protected $url;
    protected $merchantId;
    protected $password;

    public function __construct()
    {
        $this->url = config('edfapay.status_url');
        $this->merchantId = config('edfapay.merchant_key');
        $this->password = config('edfapay.password');
    }

    public function checkPaymentStatus($hash, $orderId)
    {

        $body = [
            "merchant_id" => $this->merchantId,
            "order_id" => $orderId,
            "hash" => $hash,
        ];

        $response = Http::withHeaders(['Content-Type' => 'application/json'])
            ->timeout(10)
            ->connectTimeout(10)
            ->post($this->url, $body);

        if ($response->successful()) {
            return $response->json();
        }

        return [
            'error' => true,
            'message' => $response->body(),
        ];
    }
}
