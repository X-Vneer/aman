<?php 
namespace App\Enums;

enum ContactType: string
{
    case Inquiry = 'Inquiry'; 
    case Complaint = 'Complaint'; 
    case Suggestion = 'Suggestion';   
}

