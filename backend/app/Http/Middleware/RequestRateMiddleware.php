<?php

namespace App\Http\Middleware;

use App\Http\Controllers\BaseApiController;
use App\Models\RequestRate;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class RequestRateMiddleware extends BaseApiController
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        RequestRate::create([
            'method' =>  $request->method(),
            'url' =>  $request?->url(),
            'rate' => 1,
            'ip'=> $request->ip(),
            'referrer'=> $request->headers->get('referer'),
            'body' =>  json_encode($request?->all(), JSON_UNESCAPED_UNICODE),
            'header' =>  json_encode($request?->headers?->all(), JSON_UNESCAPED_UNICODE),
        ]);
        return  $next($request);
    }
}
