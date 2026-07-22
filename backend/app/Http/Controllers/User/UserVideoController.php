<?php

namespace App\Http\Controllers\User;

use App\Enums\VideoPaymentStatus;
use App\Helpers\CustomLogger;
use App\Http\Controllers\BaseApiController;
use App\Http\Requests\CheckAnswerRequest;
use App\Http\Requests\UpdateCertificateUserName;
use App\Http\Requests\UserVideoStoreRequest;
use App\Http\Resources\UserVideoResource;
use App\Models\UserVideo;
use Illuminate\Http\Request;
use App\Http\Traits\Controller\IndexTrait;
use App\Http\Traits\Controller\EditTrait;
use App\Http\Traits\Controller\ShowTrait;
use App\Http\Traits\Controller\ToggleActiveTrait;
use App\Jobs\GenerateCertificate;
use App\Mail\SendCertMail;
use App\Models\Question;
use App\Models\User;
use App\Models\UserAnswer;
use App\Models\Video;
use App\Services\CertificateService;
use BaconQrCode\Renderer\Image\ImagickImageBackEnd;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Facades\Mail;

class UserVideoController extends BaseApiController {
    use IndexTrait, ShowTrait, EditTrait, ToggleActiveTrait;


    function __construct()
    {
        parent::__construct(UserVideo::class);
    }

    function index(Request $request) {
        return $this->indexInit($request, function ($items) {
            if(auth('user')->check()){
                $items = $items->where('user_id', Auth::id());
            }
            return [$items];
        }, [], auth('admin')->check(), function ($items) {
            $loads = $items->load(['video.questions', 'video.scenes', 'user']);
            $items->data = $loads;
            return [$items];
        }, null);
    }

    function show($id, Request $request) {
        if(auth('user')->check()){
            // Find the user's existing enrollment for this video, preferring an active
            // (not-yet-generated) one, else the latest. This previously used registered()
            // (status=Accepted AND is_certificate_generated=0), so once the certificate was
            // generated the finished row became invisible here and EVERY course open created a
            // fresh progress=0 enrollment — throwing users who had already finished back to the
            // start of the course and derailing the claim flow.
            $userVideo = UserVideo::where('user_id', auth('user')->id())
                ->where('video_id', $id)
                ->where('status', VideoPaymentStatus::Accepted->value)
                ->orderByRaw('CASE WHEN is_certificate_generated = 0 THEN 0 ELSE 1 END')
                ->latest()->first();

            // Auto-enroll only when the user has NO enrollment at all for this video: opening a
            // course for the first time silently creates a free Accepted enrollment.
            if(!$userVideo){
                $video = Video::find($id);
                if($video){
                    $userVideo = UserVideo::create($this->enrollmentInputs($video, $request));
                }
            }

            $id = $userVideo?->id?? 0;

            if($userVideo && ! $userVideo->is_certificate_generated && $userVideo->isApplicableForCertificate()) {
                dispatch(new GenerateCertificate(
                    $userVideo->id,
                    $userVideo->user?->email,
                    $userVideo->user?->full_name,
                    $userVideo->video?->title,
                    $userVideo->certificate_number,
                ))->afterResponse();
            }

        }



        return $this->showInit($id, null, auth('admin')->check());
    }

    function lastShow($id) {
        if(auth('user')->check()){
            // Resolve on the 'user' guard explicitly. Auth::id() reads the default ('sanctum')
            // guard, which is not guaranteed to hold the user id here; when it was null the
            // lookup matched nothing, $id fell back to 0, and showInit() returned 403 — which the
            // website certificate layout turned into a 404. Return the user's latest enrollment for
            // this video (a completed one wins), so a completed course renders the certificate and an
            // incomplete one flows through the frontend's "no qr → back to course" redirect instead of 404.
            $userVideo = UserVideo::where('user_id', auth('user')->id())
                ->where('video_id', $id)
                ->orderByRaw('CASE WHEN progress >= 99 THEN 0 ELSE 1 END')
                ->latest()->first();

            $id = $userVideo?->id?? 0;
        }
        return $this->showInit($id, null, auth('admin')->check());
    }


