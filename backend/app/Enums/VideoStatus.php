<?php

namespace App\Enums;

enum VideoStatus: string
{
    case Pending = 'New';

    case Approved = 'Updated';
}
