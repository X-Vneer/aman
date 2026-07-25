<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class CertificateService
{
    /**
     * Build the website canvas URL that renders the certificate image
     * (global template + name + program name + date + QR).
     *
     * @param  string  $platform  Website base URL (config('app.platform')), may have a trailing slash.
     * @param  array<string,string|null>  $query
     */
    public static function canvasImageUrl(string $platform, int|string $videoId, array $query): string
    {
        $filtered = array_filter(
            $query,
            static fn ($v) => $v !== null && $v !== ''
        );

        return rtrim($platform, '/') . '/api/certificate/' . $videoId . '?' . http_build_query($filtered);
    }

    /**
     * Persist the rendered certificate PDF on the `public` disk and confirm it landed.
     *
     * Goes through Storage (not file_put_contents on public_path) because a fresh deploy
     * only runs `storage:link` — `storage/app/public/certificates` does not exist yet, and
     * file_put_contents will not create it. The disk is configured with `throw => false`,
     * so the write is verified rather than trusted.
     */
    public static function storePdf(int|string $certificateNumber, string $contents): bool
    {
        $path = self::pdfPath($certificateNumber);

        Storage::disk('public')->put($path, $contents);

        return Storage::disk('public')->exists($path);
    }

    /** Relative path on the `public` disk, shared by generation and serving. */
    public static function pdfPath(int|string $certificateNumber): string
    {
        return 'certificates/' . $certificateNumber . '.pdf';
    }
}
