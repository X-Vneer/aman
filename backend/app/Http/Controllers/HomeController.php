<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController;
use Illuminate\Support\Facades\Auth;

class HomeController extends BaseApiController
{

    function homeStatistics() {


    }

    public function logout()
    {
        try {
            Auth::user()->tokens()->where('id', Auth::user()->currentAccessToken()->id)->delete();
            return $this->sendResponse(true, [], "Logout Success, Bye :)");
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500);
        }
    }
}
