<?php 
namespace App\Enums;

enum CouponTypeStatus: string
{
    case Active = 'Active';
    case InActive = 'Inactive';
    case Expired = 'Expired';
}


