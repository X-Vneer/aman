<?php 
namespace App\Enums;

enum NotificationType: string
{
    case UserVideo = 'UserVideo'; 
    case Video = 'Video'; 
    case Contact = 'Contact';  
}

