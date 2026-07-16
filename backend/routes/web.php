<?php

use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\User\UserVideoController;
use Illuminate\Support\Facades\Route;

// Public route to serve/generate certificates stored under storage/app/public/certificates
Route::get('storage/certificates/{pdf}', [UserVideoController::class, 'serveCertificate'])->name('guest.storage.certificate');
Route::get('{local}/user-video/{id}/redirectPayment', [PaymentController::class, 'redirectPayment'])->name('payment.redirectPayment');


Route::get('/', function () {
    return view('welcome');
});

