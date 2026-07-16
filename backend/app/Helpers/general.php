<?php

use App\Jobs\SendFcmNotification;
use App\Models\Setting;
use App\Services\AuthService;
use App\Services\GetNewPriceService;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

function toString($data):array {
    $data = array_map(function($value) {
        if (is_array($value)) {
            return toString($value);
        }
        if ($value instanceof \Carbon\CarbonInterface) {
            return $value->setTimezone('UTC')->toISOString();
        }
        return $value !== null ? strval($value) : $value;
    }, $data);
    return $data;
}

function set_code_number($item, $init) {
    // $item = $item->refresh();
    if($item->code_number) return $item->code_number;
    $item->update(['code_number'=> $init . base_convert($item->id *2, 10, 36)]);
    return $item;
}

function Authed() : AuthService {
    return new AuthService();
}

function settings($set_key) {
    return Setting::where('set_key', $set_key)->first();
}

function getRelative($path){
    return str_replace( 'https://' . request()->getHost() . '/storage/' , '', $path);
}


function generateRandomPassword($length = 8)
{
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?";
    $password = substr(str_shuffle($chars), 0, $length);
    return $password;
}

function executionTime($start_time, $end_time)
{
    $total_time = $end_time - $start_time;
    $minutes = floor($total_time / 60);
    $seconds = $total_time % 60;
    return sprintf("%02d:%02d", $minutes, $seconds);
}

function logToFile($fileName, $content)
{
    $filePath = storage_path('app/' . $fileName);

    // Ensure that the file exists
    if (!file_exists($filePath)) {
        touch($filePath); // Create the file if it doesn't exist
    }

    // Append content to the file in a new line
    file_put_contents($filePath, $content . PHP_EOL, FILE_APPEND);
}



function generateRandomStringId($length = 8)
{
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $id = substr(str_shuffle($chars), 0, $length);
    return $id . '-' . substr(str_shuffle($chars), 0, $length) . '-' . substr(str_shuffle($chars), 0, $length) . '-' . substr(str_shuffle($chars), 0, $length);
}



function delete_img($img_path)
{
    if (file_exists($img_path)) {
        $path_info = pathinfo($img_path);
        $mask = $path_info['dirname'] . '/' . $path_info['filename'] . '*.*';
        array_map("unlink", glob($mask));
    }
}



function getSrc($edit, $name)
{
    $img = $name;
    $imgSrc = $name . 'Src';
    if ($edit) {
        if (file_exists($edit->$imgSrc())) {
            return asset($edit->$imgSrc());
        }
    }
    return '';
}


function get_remote_file_info($url)
{
    $localSrc = str_replace(url('/') . '/', '', $url);
    if (file_exists($localSrc)) {
        $imgsize = filesize($localSrc);
        return formatSizeUnits($imgsize);
    }
}

function formatSizeUnits($bytes)
{
    if ($bytes >= 1073741824) {
        $bytes = number_format($bytes / 1073741824, 2) . ' GB';
    } elseif ($bytes >= 1048576) {
        $bytes = number_format($bytes / 1048576, 2) . ' MB';
    } elseif ($bytes >= 1024) {
        $bytes = number_format($bytes / 1024, 2) . ' KB';
    } elseif ($bytes > 1) {
        $bytes = $bytes . ' bytes';
    } elseif ($bytes == 1) {
        $bytes = $bytes . ' byte';
    } else {
        $bytes = '0 bytes';
    }

    return $bytes;
}


function string_as_column($arr, $key, $string)
{
    foreach ($arr as $k => $v) {
        $arr[$k][$key] = $string;
    }
    return $arr;
}

function getAttr($obj, $child, $attr)
{
    return ($obj->$child) ? $obj->$child->$attr : '';
}
if (!function_exists('getFirstNWords')) {
    function getFirstNWords($string, $n) {
        if ($n < 1) {
            return '';
        }

        $words = explode(' ', $string);

        return implode(' ', array_slice($words, 0, $n));
    }
}

function sendNotification($title, $body, $fcm_tokens, $image = null, $data = [])
{
    // try {

        logToFile('00 Push.txt', "title: $title"  );
        logToFile('00 Push.txt', "body: $body"  );
        logToFile('00 Push.txt', "fcm_tokens: " . json_encode($fcm_tokens, JSON_UNESCAPED_UNICODE));
        logToFile('00 Push.txt', "image: $image"  );
        foreach ($fcm_tokens as $fcm_token) {
            logToFile('00 Push.txt', "Token: " . $fcm_token);
            SendFcmNotification::dispatch($title, $body, $image, $data, $fcm_token);

        }

    // } catch (\Exception $e) {
    //     logToFile('00 Push.txt', 'Push Notification Error: ' . $e->getMessage() );
    // }
}


/**
 * Base Url For Image From Dashboard Project
 */
if (!function_exists('FileBaseURl')) {
    function FileBaseURl($file)
    {
        if ($file) {
            return config('app.file_url') . $file;
        }
    }
}

/**
 * upload64
 */
