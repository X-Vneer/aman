<?php

use App\Http\Controllers\BaseApiController;
use App\Http\Middleware\API\AdminMiddleware;
use App\Http\Middleware\API\ApiLocalization;
use App\Http\Middleware\API\UserMiddleware;
use App\Http\Middleware\RequestRateMiddleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware([ApiLocalization::class, 'web', RequestRateMiddleware::class])
                ->group(base_path('routes/web.php'));

            Route::middleware([ApiLocalization::class, RequestRateMiddleware::class])
                ->prefix('guest')
                ->group(base_path('routes/guest.php'));

            Route::middleware([ApiLocalization::class, 'auth:sanctum', AdminMiddleware::class, RequestRateMiddleware::class])
                ->prefix('admin')
                ->group(base_path('routes/admin.php'));

            Route::middleware([ApiLocalization::class, 'auth:sanctum', UserMiddleware::class, RequestRateMiddleware::class])
                ->prefix('user')
                ->group(base_path('routes/user.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
        $middleware->validateCsrfTokens(except: [
            '*',
            // Add other routes you want to exclude here
        ]);
        $middleware->web(append: [
            \Laravel\Telescope\Http\Middleware\Authorize::class,
        ]);
        $middleware->appendToGroup('telescope-auth', [
            \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'telescope/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // UnAuth Error Handler
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->expectsJson()) {
                $baseApiController = new BaseApiController();
                return $baseApiController->sendResponse(false, [

                ], "Unauthorized", [], 401);
            }
        });

        // Not Found Exception Error Handler
        $exceptions->render(function (NotFoundHttpException  $e, Request $request) {
            if ($request->expectsJson()) {
                $baseApiController = new BaseApiController();
                return $baseApiController->sendResponse(false, [

                ], "EndPoint Is Not Found", [], 404);
            }
        });
    })->create();
