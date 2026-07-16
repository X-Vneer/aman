<?php

return [
    'api_key' => env('MSEGAT_API_KEY'),
    'user_name' => env('MSEGAT_USER_NAME'),
    'user_sender' => env('MSEGAT_USER_SENDER'),
    'send_url' => env('MSEGAT_SEND_URL', 'https://www.msegat.com/gw/sendsms.php'),
];
