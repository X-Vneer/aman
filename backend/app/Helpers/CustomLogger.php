<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;

class CustomLogger
{
    public static function logInfo($fileName, $message, $context = [])
    {
        $folderPath = storage_path('logs/' . date('Y') . '/' . date('m') . '/' . date('d'));

        if (!is_dir($folderPath)) {
            mkdir($folderPath, 0777, true);
        }

        $logFilePath = $folderPath . '/' . $fileName;

        Log::build([
            'driver' => 'single',
            'path' => $logFilePath,
            'level' => 'info',
        ])->info($message, $context);
    }
}
