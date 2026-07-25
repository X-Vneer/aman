<?php

namespace Tests\Feature;

use App\Services\CertificateService;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CertificateStorageTest extends TestCase
{
    /**
     * A fresh deploy only runs `storage:link`; `storage/app/public/certificates`
     * does not exist until something creates it. Writing the PDF must create it.
     */
    public function test_stores_pdf_when_certificates_folder_does_not_exist(): void
    {
        Storage::fake('public');
        $root = Storage::disk('public')->path('');

        $this->assertDirectoryDoesNotExist($root.'/certificates');

        $stored = CertificateService::storePdf('CERT8', '%PDF-1.4 fake');

        $this->assertTrue($stored);
        $this->assertDirectoryExists($root.'/certificates');
        Storage::disk('public')->assertExists('certificates/CERT8.pdf');
        $this->assertSame('%PDF-1.4 fake', Storage::disk('public')->get('certificates/CERT8.pdf'));
    }

    public function test_platform_url_is_normalised_to_a_single_trailing_slash(): void
    {
        config(['app.platform' => 'https://aman.test']);
        $this->assertSame('https://aman.test/', CertificateService::platformUrl());

        config(['app.platform' => 'https://aman.test///']);
        $this->assertSame('https://aman.test/', CertificateService::platformUrl());
    }

    public function test_canvas_base_url_prefers_platform_cert_and_falls_back_to_platform(): void
    {
        config(['app.platform' => 'https://aman.test/', 'app.platform_cert' => 'http://127.0.0.1:3000']);
        $this->assertSame('http://127.0.0.1:3000/', CertificateService::canvasBaseUrl());
        // Links stay on the public host even when the fetch goes to the local origin.
        $this->assertSame('https://aman.test/', CertificateService::platformUrl());

        config(['app.platform_cert' => '']);
        $this->assertSame('https://aman.test/', CertificateService::canvasBaseUrl());
    }

    public function test_platform_url_rejects_an_unset_or_empty_platform(): void
    {
        config(['app.platform' => '']);

        $this->expectException(\RuntimeException::class);
        CertificateService::platformUrl();
    }

    public function test_stored_pdf_is_readable_through_the_same_path_serve_certificate_checks(): void
    {
        Storage::fake('public');

        CertificateService::storePdf('CERT9', '%PDF-1.4 fake');

        // serveCertificate() looks the file up with exactly this relative path.
        $this->assertTrue(Storage::disk('public')->exists('certificates/CERT9.pdf'));
    }
}
