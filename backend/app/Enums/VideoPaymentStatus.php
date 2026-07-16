<?php 
namespace App\Enums;

enum VideoPaymentStatus: string
{
    case UnderReview = 'UnderReview'; 
    case Accepted = 'Accepted'; 
    case Rejected = 'Rejected'; 
}


