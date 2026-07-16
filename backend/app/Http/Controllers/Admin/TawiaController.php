<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\TawiaRequest;
use App\Http\Resources\TawiaEditResource;
use App\Models\Tawia;
use Illuminate\Http\Request;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;

class TawiaController extends BaseApiController {
    use IndexTrait, ShowTrait, EditTrait, DestroyTrait, ToggleActiveTrait;

    function __construct()
    {
        parent::__construct(Tawia::class);
    }

    function index(Request $request) {
        return $this->indexInit($request, function ($items) use ($request) {
            if ($request->video_id) {
                $items = $items->where('video_id', $request->video_id);
            }
            return [$items];
        }, [], auth('admin')->check(), function ($items) {
            $loads = $items->load(['video']);
            $items->data = $loads;
            return [$items];
        }, null);
    }

    function show($id) {
        return $this->showInit($id, null, auth('admin')->check());
    }

    public function create()
    {
        try {
            return $this->sendResponse(true, [], 'Create Data', null);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }

    public function store(TawiaRequest $request)
    {
        // try {
            $inputs = $request->validated();
            $item = $this->model::create($inputs);
            return $this->sendResponse(true, [
                'item' => $item->refresh(),
            ], trans('Created'), null, 201, $request);
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        // }
    }

    function edit($id) {
        $this->resource = TawiaEditResource::class;
        return $this->editInit($id, null, auth('admin')->check());
    }

    public function update(TawiaRequest $request, $id)
    {
        try {
            $inputs = $request->validated();
            $item = $this->model::find($id);
            $item->update($inputs);
            return $this->sendResponse(true, [
                'item' => $item->refresh(),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    function destroy($id) {
        return $this->destroyInit($id, null, auth('admin')->check());
    }

    function toggleActive($id, $state) {
        return $this->toggleActiveInit($id, $state, null, auth('admin')->check());
    }
}
