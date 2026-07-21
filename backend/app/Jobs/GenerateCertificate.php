<?php

namespace App\Jobs;

use App\Helpers\CustomLogger;
use App\Http\Controllers\User\UserVideoController;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Generates the certificate PDF by calling the same logic as the guest/user PDF route,
 * in-process. Avoids Http::get() to the public API (fixes DNS/cURL timeout when the server
 * cannot resolve the public API host from itself).
 *
 * يولّد ملف PDF للشهادة داخل نفس عملية PHP دون طلب HTTP خارجي لتجنّب أخطاء DNS/cURL 28.
 */
class GenerateCertificate
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public function __construct(
        protected int|string $videoId,
        public ?string $email,
        public ?string $name,
        public ?string $video_title,
        public ?string $cert_number,
    ) {}

    public function handle(): void
    {
        CustomLogger::logInfo('000.log', 'ok', [$this->email, $this->name, $this->video_title, $this->cert_number]);

        if ($this->cert_number === null || $this->cert_number === '') {
            return;
        }

        try {
            app(UserVideoController::class)->downloadCertificateAsPdf($this->cert_number);
        } catch (\Throwable $e) {
            CustomLogger::logInfo('GenerateCertificate', 'Error', [
                'message' => $e->getMessage(),
                'cert' => $this->cert_number,
            ]);
        }
    }
}
