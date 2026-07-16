<?php

namespace App\Http\Controllers\User;

use App\Models\UserAnswer;
use Illuminate\Http\Request;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;

class UserAnswerController extends BaseApiController{
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

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|min:5|max:50',
                'email' => 'required|min:5|max:60|unique:admins,email',
                'password' => 'required|min:6|max:8',
            ]);

            $check = $this->checkValidator($validator);
            if ($check) return $check;


            $item = Admin::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
            ]);

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

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make([...$request->all(), $this->primaryKey => $id], [
                $this->primaryKey => 'required|exists:' . $this->table . ',' . $this->primaryKey,
                'name' => 'required|min:5|max:60|unique:admins,name,' . $id . ',' . $this->primaryKey,
                'email' => 'required|min:5|max:60|unique:admins,email,' . $id . ',' . $this->primaryKey,
            ]);

            $check = $this->checkValidator($validator);
            if ($check) return $check;

            $item = Admin::findOrFail($id);
            $item?->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            return $this->sendResponse(true, [
                'item' => new  AdminResource($item->refresh()),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    function destroy($id) {
        $item = $this->model::find($id);
        $item?->tokens()->delete();
        return $this->destroyInit($id, null, auth('admin')->check());
    }

    function toggleActive($id, $state) {
        $item = $this->model::find($id);
        $item?->tokens()->delete();
        return $this->toggleActiveInit($id, $state, null, auth('admin')->check());
    }

}
