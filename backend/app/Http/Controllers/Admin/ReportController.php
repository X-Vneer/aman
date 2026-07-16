<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Traits\Controller\IndexTrait;
use App\Models\UserVideo;
use App\Services\GeneralGraph;
use App\Services\ReportCertificateGraph;
use App\Services\ReportUserGraph;
use App\Services\UserGraph;
use Illuminate\Http\Request;

class ReportController extends BaseApiController {

    use IndexTrait;

    function __construct()
    {
        parent::__construct(UserVideo::class);
    }



    function generalGraph(Request $request)
    {
        // try {
            $userGraph =  new GeneralGraph($request->langs, $request->video_ids, $request->date_from, $request->date_to);
            return $this->sendResponse(true, ['graph' => $userGraph] );
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        // }
    }

    function certificateGraph(Request $request)
    {
        // try {
            $graph =  new ReportCertificateGraph($request->langs, $request->video_ids, $request->date_from, $request->date_to);
            return $this->sendResponse(true, ['graph' => $graph], null, 200 );
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        // }
    }

    function userGraph(Request $request)
    {
        // try {
            $graph =  new ReportUserGraph($request->langs, $request->video_ids, $request->date_from, $request->date_to);
            return $this->sendResponse(true, ['graph' => $graph] );
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        // }
    }
}
