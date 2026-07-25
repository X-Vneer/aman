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

    public function test_stored_pdf_is_readable_through_the_same_path_serve_certificate_checks(): void
    {
        Storage::fake('public');

        CertificateService::storePdf('CERT9', '%PDF-1.4 fake');

        // serveCertificate() looks the file up with exactly this relative path.
        $this->assertTrue(Storage::disk('public')->exists('certificates/CERT9.pdf'));
    }
}
