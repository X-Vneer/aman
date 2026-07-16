<?php

namespace App\Http\Middleware\API;

use App\Http\Controllers\BaseApiController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiLocalization extends BaseApiController
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $localeHeader = $request->header('Accept-Language');

        if ($localeHeader) {
            $locale = explode(',', $localeHeader)[0];
            $locale = strtolower(explode('-', $locale)[0]);
        } else {
            $locale = config('app.locale');
        }

        if (!in_array($locale, config('app.supported_languages'))) {
            $locale = config('app.locale');
        }

        app()->setLocale($locale);

        if (auth()->check()) {
            auth()->user()->update(['lang' => $locale]);
        }

        $response = $next($request);

        $response->headers->set('Content-Language', $locale);

        return $response;
    }
}
