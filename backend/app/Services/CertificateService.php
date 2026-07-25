<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class CertificateService
{
    /**
     * The website base URL, guaranteed absolute and with exactly one trailing slash.
     *
     * `PLATFORM=` (present but blank) in .env resolves to '' — env() only falls back to its
     * default when the key is *absent*. A blank platform silently produced relative URLs:
     * a certificate image dompdf could not fetch (blank PDF) and QR codes pointing nowhere.
     *
     * @throws \RuntimeException when PLATFORM is unusable.
     */
    public static function platformUrl(): string
    {
        return self::assertAbsoluteUrl((string) config('app.platform')) . '/';
    }

    /**
     * Base URL the backend itself fetches the certificate canvas from.
     *
     * Defaults to the public PLATFORM, but PLATFORM_CERT can point at the website's local
     * origin (e.g. http://127.0.0.1:3000/) on hosts that cannot resolve their own public
     * hostname. QR codes and email links always use platformUrl(), never this.
     *
     * @throws \RuntimeException when neither value is a usable absolute URL.
     */
    public static function canvasBaseUrl(): string
    {
        $internal = trim((string) config('app.platform_cert'));

        return $internal === '' ? self::platformUrl() : self::assertAbsoluteUrl($internal) . '/';
    }

    /**
     * Build the website canvas URL that renders the certificate image
     * (global template + name + program name + date + QR).
     *
     * @param  string  $platform  Website base URL (config('app.platform')), may have a trailing slash.
     * @param  array<string,string|null>  $query
     *
     * @throws \RuntimeException when $platform is not an absolute http(s) URL.
     */
    public static function canvasImageUrl(string $platform, int|string $videoId, array $query): string
    {
        $filtered = array_filter(
            $query,
            static fn ($v) => $v !== null && $v !== ''
        );

        return self::assertAbsoluteUrl($platform) . '/api/certificate/' . $videoId . '?' . http_build_query($filtered);
    }

    /** Trim to a slash-free absolute http(s) base, or fail loudly naming the env var to fix. */
    private static function assertAbsoluteUrl(string $platform): string
    {
        $platform = rtrim(trim($platform), '/');

        if ($platform === '' || ! preg_match('#^https?://#i', $platform)) {
            throw new \RuntimeException(
                'PLATFORM must be an absolute http(s) URL to the website; got ' .
                ($platform === '' ? 'an empty value' : "[$platform]") . '.'
            );
        }

        return $platform;
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
