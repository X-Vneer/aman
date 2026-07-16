<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\ScenesController;
use App\Http\Controllers\Admin\TawiaController;
use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\admin\StoryController;
use App\Http\Controllers\User\RateController;
use App\Http\Controllers\User\UserAuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\UserVideoController;
use Illuminate\Support\Facades\Route;

// Start::Logout ================================================================= //
Route::post('logout', [HomeController::class, 'logout'])->name('user.logout');
// End::Logout ================================================================= //

// Start::Files ===================================================== //
Route::post('uploadFile', [FileController::class, 'uploadFile'])->name('user.uploadFile');
Route::Delete('deleteFile', [FileController::class, 'deleteFile'])->name('user.deleteFile');
// Start::Files ===================================================== //

// Start::User ================================================================= //
Route::patch('users/set-lang', [UserController::class, 'set_lang'])->name('user.set-lang');
Route::resource('users', UserController::class)->except(['destroy', 'store', 'create', 'index'])->names('user.users');
Route::put('mobile/update', [UserAuthController::class, 'updateMobile'])->name('user.update-mobile');
Route::put('update-form', [UserController::class, 'updateForm'])->name('user.update-form');
// End::User ===================================================== //

// Start::Video ===================================================== //
Route::resource('videos', VideoController::class)->names('user.videos')->only(['index', 'show']);
// End::Video ===================================================== //

// Start::Video ===================================================== //
Route::resource('rates', RateController::class)->names('user.rates')->only(['index', 'show', 'store']);
// End::Video ===================================================== //

// Start::Scene ===================================================== //
Route::resource('scenes', ScenesController::class)->names('user.scenes')->only(['index', 'show']);
// End::Scene ===================================================== //

// Start::question ===================================================== //
Route::resource('questions', QuestionController::class)->names('user.questions')->only(['index', 'show']);
Route::resource('awareness', TawiaController::class)->names('user.awareness')->only(['index', 'show']);

// End::question ===================================================== //

// Start::UserVideo ===================================================== //
Route::get('user-videos/{id}/lastShow', [UserVideoController::class, 'lastShow'])->name('user.user-videos.lastShow');
Route::resource('user-videos', UserVideoController::class)->names('user.user-videos')->only(['index', 'show', 'store']);
Route::post('user-videos/check-answer', [UserVideoController::class, 'checkQuestionAnswer'])->name('user.check-answer');
Route::get('user-videos/{certificate_number}/pdf', [UserVideoController::class, 'downloadCertificateAsPdf'])->name('user.user-videos.pdf');
// End::UserVideo ===================================================== //

// Start::Story ===================================================== //
Route::resource('stories', StoryController::class)->names('user.stories')->only(['index', 'show']);
// End::Story ===================================================== //

