<?php

namespace Tests\Unit;

use App\Services\CertificateService;
use PHPUnit\Framework\TestCase;

class CertificateServiceTest extends TestCase
{
    public function test_builds_url_with_program_name_and_template(): void
    {
        $url = CertificateService::canvasImageUrl('https://site.test/', 7, [
            'name' => 'محمد معين',
            'date' => '2026-01-27 10:00:00',
            'certificate_no' => 'cert1',
            'certificate_code' => 'CERT1',
            'program_name' => 'برنامج أمان',
            'template_url' => 'https://api.test/storage/certificate/global/x.jpeg',
        ]);

        $this->assertStringStartsWith('https://site.test/api/certificate/7?', $url);
        $this->assertStringContainsString('program_name=' . urlencode('برنامج أمان'), $url);
        $this->assertStringContainsString('template_url=' . urlencode('https://api.test/storage/certificate/global/x.jpeg'), $url);
        $this->assertStringContainsString('name=' . urlencode('محمد معين'), $url);
        $this->assertStringContainsString('certificate_code=CERT1', $url);
    }

    /**
     * An empty PLATFORM in .env yields '' (env() only falls back when the key is absent),
     * which used to build the relative path "/api/certificate/…". dompdf cannot fetch that,
     * so the certificate rendered as a blank page instead of failing.
     */
    public function test_rejects_a_platform_that_is_not_an_absolute_url(): void
    {
        foreach (['', '   ', '/api', 'aman.test', 'ftp://aman.test'] as $platform) {
            try {
                CertificateService::canvasImageUrl($platform, 7, ['name' => 'A']);
                $this->fail("Expected a rejection for platform [$platform]");
            } catch (\RuntimeException $e) {
                $this->assertStringContainsString('PLATFORM', $e->getMessage());
            }
        }
    }

    public function test_omits_null_or_empty_query_values(): void
    {
        $url = CertificateService::canvasImageUrl('https://site.test/', 7, [
            'name' => 'A',
            'template_url' => null,
            'program_name' => '',
        ]);

        $this->assertStringNotContainsString('template_url', $url);
        $this->assertStringNotContainsString('program_name', $url);
        $this->assertStringContainsString('name=A', $url);
    }
}
