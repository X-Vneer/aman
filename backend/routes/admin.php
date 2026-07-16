<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminHomeController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\MapController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\PartnerController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ScenesController;
use App\Http\Controllers\Admin\StoryController;
use App\Http\Controllers\Admin\TawiaController;
use App\Http\Controllers\Admin\VideoController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\User\ContactController;
use App\Http\Controllers\User\RateController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\UserVideoController;
use Illuminate\Support\Facades\Route;

// Start::Logout ================================================================= //
Route::post('logout', [HomeController::class, 'logout'])->name('admin.logout');
// End::Logout ================================================================= //

// Start::Files ===================================================== //
Route::post('uploadFile', [FileController::class, 'uploadFile'])->name('admin.uploadFile');
Route::Delete('deleteFile', [FileController::class, 'deleteFile'])->name('admin.deleteFile');
// Start::Files ===================================================== //

// Start::AdminHome ===================================================== //
Route::get('home/statistics', [AdminHomeController::class, 'statistics'])->name('admin.home.statistics');
Route::get('home/user-graph', [AdminHomeController::class, 'userGraph'])->name('admin.home.user-graph');
Route::get('home/user-information', [AdminHomeController::class, 'userInformation'])->name('admin.home.user-information');
// End::AdminHome ===================================================== //

// Start::Map (world-atlas ISO ids + certificate stats) ===================================================== //
Route::get('map/country-statistics', [MapController::class, 'countryStatistics'])->name('admin.map.country-statistics');
// End::Map ===================================================== //

// Start::Report ===================================================== //
Route::get('report/general-graph', [ReportController::class, 'generalGraph'])->name('admin.report.general-graph');
Route::get('report/certificate-graph', [ReportController::class, 'certificateGraph'])->name('admin.report.certificate-graph');
Route::get('report/user-graph', [ReportController::class, 'userGraph'])->name('admin.report.user-graph');
// End::Report ===================================================== //

// Start::Admin ===================================================== //
Route::resource('admins', AdminController::class)->names('admin.admins');
Route::put('admins/{admin}/toggleActive/{state}', [AdminController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.admins.toggleActive');
// End::Admin ===================================================== //

// Start::User ===================================================== //
Route::resource('users', UserController::class)->names('admin.users');
Route::put('users/{user}/toggleActive/{state}', [UserController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.users.toggleActive');
// End::User ===================================================== //

// Start::Video ===================================================== //
Route::get('videos/colors', [VideoController::class, 'colors'])->name('admin.videos.color');
Route::resource('videos', VideoController::class)->names('admin.videos');
Route::put('videos/{video}/toggleActive/{state}', [VideoController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.videos.toggleActive');
Route::put('videos/{video}/toggleIsNew/{state}', [VideoController::class, 'toggleIsNew'])
    ->where(['video' => '[0-9]+', 'state' => 'true|false'])->name('admin.videos.toggleIsNew');
Route::put('videos/{video}/status', [VideoController::class, 'updateStatus'])
    ->where(['video' => '[0-9]+'])->name('admin.videos.updateStatus');
Route::put('videos/{video}/certificate/image', [VideoController::class, 'updateCertificate'])
    ->where(['id' => '[0-9]+'])->name('admin.videos.certificate.image');
// End::Video ===================================================== //

// Start::Rate ===================================================== //
Route::resource('rates', RateController::class)->names('admin.rates')->only(['index', 'show', 'create', 'edit', 'update', 'destroy']);
Route::put('rates/{rate}/toggleActive/{state}', [RateController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.rates.toggleActive');
// End::Rate ===================================================== //

// Start::Scene ===================================================== //
Route::resource('scenes', ScenesController::class)->names('admin.scenes');
// End::Scene ===================================================== //

// Start::question ===================================================== //
Route::resource('questions', QuestionController::class)->names('admin.questions');
// End::question ===================================================== //

// Start::UserVideo ===================================================== //
Route::put('user-videos/update-certificate-user-name', [UserVideoController::class, 'updateCertificateUserName'])
    ->name('admin.user-videos.update-certificate-user-name');
Route::post('user-videos/{certificate_number}/regenerate-certificate', [UserVideoController::class, 'regenerateCertificate'])
    ->where(['certificate_number' => '[A-Za-z0-9_-]+'])
    ->name('admin.user-videos.regenerate-certificate');
Route::post('user-videos/{user_video}/revoke-certificate', [UserVideoController::class, 'revokeCertificate'])
    ->where(['user_video' => '[0-9]+'])
    ->name('admin.user-videos.revoke-certificate');
Route::post('user-videos/reset-all', [UserVideoController::class, 'resetAll'])
    ->name('admin.user-videos.reset-all');
Route::post('user-videos/reset-by-video/{video_id}', [UserVideoController::class, 'resetByVideo'])
    ->where(['video_id' => '[0-9]+'])
    ->name('admin.user-videos.reset-by-video');
Route::post('user-videos/{user_video}/reset', [UserVideoController::class, 'resetUserVideo'])
    ->where(['user_video' => '[0-9]+'])
    ->name('admin.user-videos.reset');
Route::resource('user-videos', UserVideoController::class)->names('admin.user-videos')->only(['index', 'show']);
Route::put('user-videos/{user_video}/toggleActive/{state}', [UserVideoController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.user-videos.toggleActive');
// End::UserVideo ===================================================== //

// Start::Faq ===================================================== //
Route::resource('faqs', FaqController::class)->names('admin.faqs');
Route::put('faqs/{faq}/toggleActive/{state}', [FaqController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.faqs.toggleActive');
// End::Faq ===================================================== //

// Start::Contact ===================================================== //
Route::resource('contacts', ContactController::class)->names('admin.contacts');
Route::put('contacts/{contact}/toggleActive/{state}', [ContactController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.contacts.toggleActive');
Route::post('contacts/{contact}/reply', [ContactController::class, 'reply'])
    ->where(['id' => '[0-9]+'])->name('admin.contacts.reply');
// End::Contact ===================================================== //

// Start::Story ===================================================== //
Route::resource('stories', StoryController::class)->names('admin.stories');
Route::put('stories/{story}/toggleActive/{state}', [StoryController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.stories.toggleActive');
// End::Story ===================================================== //

// Start::Notification ================================================================= //
Route::get('notifications', [NotificationController::class, 'indexAdmin']);
Route::get('is-new-notifications', [NotificationController::class, 'isNewNotifications']);
Route::post('set-last-notification-id', [NotificationController::class, 'setLastNotificationId']);
// End::Notification ================================================================= //

// Start::Tawia ===================================================== //
Route::resource('awareness', TawiaController::class)->names('admin.tawias');
Route::put('awareness/{awareness}/toggleActive/{state}', [TawiaController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.tawias.toggleActive');
// End::Tawia ===================================================== //

// Start::Partner ===================================================== //
Route::resource('partners', PartnerController::class)->names('admin.partners');
Route::put('partners/{partner}/toggleActive/{state}', [PartnerController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.partners.toggleActive');
// End::Partner ===================================================== //

// Start::News ===================================================== //
Route::resource('news', NewsController::class)->names('admin.news');
Route::put('news/{news}/toggleActive/{state}', [NewsController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.news.toggleActive');
// End::News ===================================================== //

// Start::Blogs ===================================================== //
Route::resource('blogs', BlogController::class)->names('admin.blogs');
Route::put('blogs/{blog}/toggleActive/{state}', [BlogController::class, 'toggleActive'])
    ->where(['id' => '[0-9]+', 'state' => 'true|false'])->name('admin.blogs.toggleActive');
// End::Blogs ===================================================== //
