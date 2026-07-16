<?php

namespace App\Http\Controllers;

use App\Http\Controllers\API\BaseApiController; 
use Illuminate\Support\Facades\Artisan; 

class CronJobController extends BaseApiController
{
    function queueWork() {
        Artisan::call('queue:work', [
            '--timeout' => 180, // Customize options as needed
            '--tries' => 1,
        ]);
    }
}   
