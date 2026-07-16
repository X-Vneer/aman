<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\StoryRequest;
use App\Models\Story;
use Illuminate\Http\Request;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;

class StoryController extends BaseApiController
{
    use IndexTrait, ShowTrait, EditTrait, DestroyTrait, ToggleActiveTrait;

    function __construct()
    {
        parent::__construct(Story::class, ['full_name']);
    }

    function index(Request $request)
    {
        return $this->indexInit($request, function ($items) use ($request) {
            if ($request->video_id) {
                $items = $items->where('video_id', $request->video_id);
            }

            if ($request->email) {
                $items = $items->where('email', 'like', '%' . $request->email . '%');
            }

            if ($request->mobile) {
                $items = $items->where('mobile', 'like', '%' . $request->mobile . '%');
            }

            return [$items];
        }, [], auth('admin')->check(), function ($items) {
            $loads = $items->load(['video']);
            $items->data = $loads;
            return [$items];
        });
    }

    function show($id)
    {
        return $this->showInit($id, null, auth('admin')->check());
    }

    public function create()
    {
        try {
            return $this->sendResponse(true, [
                'videos' => \App\Models\Video::select('id', 'title')->get(),
            ], 'Create Data', null);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }

    public function store(StoryRequest $request)
    {
        try {
            $inputs = $request->validated();
            // Add current app locale to the inputs
            $inputs['locale'] = app()->getLocale();
            $inputs['deleted_at'] = now();
            $item = $this->model::create($inputs);
            return $this->sendResponse(true, [
                'item' => new $this->resource($item->refresh()),
            ], trans('Created'), null, 201, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    function edit($id)
    {
        return $this->editInit($id, null, auth('admin')->check());
    }

    public function update(StoryRequest $request, $id)
    {
        try {
            $inputs = $request->validated();
            $item = $this->model::withTrashed()->find($id);
            $item->update($inputs);

            return $this->sendResponse(true, [
                'item' => new $this->resource($item->refresh()),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    function destroy($id)
    {
        return $this->destroyInit($id, null, false);
    }

    function toggleActive($id, $state)
    {
        return $this->toggleActiveInit($id, $state, null, auth('admin')->check());
    }
}