    /**
     * Shared free-enrollment input defaults used by store() and show() auto-enroll.
     * Every enrollment is free and instantly Accepted.
     */
    private function enrollmentInputs(Video $video, Request $request): array
    {
        return [
            'user_id'             => Auth::id(),
            'video_id'            => $video->id,
            'answer_average'      => 0,
            'hearts'              => 5,
            'total_questions'     => $video->questions->count(),
            'correct_answers'     => 0,
            'progress'            => 0,
            'lang'                => $request->header('Accept-Language'),
            'current_time'        => '00:00:00',
            'last_question_id'    => null,
            'certificate_url'     => null,
            'certificate_qr_code' => null,
            'certificate_number'  => null,
            'status'              => VideoPaymentStatus::Accepted->value,
        ];
    }

    public function store(UserVideoStoreRequest $request)
    {
        $video = Video::find($request->video_id);

        $item = UserVideo::withTrashed()
            ->where(['video_id' => $request->video_id, 'user_id' => Auth::id()])
            ->registered()->latest()
            ->first();

        $inputs = $this->enrollmentInputs($video, $request);

        if ($item) {
            $item->update($inputs);
        } else {
            $item = $this->model::create($inputs);
        }

        $item = $item->refresh();

        return $this->sendResponse(true, [
            'redirect_url' => config('app.platform').app()->getLocale().'/payment/'.$item->video_id.'?success=1',
            'item'         => new $this->resource($item),
        ], trans('Created'), null, 201, $request);
    }


    function toggleActive($id, $state) {
        return $this->toggleActiveInit($id, $state, null, auth('admin')->check());
    }

    function checkQuestionAnswer(CheckAnswerRequest $request) {
        // try {
            $question = Question::find($request->question_id);
            $user_video = UserVideo::where(['user_id'=>Auth::id(), 'video_id'=>$request->video_id])->registered()->latest()
                    ->first();
            $answers = UserAnswer::where(['user_id'=>Auth::id(), 'user_video_id'=>$user_video->id])->get();


            $is_correct = $question->correct_answer == $request->answer;
            DB::beginTransaction();

            UserAnswer::create([
                'user_video_id' => $user_video->id,
                'user_id' => Auth::id(),
                'video_id' => $request->video_id,
                'question_id' => $request->question_id,
                'status' => $is_correct,
                'answer_time' => $request->answer_time,
                'user_answer' => $request->answer,
            ]);

            $hearts = $user_video->hearts;
            if($user_video->hearts>=0 && $user_video->hearts < 5 && $is_correct){
                $hearts += 1;
            }

            if($user_video->hearts>0 && $user_video->hearts <= 5 && !$is_correct){
                $hearts -= 1;
            }



            $correct_answers = $answers->where('status', 1)->count();
            $correct_answers = $is_correct? ($correct_answers+1) : $correct_answers;
            $progress = $answers->count();
            $progress +=1;

            $answer_times = $answers->pluck('answer_time')->toArray();
            $answer_times[] = $request->answer_time;
            $answer_average = calculateAverageTime($answer_times);
            $progress = (int) ($progress / $user_video->questions->count() * 100);
            $user_video->update([
                'answer_average' => $answer_average,
                'hearts' => $hearts,
                'correct_answers' => $correct_answers,
                'progress' => $progress,
                'current_time' =>  $progress > 99 ? "00:00:00" :$question->appears_at,
                'last_question_id' => $progress > 99 ? null : $question->id,
            ]);

            if ($progress >= 99) {
                $user_video->update([
                    'certificate_url' => $user_video->certificate_url,
                    'certificate_qr_code' => config("app.aman_api") . 'storage/qr/ic.png',
                    'certificate_number' => 'CERT' . base_convert($user_video->id * 2, 10, 36),
                ]);
                $user_video->refresh();
                if($user_video->isApplicableForCertificate()){
                    dispatch(new GenerateCertificate(
                        $user_video->id,
                        $user_video->user?->email,
                        $user_video->user?->full_name,
                        $user_video->video?->title,
                        $user_video->certificate_number,
                    ))->afterResponse();
                }
            }
            DB::commit();
            return $this->sendResponse(true, [
                'video' => new UserVideoResource($user_video->refresh()),
                'is_correct' => $is_correct,
            ], trans('Created'), null, 201, $request);
        // } catch (\Throwable $th) {
        //     CustomLogger::logInfo('checkQuestionAnswer.log', 'Error', ['th' => $th->getMessage(), 'request' => $request->all()]);
        //     return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        // }
    }

