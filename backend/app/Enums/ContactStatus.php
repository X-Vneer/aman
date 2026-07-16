<?php 
namespace App\Enums;

enum ContactStatus: string
{
    case New = 'New'; 
    case Pending = 'Pending'; 
    case Responded = 'Responded'; 
}


