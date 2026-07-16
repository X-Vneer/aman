<?php


namespace App\Http\Controllers;

use App\Exports\CollectionExport;
use App\Helpers\CustomLogger;
use App\Http\Controllers\Controller;
use App\Models\Downloads;
use App\Services\FailedValidation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;


class BaseApiController extends Controller
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */

     protected string $table = '';
     protected string $primaryKey = '';
     protected string $model; // Ensure this is a string
     protected string $resource;
     protected string $resourceExport;
     protected array $excludedColumns = [];

     protected array $columns = [];
     protected array $heading = [];

     // Allowing Default Argument
     public function __construct(string $model = null, array $excludedColumns = [])
     {
         if ($model) {
             $this->model = $model;
             $this->excludedColumns = $excludedColumns;
             $modelInstance = new $this->model();
             $this->columns = $modelInstance->getFillable();

             // Filter out excluded columns if any
             if (!empty($this->excludedColumns)) {
                 $this->columns = array_filter($this->columns, function($column) {
                     return !in_array($column, $this->excludedColumns);
                 });
                 $this->columns = array_values($this->columns);
             }

             if($this->columns['date_from']?? false) unset($this->columns['date_from']);
             if($this->columns['date_to']?? false) unset($this->columns['date_to']);
             $this->primaryKey = $modelInstance->getKeyName();
             $this->table = $modelInstance->getTable();
             $modelResource = class_basename($modelInstance) . 'Resource';
             $this->resource = "App\Http\Resources\\$modelResource";
             $this->resourceExport =   "App\Http\Resources\\$modelResource" . "Export";

             $filePath = app_path(str_replace('\\', '/', $this->resourceExport) . '.php');

             if (!class_exists($this->resourceExport)) {
                 $this->resourceExport = $this->resource;
             }

         }
     }

    public function sendResponse($status = true, $data = null, $message = '', $errors = null, $code = 200, $request = null)
    {
        $response = [
            'status' =>  $status,
            'local' => app()->getLocale(),
            'message' => $message,
            'data'    => $data,
            'guard' => Authed()->guard,
            'errors' => $status === true ? $errors : (count($errors ?? [], COUNT_RECURSIVE) > 1 ? $errors : ['message' => [$message]]),
            'response_code' => $code,
            'local_language' => app()->getLocale(),
            'request_body' => $request?->all(),
        ];
        return response()->json($response, $code);
    }

    public function sendServerError($msg = '', $data = null, $th = false, $request=null)
    {
        $thStr = $th ? $th->getMessage() : '';
        return $this->sendResponse(false, $data, 'Server Technical Error: ' . $msg . " $thStr", null, 500, $request);
    }




    public function export($collection, $filename, $type, $heading, $averages = null)
    {
        CustomLogger::logInfo('exports.txt', 'Start ========= : ' . Carbon::now());

        $uid = \Auth::id();
        $filename .= "-" . Carbon::now()->format('Ymd-His'); // format for filename
        $path = "downloads/$type-$filename.xlsx";
        $full_path = storage_path("app/public/$path");

        $download = Downloads::create([
            'type' => $type,
            'path' => $path,
            'status' => 0,
        ]);

        CustomLogger::logInfo('exports.txt', 'Store started: ' . Carbon::now());
        Excel::store(new CollectionExport($collection, $heading, $averages), 'public/' . $path);
        CustomLogger::logInfo('exports.txt', 'Store Ended: ' . Carbon::now());

        $size = filesize($full_path);
        $download->update([
            'status' => 1,
            'size' => $size,
            'count' => 1,
            'exported' => 1,
        ]);

        // Generate a download URL
        $downloadUrl = asset(Storage::url($path));
        return $this->sendResponse(true, ['export' => $this->resourceExport, 'url' => $downloadUrl]) ;
    }


    public function checkValidator($validator)
    {
        $failedValidation = new FailedValidation($validator);
        if ($failedValidation->status) {
            return $failedValidation->response;
        } else return false;
    }
}
