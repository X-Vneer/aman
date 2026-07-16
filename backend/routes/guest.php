<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\MapController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\User\ContactController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\TawiaController;
use App\Http\Controllers\Admin\StoryController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\User\RateController;
use App\Http\Controllers\User\UserAuthController;
use App\Http\Controllers\User\UserVideoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Start::Admin ===================================================== //
Route::group(['prefix' => 'admin'], function () {
    Route::post('loginRegisterResendOtp', [AdminAuthController::class, 'loginRegisterResendOtp'])->name('admin.sendotp');
    Route::post('request-otp', [AdminAuthController::class, 'requestOtp'])->name('admin.request-otp');
    Route::post('otpVerify', [AdminAuthController::class, 'otpVerify'])->name('admin.otpVerify');
    Route::put('password/update', [AdminAuthController::class, 'updatePassword'])->name('admin.updatePassword');
});
// End::Admin ===================================================== //

// End::User ===================================================== //
Route::group(['prefix' => 'user'], function () {
    Route::post('loginRegisterWithResendOtp', [UserAuthController::class, 'loginRegisterResendOtp'])->name('user.registrationResendOtp');
    Route::post('loginRegisterResendOtp', [UserAuthController::class, 'loginRegister'])->name('user.sendotp');
    Route::post('otpVerify', [UserAuthController::class, 'otpVerify'])->name('user.otpVerify');
});
// End::User ===================================================== //


// Start::Video ===================================================== //
Route::resource('videos', VideoController::class)->names('guest.videos')->only(['index', 'show']);
// End::Video ===================================================== //

// Start::Video ===================================================== //
Route::get('certificates/{search}', [UserVideoController::class, 'findCertificate'])->name('guest.findCertificate');
Route::get('user-videos/pdf/fix', [UserVideoController::class, 'fixCertificatePdf'])->name('guest.user-videos.pdf.fix');
Route::get('user-videos/{certificate_number}/pdf', [UserVideoController::class, 'downloadCertificateAsPdf'])->name('guest.user-videos.pdf');
// End::Video ===================================================== //

 // Start::Faq ===================================================== //
Route::resource('faqs', FaqController::class)->names('guest.faqs')->only(['index', 'show']);
Route::resource('awareness', TawiaController::class)->names('guest.awareness')->only(['index', 'show']);
// End::Faq ===================================================== //

// Start::Files ===================================================== //
Route::post('uploadFile', [FileController::class, 'uploadFile'])->name('guest.uploadFile');
// End::Files ===================================================== //

// Start::Contact ===================================================== //
Route::resource('contacts', ContactController::class)->names('guest.contacts')->only(['store']);
// End::Contact ===================================================== //

// Start::Payment ===================================================== //
Route::post('payments/callback', [PaymentController::class, 'edfaPayCallback'])->name('guest.payment.edfaPayCallback');
Route::post('payments/callback2', [PaymentController::class, 'edfaPayCallback2'])->name('guest.payment.edfaPayCallback2');
Route::get('payments/status', [PaymentController::class, 'checkPaymentStatus'])->name('guest.payment.status');
Route::get('payments/dev-check-status', [PaymentController::class, 'devCheckPaymentStatus'])->name('guest.payment.dev-check-status');
Route::get('payments/dev-check-status/{id}', [PaymentController::class, 'devCheckPaymentStatusById'])->name('guest.payment.dev-check-status-by-id');
Route::get('payments/user-videos/{id}/status', [PaymentController::class, 'paymentStatus'])->name('guest.payment.user-videos.status');
// End::Payment ===================================================== //

// Start::Story ===================================================== //
Route::resource('stories', StoryController::class)->names('guest.stories')->only(['index', 'show', 'store']);
// End::Story ===================================================== //

// Start::Partner ===================================================== //
Route::resource('partners', PartnerController::class)->names('guest.partners')->only(['index', 'show']);
// End::Partner ===================================================== //

// Start::News ===================================================== //
Route::resource('news', NewsController::class)->names('guest.news')->only(['index', 'show']);
// End::News ===================================================== //

// Start::Blogs ===================================================== //
Route::resource('blogs', BlogController::class)->names('guest.blogs')->only(['index', 'show']);
// End::Blogs ===================================================== //

// Start::Rate ===================================================== //
Route::resource('rates', RateController::class)->names('guest.rates')->only(['index', 'show']);
// End::Rate ===================================================== //

// Start::Map (world-atlas ISO ids + certificate stats) ===================================================== //
Route::get('map/country-statistics', [MapController::class, 'countryStatistics'])->name('guest.map.country-statistics');
// End::Map ===================================================== //


Route::prefix('test')->group(function () {
    // Route::post('edfaPayment', [TestController::class, 'edfaPayment'])->name('guest.payment.edfaPayment');
});

Route::get('test', function (Request $request) {
    return $request->all();
});
