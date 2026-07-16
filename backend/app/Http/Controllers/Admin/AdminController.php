<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\AdminStoreRequest;
use App\Http\Resources\AdminResource;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;
use App\Models\Admin;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class AdminController extends BaseApiController
{
    use IndexTrait, ShowTrait, EditTrait, DestroyTrait, ToggleActiveTrait;


    function __construct()
    {
        parent::__construct(Admin::class);
    }

    function index(Request $request) {
        return $this->indexInit($request);
    }

    function show($id) {
        return $this->showInit($id, null, auth('admin')->check());
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

    public function store(AdminStoreRequest $request)
    {
        try {
            $item = Admin::create($request->validated());
            if($request->permissions){
                $permission_ids = Permission::whereIn('name', $request->permissions)->pluck('id')->toArray();
                $item->permissions()->sync($permission_ids);
            }

            return $this->sendResponse(true, [
                'item' => new  AdminResource($item->refresh()),
            ], trans('Created'), null, 201, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    function edit($id) {
        return $this->editInit($id, null, auth('admin')->check());
    }

    public function update(AdminStoreRequest $request, $id)
    {
        try {


            $item = Admin::findOrFail($id);
            $item?->update($request->validated());

            $permission_ids = Permission::whereIn('name', $request->permissions?? [])->pluck('id')->toArray();
            $item->permissions()->sync($permission_ids);


            return $this->sendResponse(true, [
                'item' => new  AdminResource($item->refresh()),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    function destroy($id) {
        if($id == 1 ) {
            return $this->sendResponse(false,[], 'Can not delete first admin account', null, 422, null);
        }

        $item = $this->model::find($id);
        $item?->tokens()->delete();
        return $this->destroyInit($id, null, auth('admin')->check());
    }

    function toggleActive($id, $state) {
        if($id == 1 ) {
            return $this->sendResponse(false,[], 'Can not delete first admin account', null, 422, null);
        }

        $item = $this->model::find($id);
        $item?->tokens()->delete();
        return $this->toggleActiveInit($id, $state, null, auth('admin')->check());
    }
}
