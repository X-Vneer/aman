<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VideoStatus;
use App\Http\Controllers\BaseApiController;
use App\Http\Requests\ShowVideoRequest;
use App\Http\Requests\UpdateVideoStatusRequest;
use App\Http\Requests\VideoStoreRequest;
use App\Http\Resources\VideoEditResource;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VideoController extends BaseApiController
{
    use DestroyTrait, EditTrait, IndexTrait, ShowTrait, ToggleActiveTrait;

    public function __construct()
    {
        parent::__construct(Video::class);
    }

    public function index(Request $request)
    {
        return $this->indexInit(
            $request,
            function ($items, $request) {
                if (! auth('admin')->check()) {
                    switch ($request->query('program_list_scope')) {
                        case 'new_programs':
                            $items = $items->where('status', VideoStatus::Pending->value);
                            break;
                        case 'new_cases':
                            $items = $items->where('status', VideoStatus::Approved->value);
                            break;
                        case 'most_viewed':
                            $items = $items->reorder()->orderBy('view_complete_counter', 'desc');
                            break;
                    }
                }

                return [$items];
            },
            [
                'program_list_scope' => 'nullable|in:all,new_programs,new_cases,most_viewed',
            ],
            auth('admin')->check(),
            function ($items) {
                $loads = $items->load(['scenes', 'questions']);
                $items->data = $loads;

                return [$items];
            },
            [
                'introduction' => [
                    'title' => trans('webIntroduction'),
                    'description' => trans('webDescription'),
                ],
            ],
        );
    }

    public function show(ShowVideoRequest $request, mixed $video)
    {
        $raw = $request->route('video') ?? $video;
        $id = Video::resolveIdFromRouteParameter($raw);
        if ($id === null) {
            return $this->sendResponse(false, [], trans('This Item is Inactive'), null, 404);
        }

        return $this->showInit($id, function ($item) use ($request) {
            return [$item];
        }, auth('admin')->check());
    }

    public function create()
    {
        try {
            return $this->sendResponse(true, [

            ], 'Create Data', null);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }

    public function colors(Request $request)
    {
        try {
            $items = Video::all();
            $ids = $items->pluck('color', 'id');
            app()->setLocale('en');
            $en = $items->pluck('color', 'title');
            app()->setLocale('ar');
            $ar = $items->pluck('color', 'title');

            return $this->sendResponse(true, [
                'items' => [
                    'id' => $ids,
                    'en' => $en,
                    'ar' => $ar,
                ],
            ], 'Colors', null);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }

    public function store(VideoStoreRequest $request)
    {
        try {
            $inputs = $request->validated();
            $item = $this->model::create($inputs);

            return $this->sendResponse(true, [
                'item' => new $this->resource($item->refresh()),
            ], trans('messages.t1'), null, 201, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function edit($id)
    {
        $this->resource = VideoEditResource::class;

        return $this->editInit($id, null, auth('admin')->check());
    }

    public function update(VideoStoreRequest $request, $id)
    {
        try {
            $inputs = $request->validated();
            $item = $this->model::withTrashed()->find($id);
            $item->update($inputs);

            return $this->sendResponse(true, [
                'item' => new $this->resource($item->refresh()),
            ], trans('Created'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, __('messages.technicalError'), null, 500, $request);
        }
    }

    public function destroy($id)
    {
        $video = Video::where('id', $id)->first();

        if ($video && $video->scenes()->count() > 0) {
            return $this->sendResponse(false, null, __('msg.can-not-delete-video-having-scenes'), null, 429, null);
        }
        if ($video && $video->questions()->count() > 0) {
            return $this->sendResponse(false, null, __('msg.can-not-delete-video-having-questions'), null, 429, null);
        }
        if ($video && $video->userVideos()->count() > 0) {
            return $this->sendResponse(false, null, __('msg.can-not-delete-video-having-certificates'), null, 429, null);
        }

        return $this->destroyInit($id, null, auth('admin')->check());
    }

    public function toggleActive($id, $state)
    {
        $video = Video::where('id', $id)->first();

        // if($video && $video->scenes()->count() > 0){
        //     return $this->sendResponse(false, null, __('msg.can-not-delete-video-having-scenes'), null, 429, null);
        // }
        // if($video && $video->questions()->count() > 0){
        //     return $this->sendResponse(false, null, __('msg.can-not-delete-video-having-questions'), null, 429, null);
        // }
        // if($video && $video->userVideos()->count() > 0){
        //     return $this->sendResponse(false, null, __('msg.can-not-delete-video-having-certificates'), null, 429, null);
        // }
        return $this->toggleActiveInit($id, $state, null, auth('admin')->check());
    }

    /**
     * Set `is_new` for a video, including soft-deleted rows (`withTrashed`).
     */
    public function toggleIsNew(Request $request, $id, $state)
    {
        try {
            $validator = Validator::make(
                ['state' => $state],
                ['state' => 'required|in:true,false'],
            );
            $check = $this->checkValidator($validator);
            if ($check) {
                return $check;
            }

            $video = Video::withTrashed()->whereKey($id)->first();
            if (! $video) {
                return $this->sendResponse(false, null, trans('Not Found'), null, 404, $request);
            }
            $video->update(['is_new' => $state === 'true' ? 1 : 0]);

            return $this->sendResponse(true, [
                'item' => new $this->resource($video->refresh()),
            ], trans('Toggled'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    /**
     * Set public program status (`New` / `Updated`) or clear it (`null`). Includes soft-deleted rows.
     */
    public function updateStatus(UpdateVideoStatusRequest $request, $id)
    {
        try {
            $video = Video::withTrashed()->whereKey($id)->first();
            if (! $video) {
                return $this->sendResponse(false, null, trans('Not Found'), null, 404, $request);
            }

            $status = $request->validated('status');
            $video->update(['status' => $status]);

            return $this->sendResponse(true, [
                'item' => new $this->resource($video->refresh()),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }
}
