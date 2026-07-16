<?php

namespace App\Http\Controllers\User;

use App\Enums\ContactStatus;
use App\Http\Controllers\BaseApiController;
use App\Http\Requests\ContactReplyRequest;
use App\Http\Requests\ContactStoreRequest;
use App\Models\Contact;
use Illuminate\Http\Request;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;
use App\Mail\SendNotificationMail;
use App\Mail\SendReplyMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class ContactController extends BaseApiController {
    use IndexTrait, ShowTrait, EditTrait, DestroyTrait, ToggleActiveTrait;


    function __construct()
    {
        parent::__construct(Contact::class);
    }

    function index(Request $request) {
        return $this->indexInit($request, function ($items) use ($request) {
            if($request->types){
                $items = $items->whereIn('type', $request->types);
            }
            if($request->statuses){
                $items = $items->whereIn('status', $request->statuses);
            }
            return [$items];
        }, [], auth('admin')->check(), function ($items) {
            $loads = $items->load([]);
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
            return $this->sendResponse(true, [

            ], 'Create Data', null);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }

    public function store(ContactStoreRequest $request)
    {
        // try {
            $inputs = $request->validated();
            $item = $this->model::create($inputs);
            return $this->sendResponse(true, [
                'item' => new  $this->resource($item->refresh()),
            ], trans('Created'), null, 201, $request);
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        // }
    }

    function edit($id) {
        return $this->editInit($id, null, auth('admin')->check());
    }

    public function update(ContactStoreRequest $request, $id)
    {
        try {
            $inputs = $request->validated();
            $item = $this->model::find($id);
            $item->update($inputs);
            return $this->sendResponse(true, [
                'item' => new  $this->resource($item->refresh()),
            ], trans('Created'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function reply(ContactReplyRequest $request, $id)
    {
        // try {
            $item = $this->model::find($id);
            DB::beginTransaction();
            $item->update([
                'reply' => $request->reply
            ]);
            Mail::send(new SendReplyMail($item->email, $request->reply));
            DB::commit();


            return $this->sendResponse(true, [
                'item' => new  $this->resource($item->refresh()),
            ], trans('Created'), null, 200, $request);
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        // }
    }

    function destroy($id) {
        return $this->destroyInit($id, null, auth('admin')->check());
    }

    function toggleActive($id, $state) {
        return $this->toggleActiveInit($id, $state, null, auth('admin')->check());
    }

}
