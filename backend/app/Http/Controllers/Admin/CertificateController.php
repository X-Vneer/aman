<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\CertificateImageUpdateRequest;
use App\Models\Setting;
use App\Models\Video;

class CertificateController extends BaseApiController
{
    function __construct()
    {
        parent::__construct(Video::class);
    }

    /**
     * Return the current global certificate template URL (or the bundled default).
     */
    function show()
    {
        $setting = settings('certificate_image');
        $url = ($setting && $setting->set_value)
            ? asset('storage/' . $setting->set_value)
            : asset('certificate.jpeg');

        return $this->sendResponse(true, ['item' => $url], trans('Success'), null, 200, request());
    }

    /**
     * Upload / replace the single global certificate template.
     */
    function update(CertificateImageUpdateRequest $request)
    {
        try {
            $path = getRelative($request->image);

            $setting = settings('certificate_image');
            if ($setting) {
                $setting->update(['set_value' => $path]);
            } else {
                $setting = Setting::create([
                    'set_key' => 'certificate_image',
                    'set_value' => $path,
                    'type' => 'varchar',
                    'description' => 'Certificate Image Url',
                ]);
            }

            return $this->sendResponse(true, [
                'item' => asset('storage/' . $setting->set_value),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }
}