    function findCertificate(Request $request, $search) {
        try {
            $user_videos = UserVideo::whereNotNull('certificate_number')
                ->where(function ($q) use($search) {
                    return $q->likeStart('certificate_number', $search);
                })
                ->where(function ($q) {
                    $q->where('is_certificate_generated', 1)
                      ->orWhere(function ($q) {
                          $q->isApplicableForCertificate();
                      });
                })
                ->orderByDesc('id')
                ->limit(10)->get();

            return $this->sendResponse(true, [
                'items' => UserVideoResource::collection($user_videos),
            ], trans('Created'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    /**
     * Admin: delete stored PDF/QR for a certificate number, then run the same generation as the guest PDF endpoint.
     */
    public function regenerateCertificate(Request $request, string $certificate_number)
    {
        try {
            $userVideo = UserVideo::query()
                ->where('certificate_number', $certificate_number)
                ->first();

            if (! $userVideo) {
                return $this->sendResponse(false, null, trans('msg.notFound'), null, 404, $request);
            }

            Storage::disk('public')->delete('certificates/'.$certificate_number.'.pdf');
            Storage::disk('public')->delete('qr/'.$certificate_number.'.png');

            $result = $this->downloadCertificateAsPdf($certificate_number);

            $ok = $result === 'generated Success' || $result === 'the certificate already generated';

            if ($ok) {
                $userVideo->refresh();

                return $this->sendResponse(true, [
                    'item' => new UserVideoResource($userVideo->load(['user', 'video'])),
                ], trans('Updated'), null, 200, $request);
            }

            return $this->sendResponse(false, ['message' => $result], is_string($result) ? $result : trans('msg.technicalError'), null, 422, $request);
        } catch (\Throwable $th) {
            CustomLogger::logInfo('regenerateCertificate', 'Error', ['th' => $th->getMessage(), 'certificate_number' => $certificate_number]);

            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    public function downloadCertificateAsPdf($certificate_number)
    {
        // try {
            // Set memory limit for this specific operation
            ini_set('memory_limit', '1024M');
            $userVideo = UserVideo::where('certificate_number', $certificate_number)->first();

            if(!$userVideo || !$userVideo?->user?->full_name)return "User Video is not found for certificate number: $certificate_number";
            if(!$userVideo?->user?->full_name) return "User name is null";

            if($userVideo?->progress < 99) return "User Video is not completed for certificate number: $certificate_number";
            if($userVideo?->is_rated == 0) return "User Video is not rated for certificate number: $certificate_number";

            $certificateFileName = "$certificate_number.pdf";
            $certificateFilePath = "certificates/$certificateFileName";

            if (Storage::disk('public')->exists($certificateFilePath)) {
                $userVideo->update([
                    'is_certificate_generated' => 1,
                    'certificate_url' => url('storage/certificates/' . $certificate_number . '.pdf'),
                    'certificate_qr_code' => url('storage/qr/' . $certificate_number . '.png'),
                ]);
                return 'the certificate already generated';
            }

            // Single global template (falls back to the website's bundled default when unset).
            $templateSetting = settings('certificate_image');
            $templateUrl = ($templateSetting && $templateSetting->set_value)
                ? asset('storage/' . $templateSetting->set_value)
                : null;

            // Render the program title in the language the user took the program in.
            app()->setLocale($userVideo->lang ?: app()->getLocale());

            $imageUrl = CertificateService::canvasImageUrl(config('app.platform'), $userVideo->video_id, [
                'name' => $userVideo->user->full_name ?? 'Aman',
                'date' => (string) $userVideo->updated_at,
                'certificate_no' => strtolower($userVideo->certificate_number ?? ''),
                'certificate_code' => $userVideo->certificate_number ?? '',
                'program_name' => $userVideo->video?->title ?? '',
                'template_url' => $templateUrl,
            ]);

            $pdf = PDF::setOptions([
                'memory_limit' => '1024M',
                'enable_font_subsetting' => true,
                'pdf_backend' => 'CPDF',
                'enable_php' => true,
                'enable_javascript' => true,
                'enable_remote' => true
            ])->loadView('pdf.sample-with-image', [
                'image_url' => $imageUrl,
            ]);

            $pdf->setPaper([0, 0, 4400, 3450]);

            // Generate QR code with memory optimization
            $renderer = new ImageRenderer(
                new RendererStyle(350),
                new ImagickImageBackEnd()
            );

            $writer = new Writer($renderer);

            // Generate QR code and immediately save to storage to free memory
            $qrCode = $writer->writeString(config("app.platform") . "ar/information-center/$certificate_number");
            Storage::disk('public')->put("qr/$certificate_number.png", $qrCode);
            unset($qrCode); // Free QR code from memory

            // Update database before heavy PDF operations
            $userVideo->update([
                'certificate_url' => url('storage/certificates/' . $certificate_number . '.pdf'),
                'certificate_qr_code' => url('storage/qr/' . $certificate_number . '.png'),
                'is_certificate_generated' => 1,
            ]);

            // Generate and save PDF with memory optimization
            $pdfOutput = $pdf->output();
            file_put_contents(public_path('storage/certificates/' . $certificate_number . '.pdf'), $pdfOutput);
            unset($pdfOutput); // Free PDF from memory
            unset($pdf); // Free PDF object

            // Send email in background to avoid memory usage in main thread
            dispatch(function() use ($userVideo) {
                try {
                    $userVideo->update(['is_certificate_generated' => 1]);
                    $userVideo->user->update(['certificate_count' => ((int)$userVideo->user->userVideos->where('is_certificate_generated', 1)->count())]);
                    Mail::send(new SendCertMail(
                        $userVideo->video_id,
                        $userVideo->user?->email,
                        $userVideo->user?->full_name,
                        $userVideo->video?->title,
                        $userVideo->certificate_number
                    ));
                } catch (\Throwable $th) {
                    CustomLogger::logInfo('UserVideoResource->SendCertMail', 'Error', ['th'=> $th->getMessage()]);
                }
            })->afterResponse();

            // Clear any remaining garbage collection
            gc_collect_cycles();

            return "generated Success";

        // } catch (\Throwable $th) {
        //     CustomLogger::logInfo('downloadCertificateAsPdf', 'Error', [
        //         'message' => $th->getMessage(),
        //         'certificate_number' => $certificate_number
        //     ]);
        //     return "Error generating certificate: " . $th->getMessage();
        // }
    }

    function    fixCertificatePdf() {
        try {
            $userVideo = UserVideo::whereNotNull('certificate_url')->orderBy('id', 'desc')->get();
            foreach($userVideo as $item) {
                $this->downloadCertificateAsPdf($item->certificate_number);
            }
            return "Fixed Success";
        } catch (\Throwable $th) {
            return "Error fixing certificate: " . $th->getMessage();
        }
    }

    /**
     * Serve a certificate PDF if exists, otherwise initiate generation and show processing view.
     * URL: /storage/certificates/{pdf}
     */
    public function serveCertificate($pdf)
    {
        try {
            $certificate_number = preg_replace('/\.pdf$/i', '', $pdf);
            $relativePath = 'certificates/'.$pdf;

            $userVideo = UserVideo::with(['user'])
                ->where('certificate_number', $certificate_number)
                ->first();

            if (! $userVideo) {
                return $this->certificateNotFoundHtmlResponse([
                    'pdf' => $pdf,
                    'certificate_number' => $certificate_number,
                    'unknown_certificate' => true,
                ]);
            }

            if (Storage::disk('public')->exists($relativePath)) {
                return response()->file(Storage::disk('public')->path($relativePath), [
                    'Content-Type' => 'application/pdf',
                ]);
            }

            $progressPhases = $userVideo->certificateProgressPhases();

            return $this->certificateNotFoundHtmlResponse([
                'pdf' => $pdf,
                'certificate_number' => $certificate_number,
                'progress_phases' => $progressPhases,
                'full_name' => $userVideo->user?->full_name,
            ]);
        } catch (\Throwable $th) {
            CustomLogger::logInfo('serveCertificate', 'Error', ['th' => $th->getMessage(), 'pdf' => $pdf]);

            return $this->certificateProcessingFallbackResponse();
        }
    }

    /**
     * Plain PHP view (no Blade compile) so PHP-FPM can render without writing to storage/framework/views.
     */
    private function certificateNotFoundHtmlResponse(array $data): \Illuminate\Http\Response
    {
        $html = view()->file(resource_path('views/certificate/notfound-display.php'), $data)->render();

        return response($html, 404)->header('Content-Type', 'text/html; charset=UTF-8');
    }

    /**
     * Minimal HTML when certificate routes error; avoids Blade compile on restricted storage.
     */
    private function certificateProcessingFallbackResponse(): \Illuminate\Http\Response
    {
        $title = e(__('certificate.processing_title'));
        $msg = e(__('certificate.processing_message'));

        $html = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'
            .$title.'</title></head><body style="font-family:Arial,Helvetica,sans-serif;text-align:center;padding:2rem">'
            .'<h1 style="font-size:1.1rem">'.$title.'</h1><p style="color:#4a5568">'.$msg.'</p></body></html>';

        return response($html, 500)->header('Content-Type', 'text/html; charset=UTF-8');
    }

    function updateCertificateUserName(UpdateCertificateUserName $request) {
        try {
            // find user video by user_video_id
            $userVideo = UserVideo::withTrashed()->find($request->user_video_id);

            // update user name
            $userVideo->user?->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
            ]);
            $userVideo->user->save();

            //remove old certificate pdf file
            Storage::disk('public')->delete('certificates/' . $userVideo->certificate_number . '.pdf');

            // update certificate pdf
            dispatch(function() use ($userVideo) {
                try {
                    // Use the controller class to avoid binding $this into the job closure
                    app(\App\Http\Controllers\User\UserVideoController::class)->downloadCertificateAsPdf($userVideo->certificate_number);
                } catch (\Throwable $th) {
                    CustomLogger::logInfo('serveCertificate.dispatch', 'Error', ['th' => $th->getMessage(), 'certificate' => $userVideo->certificate_number]);
                }
            })->afterResponse();

            return $this->sendResponse(true, null, trans('Updated'), null, 200, $request);
        }catch(\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }

    /**
     * Admin: clear certificate issuance when the record is inconsistent (generated but prerequisites incomplete).
     *
     * @param  int|string  $user_video  Route parameter `user_videos/{user_video}` (ID only; never pass a Model into find()).
     */
    public function revokeCertificate(Request $request, $user_video)
    {
        if (! auth('admin')->check()) {
            return $this->sendResponse(false, null, trans('msg.notFound'), null, 403, $request);
        }

        $userVideo = UserVideo::find($user_video);
        if (! $userVideo) {
            return $this->sendResponse(false, null, trans('msg.notFound'), null, 404, $request);
        }

        $userVideo->loadMissing(['user', 'video']);

        if ((int) $userVideo->is_certificate_generated != 1) {
            return $this->sendResponse(false, null, trans('certificate.revoke_not_generated') . ' -1', null, 422, $request);
        }

        if ($userVideo->allCertificatePhasesCompleted()) {
            return $this->sendResponse(false, null, trans('certificate.revoke_pipeline_complete') . ' -2', null, 422, $request);
        }

        $certificateNumber = $userVideo->certificate_number;

        try {
            DB::beginTransaction();
            if ($certificateNumber) {
                Storage::disk('public')->delete('certificates/'.$certificateNumber.'.pdf');
                Storage::disk('public')->delete('qr/'.$certificateNumber.'.png');
            }
            $userVideo->update([
                'is_certificate_generated' => 0,
            ]);
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            CustomLogger::logInfo('revokeCertificate', 'Error', ['th' => $th->getMessage(), 'user_video_id' => $userVideo->id]);

            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }

        return $this->sendResponse(true, [
            'item' => new UserVideoResource($userVideo->refresh()->load(['user', 'video'])),
        ], trans('Updated'), null, 200, $request);
    }

    /**
     * Admin: reset a single UserVideo whose certificate_number is null.
     * Deletes its UserAnswers and resets answer progress.
     */
    public function resetUserVideo(Request $request, $user_video)
    {
        if (! auth('admin')->check()) {
            return $this->sendResponse(false, null, trans('msg.notFound'), null, 403, $request);
        }

        $userVideo = UserVideo::find($user_video);
        if (! $userVideo) {
            return $this->sendResponse(false, null, trans('msg.notFound'), null, 404, $request);
        }

        if ($userVideo->certificate_number !== null) {
            return $this->sendResponse(false, null, trans('certificate.revoke_pipeline_complete'), null, 422, $request);
        }

        $video = Video::withTrashed()->find($userVideo->video_id);
        if (! $video) {
            return $this->sendResponse(false, null, trans('msg.notFound'), null, 404, $request);
        }

        try {
            DB::beginTransaction();
            UserAnswer::where('user_video_id', $userVideo->id)->delete();
            $userVideo->update([
                'answer_average' => '00:00:00',
                'hearts' => 5,
                'total_questions' => $video->questions->count(),
                'correct_answers' => 0,
                'progress' => 0,
                'current_time' => '00:00:00',
                'last_question_id' => null,
            ]);
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            CustomLogger::logInfo('resetUserVideo', 'Error', ['th' => $th->getMessage(), 'user_video_id' => $user_video]);
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }

        return $this->sendResponse(true, [
            'item' => new UserVideoResource($userVideo->refresh()),
        ], trans('Updated'), null, 200, $request);
    }

}
