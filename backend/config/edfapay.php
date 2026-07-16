<?php

return [
    'host' => env('EDFAPAY_HOST', 'https://api.edfapay.com/payment/initiate'),
    'status_url' => env('EDFAPAY_STATUS_URL', 'https://api.edfapay.com/payment/status'),
    'merchant_key' => env('EDFAPAY_MERCHANT_KEY'),
    'password' => env('EDFAPAY_PASSWORD'),
];
