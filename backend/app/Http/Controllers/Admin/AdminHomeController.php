<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Resources\UserInformationResource;
use App\Http\Resources\UserVideoResource;
use App\Http\Traits\Controller\IndexTrait;
use App\Models\User;
use App\Models\UserVideo;
use App\Models\Video;
use App\Services\UserGraph;
use Carbon\Carbon;
use DragonCode\Contracts\Cashier\Auth\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminHomeController extends BaseApiController {

    use IndexTrait;

    function __construct()
    {
        parent::__construct(UserVideo::class);
    }

    function statistics(Request $request) {
        $date_range = getDateRangeByType($request->dates, $request->date_from, $request->date_to);

        //  try {
            // Base query with date range
            $baseQuery = UserVideo::where('status', 'Accepted')
                ->when($date_range[0] && $date_range[1], function($query) use ($date_range) {
                    return $query->whereBetween('created_at', [
                        $date_range[0],
                        $date_range[1]
                    ]);
                });

            $total_certificates = (string) $baseQuery->clone()
                ->whereNotNull('certificate_qr_code')
                ->count();

            $total_users = (string) User::when($date_range[0] && $date_range[1], function($query) use ($date_range) {
                return $query->whereBetween('created_at', [
                    $date_range[0],
                    $date_range[1]
                ]);
            })->count();

            $total_certificates_statistics = $baseQuery->clone()
                ->whereNotNull('certificate_qr_code')
                ->selectRaw('video_id, COUNT(*) as certificate_count')
                ->groupBy('video_id')
                ->with(['video' => function($query) {
                    $query->withTrashed()->select('id', 'title', 'color');
                }])
                 ->get();

            $video_crts = [];
            $videos = Video::withTrashed()->get();
            foreach ($videos as $video) {
                $video_crts[$video->title] = [
                    'video_id' =>  $video->id,
                    'name' => $video->title,
                    'color' => $video->color,
                    'value' => 0,
                    'x' =>  $video->title,
                    'y' =>  0,
                ];
            }

            foreach ($total_certificates_statistics as $cert) {
                $video_crts[$cert->video?->title ?? 'Unknown Video'] = [
                    'video_id' =>  $cert->video?->id,
                    'name' => $cert->video?->title ?? 'Unknown Video',
                    'color' => $cert->video?->color,
                    'value' => $cert->certificate_count,
                    'x' =>  $cert->video?->title ?? 'Unknown Video',
                    'y' =>  $cert->certificate_count
                ];
            }

            $certificates_statistics = [];
            foreach ($videos as $video) {
                $certificates_statistics[] = $video_crts[$video->title] ;
            }

            return $this->sendResponse(true, [
                'total_certificates' => $total_certificates,
                'total_users' => $total_users,
                'total_certificates_statistics' => $certificates_statistics,
                'date_range' => [
                    'from' => $date_range[0]?->format('Y-m-d H:i:s'),
                    'to' => $date_range[1]?->format('Y-m-d H:i:s'),
                ]
            ], trans('Listed'), null, 201, $request);
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        // }
    }

    function userGraph(Request $request)
    {
        try {
            $userGraph =  new UserGraph();
            return $this->sendResponse(true, ['graph' => $userGraph] );
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }

    function userInformation(Request $request) {
         $this->resource = UserInformationResource::class;
        $this->resourceExport = UserInformationResource::class;
        $this->model = User::class;

        return $this->indexInit($request, function ($items) use($request) {
            $items = $items->leftJoin('user_videos', 'user_videos.user_id', '=', 'users.id')
            ->leftJoin('videos', 'videos.id', '=', 'user_videos.video_id')
            ->select(
                'users.id',
                'videos.title',
                'user_videos.video_id',
                'user_videos.status',
                'user_videos.created_at',
                'users.lang',
                'users.full_name',
                'users.mobile',
                'users.first_name',
                'users.last_name',
                'users.certificate_count',
                'users.email',
                'users.deleted_at',
            );



        // Apply search filtering if "q" parameter exists
        if ($request->q) {
            $items = $items->where(function ($query) use ($request) {
                // Search in users' full name, email, and mobile
                $query->where('users.full_name', 'LIKE', "%{$request->q}%")
                      ->orWhere('users.email', 'LIKE', "%{$request->q}%")
                      ->orWhere('users.mobile', 'LIKE', "%{$request->q}%")

                      // Search in videos' title
                      ->orWhere('videos.title', 'LIKE', "%{$request->q}%")

                      // Search in status
                      ->orWhere('user_videos.status', 'LIKE', "%{$request->q}%");
            });
        }





            return [$items];
        }, [], auth('admin')->check(), function ($items){
            return [$items];
        }, null, null, false, 'user_videos.created_at');
    }
}
