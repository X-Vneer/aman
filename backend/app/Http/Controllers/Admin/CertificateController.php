<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\CertificateUpdateRequest;
use App\Models\Setting;
use App\Models\Video;

class CertificateController extends BaseApiController {


    function __construct()
    {
        parent::__construct(Video::class);
    }

    function update(CertificateUpdateRequest $request) {
         try {
            $certificate = settings('certificate_image');
            if($certificate){
                $certificate->update(['set_value' => $request->image]);
            }else{
                $certificate = Setting::create([
                    'set_key' => 'certificate_image',
                    'set_value' => $request->image,
                    'type' => 'varchar',
                    'description' => 'Certificate Image Url',
                ]);
            }
            return $this->sendResponse(true, [
                'item' => asset('storage/' . $certificate->set_value),
            ], trans('Created'), null, 201, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

}
