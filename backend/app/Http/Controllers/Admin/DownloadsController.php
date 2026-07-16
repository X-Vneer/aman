<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Resources\DownloadResource; 
use App\Models\AppConstants;
use App\Models\Downloads; 
use Illuminate\Http\Request;
use Auth; 

class DownloadsController extends BaseApiController
{

    public function index(Request $request)
    { 

        // try {
            $downloads = Downloads::orderBy($request->sortColumnName?? 'id', $request->sortDirection?? 'DESC')
            ->where(function($q) use($request){
                return $q->search('id', $request->glopaleSearch)
                        ->orSearch('type', $request->glopaleSearch)
                        ->orSearch('path', $request->glopaleSearch);
            });
 

            $downloads = $downloads->paginate($request->paginationCounter?? AppConstants::$PerPage);
            return $this->sendResponse(true, ['downloads'=>DownloadResource::collection($downloads)->response()->getData(true)], 'List  Downloads');
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, [], 'Server Error: DownloadsApiController@index', []);
        // }
    }



    public function download($id)
    {
        $path = Downloads::findOrFail($id)->path;
        $full_path = storage_path("app/public/$path");
        return response()->download($full_path)->deleteFileAfterSend(false);
    }


    public function destroy($id)
    { 
        try {
            $download = Downloads::findOrFail($id);
            $download->delete();
            return $this->sendResponse(true, [], 'The File has been deleted');
        } catch (\Throwable $th) {
            return $this->sendResponse(false, [], 'Server Error: DownloadsApiController@destroy', []);
        }
    }
}
