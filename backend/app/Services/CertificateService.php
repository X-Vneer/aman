<?php

namespace App\Services;

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
}
