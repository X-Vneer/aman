<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentCallbackLog extends Model
{
    protected $fillable = [
        'request_data',
        'action',
        'result',
        'status',
        'order_id',
        'trans_id',
        'trans_date',
        'amount',
        'currency',
        'hash',
        'rrn',
        'card_brand',
        'merchant_name',
        'transaction_identifier',
        'processor_mid',
        'methods',
        'redirect_url',
        'redirect_params',
        'redirect_method',
        'card',
        'card_expiration_date',
        'sessionId',
        'decline_reason',
    ];

    protected $casts = [
        'request_data' => 'array',
    ];
}
