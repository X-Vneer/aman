<?php

namespace App\Http\Controllers;

use App\Enums\NotificationTitle;
use App\Http\Traits\Controller\DestroyTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends BaseApiController
{
    use IndexTrait, ShowTrait, EditTrait, DestroyTrait, ToggleActiveTrait;

    function __construct()
    {
        parent::__construct(Notification::class);

    }

    function indexAdmin(Request $request) {
        return $this->indexInit($request, function ($items) {
            $items = $items->where(function ($q) {
                return $q->whereHas('contact')->orWhereHas('UserVideo');
            });
            return [$items];
        }, [], false, function ($items) use($request) {
            if(!$request->is_not_update_last_read_notification_id){
                $last_item = $items?->sortByDesc('id')->first();
                if($last_item){
                    Auth()->user()->update(['last_read_notification_id'=> $last_item->id]);
                }

            }
            $loads = $items->load([
                'user',
                'Contact',
                'UserVideo.video',
            ]);
            $items->data = $loads;
            return [$items];
        });
    }

    function isNewNotifications() {
        // try {
            $request = new Request([
                'paginationCounter' => 1,
                'is_not_update_last_read_notification_id' => true
            ]);
            $fun = 'index' . ucfirst(Authed()->guard);
            $current_last_notification = $this->$fun($request)->getData(true)['data']['items']['data'][0]?? null;
            $current_last_notification_id = $current_last_notification? $current_last_notification['id'] : null;
            $is_new_notification = false;
            if(Auth::user()->last_read_notification_id != $current_last_notification_id && $current_last_notification_id){
                $is_new_notification = true;
            }
            return $this->sendResponse(true, [
                'is_new_notification' => $is_new_notification
            ], trans('Notification read status'), null);
        // } catch (\Throwable $th) {
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        // }
    }

    function setLastNotificationId(Request $request) {
        Auth::user()->update(['last_read_notification_id' => $request->notification_id]);
        return $this->isNewNotifications();
    }
}