if (!function_exists('upload64')) {
    function upload64($file, $path)
    {
        $baseDir = 'uploads/' . $path;

        $name = sha1(time() . $file->getClientOriginalName());
        $extension = $file->getClientOriginalExtension();
        $fileName = "{$name}.{$extension}";

        $file->move(public_path() . '/' . $baseDir, $fileName);

        return "{$baseDir}/{$fileName}";
    }
}
/**
 * Upload
 */
if (!function_exists('upload')) {
    function upload($file, $path)
    {
        $baseDir = 'uploads/' . $path;

        $name = sha1(time() . $file->getClientOriginalName());
        $extension = $file->getClientOriginalExtension();
        $fileName = "{$name}.{$extension}";

        $file->move(public_path() . '/' . $baseDir, $fileName);

        return "{$baseDir}/{$fileName}";
    }
}
/**
 * Upload Storage
 */
if (!function_exists('uploadToStorage')) {
    function uploadToStorage($file, $path)
    {
        $baseDir = 'public/' . $path;

        $name = sha1(time() . $file->getClientOriginalName());
        $extension = $file->getClientOriginalExtension();
        $fileName = "{$name}.{$extension}";

        $fullPath = storage_path('app/' . $baseDir);

        try {
            if (!File::exists($fullPath)) {
                File::makeDirectory($fullPath, 0755, true);
            }

            Storage::disk('public')->putFileAs($path, $file, $fileName);

            chmod($fullPath . '/' . $fileName, 0755);

        } catch (\Exception $e) {
            Log::error('File upload failed: ' . $e->getMessage());
            return response()->json(['error' => 'File upload failed.'], 500);
        }

        return [
            'relativePath' => "{$path}/{$fileName}",
            'absolutePath' => asset('storage/' . $path . '/' . $fileName),
        ];
    }
}
/**
 * Upload Storage
 */
if (!function_exists('uploadStorage')) {
    function uploadStorage($file, $name, $path)
    {
        $baseDir = 'public/' . $path;
        $extension = $file->getClientOriginalExtension();
        $fileName = "{$name}.{$extension}";
        Storage::disk('local')->putFileAs($baseDir, $file, $fileName, 'public');
        return "{$path}/{$fileName}";
    }
}



function calculateAverageTime(array $times) {
    $totalSeconds = 0;
    $count = count($times);

    if ($count === 0) {
        return "00:00:00"; // Return a default value if the array is empty
    }

    // Convert each time to seconds and sum them
    foreach ($times as $time) {
        list($hours, $minutes, $seconds) = explode(":", $time);
        $totalSeconds += $hours * 3600 + $minutes * 60 + $seconds;
    }

    // Calculate the average in seconds
    $averageSeconds = floor($totalSeconds / $count);

    // Convert back to hh:mm:ss
    $hours = floor($averageSeconds / 3600);
    $minutes = floor(($averageSeconds % 3600) / 60);
    $seconds = $averageSeconds % 60;

    // Format the result to hh:mm:ss
    return sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
}

function getNewPrice($video_id, $coupon_code) {
    $service = new GetNewPriceService($video_id, $coupon_code);
    return $service->price;
}

function trimMobile($mobile) {
    return str_replace('+', '', $mobile);
}

function evaluateMark($fullMark, $mark)
{
    // Ensure we don't divide by zero
    if ($fullMark <= 0) {
        return 'Invalid fullMark!';
    }

    // Calculate the percentage
    $percentage = ($mark / $fullMark) * 100;

    // Evaluate the result based on the percentage
    if ($percentage < 60) {
        return trans('Fail');
    } elseif ($percentage < 65) {
        return trans('Ok');
    } elseif ($percentage < 75) {
        return trans('Good');
    } elseif ($percentage < 85) {
        return trans('VeryGood');
    } elseif ($percentage <= 100) {
        return trans('Excellent');
    } else {
        return 'Invalid mark!';
    }
}


function isValidUrl($url) {
    return filter_var($url, FILTER_VALIDATE_URL) !== false;
}

/**
 * Get date range based on type
 *
 * @param string $type hourly|daily|weekly|monthly|yearly
 * @return array [Carbon, Carbon]
 */
function getDateRangeByType($type, $date_from = null, $date_to = null): array
{
    $now = Carbon::now();
    if ($date_from && $date_to) {
        return [
            Carbon::parse($date_from),
            Carbon::parse($date_to),
        ];
    }

    switch (strtolower($type)) {
        case 'hourly':
            return [
                $now->copy()->startOfDay(),
                $now->copy()->endOfDay()
            ];

        case 'daily':
            return [
                $now->copy()->startOfMonth(),
                $now->copy()->endOfMonth()
            ];

        case 'weekly':
            return [
                $now->copy()->startOfWeek(),
                $now->copy()->endOfWeek()
            ];

        case 'monthly':
            return [
                $now->copy()->startOfYear(),
                $now->copy()->endOfYear()
            ];

        case 'yearly':
            return [
                $now->copy()->subYears(2)->startOfYear(),
                $now->copy()->endOfYear()
            ];

        default:
            return [
                $now->copy()->startOfMonth(),
                $now->copy()->endOfMonth()
            ];
    }
}
