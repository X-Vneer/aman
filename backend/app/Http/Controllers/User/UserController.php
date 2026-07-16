<?php

namespace App\Http\Controllers\User;

use App\Enums\VideoPaymentStatus;
use App\Http\Controllers\BaseApiController;
use App\Http\Requests\UserInfoUpdateRequest;
use App\Http\Requests\UserSetLangRequest;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;
use App\Models\User;
use App\Models\UserVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class UserController extends BaseApiController
{
    use IndexTrait, ShowTrait, EditTrait, DestroyTrait, ToggleActiveTrait;

    function __construct()
    {
        parent::__construct(User::class, ['certificate_count']);
    }

    function index(Request $request) {
        $userVideosLoad = ['userVideos.video'];

        $sortAllowed = [
            'certificate_count' => fn($q, $dir) => $q->orderBy(
                UserVideo::selectRaw('count(*)')
                    ->whereColumn('user_videos.user_id', 'users.id')
                    ->where('user_videos.status', VideoPaymentStatus::Accepted->value)
                    ->where('user_videos.is_certificate_generated', 1),
                $dir
            ),
        ];

        return $this->indexInit($request, function ($items) use($request){
            // if (auth('user')->check()) {
            //     $items = $items->where('id', '<>', Auth::id());
            // }

            if($request->video_ids){
                $video_ids = $request->video_ids;
                $has_not_video = in_array(0, $video_ids)? true : false;

                $items= $items->where(function ($q) use($video_ids, $has_not_video) {
                    $q = $q->whereHas('userVideos', function ($qq) use($video_ids, $has_not_video) {
                            $statuses = [VideoPaymentStatus::Accepted->value];
                            if($has_not_video){
                                 array_push($statuses, VideoPaymentStatus::Rejected->value);
                            }
                            $qq->whereIn('video_id', $video_ids)->whereIn('status', $statuses);
                            return $qq;
                        });

                    if($has_not_video){
                        $q = $q->orWhereDoesntHave('userVideos');
                    }
                    return $q;
                });
            }

            if($request->langs){
                $items = $items->whereIn('lang', $request->langs);
            }
            if($request->has_form){
                $items = $items->whereHas('info');
            }

            return [$items];
        }, [], auth('admin')->check(), function ($items) use ($userVideosLoad) {
            $loads = $items->load($userVideosLoad);
            $items->data = $loads;
            return [$items];
        }, null, $userVideosLoad, true, 'created_at', $sortAllowed);
    }

    function show($id) {
        return $this->showInit($id, null, auth('admin')->check());
    }


    public function create()
    {
        try {
            return $this->sendResponse(true, [
            ], '', null);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }



    function edit($id) {
        return $this->editInit($id, null, auth('admin')->check());
    }

    public function store(UserStoreRequest $request)
    {
        try {
            $inputs = $request->validated();
            DB::beginTransaction();
            $item = User::create($inputs);
            DB::commit();

            return $this->sendResponse(true, [
                'item' => new  $this->resource($item->refresh()),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function update(UserUpdateRequest $request, $id)
    {
        try {
            $item = $this->model::withTrashed()->find($id);
            $mobile = auth('admin')->check()? trimMobile($request->mobile) : trimMobile($item?->mobile);
            $inputs = $request->validated();
            $inputs['mobile'] = $mobile;

            DB::beginTransaction();
            if($request->info){
                if($item->info){
                    $item->info()->update($request->info);
                }else{
                    $item->info()->create($request->info);
                }
            }
            $item?->update($inputs);
            DB::commit();

            return $this->sendResponse(true, [
                'item' => new  $this->resource($item->refresh()),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    function destroy($id) {
        $item = $this->model::find($id);
        return $this->sendResponse(false, null, trans('youCanNotDeleteYourAccountHavingCertificates'), null, 429, null);

        if($item->userVideos()->count() > 0){
            return $this->sendResponse(false, null, trans('youCanNotDeleteYourAccountHavingCertificates'), null, 429, null);
        }
        $item?->tokens()->delete();
        return $this->destroyInit($id, null, auth('admin')->check());
    }

    function destroyme() {
        $id = Auth::id();
        $item = $this->model::find($id);
        if($item?->userVideos()->count() > 0){
            return $this->sendResponse(false, null, trans('youCanNotDeleteYourAccountHavingCertificates'), null, 429, null);
        }
        return $this->destroyInit(Auth::id(), null, false);
    }

    function toggleActive($id, $state) {
        $item = $this->model::find($id);
        $item?->tokens()->delete();
        return $this->toggleActiveInit($id, $state, null, auth('admin')->check());
    }

    function set_lang(UserSetLangRequest $request){
        Auth()->user()?->update(['lang' => $request->lang]);
        return $this->sendResponse(true, [
            'item' => new $this->resource(Auth()->user()),
        ], trans('Toggled'), null);
    }

    function updateForm(UserInfoUpdateRequest $request) {
        try {
            $item = Auth::user();

            if($item->info){
                $item->info()->update($request->all());
            }else{
                $item->info()->create($request->all());
            }

        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }
}
