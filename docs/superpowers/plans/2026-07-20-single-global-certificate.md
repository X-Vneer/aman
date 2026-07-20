# Single Global Certificate for All Programs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace per-program certificate templates with one global, dashboard-uploadable template rendered with the user's name, the program name, the date, and a QR code, saved on the server as a PDF.

**Architecture:** Keep the existing pipeline — Laravel generates the PDF by embedding a PNG rendered by the website's Next.js `node-canvas` route (`/api/certificate/[id]`). Changes: (1) the template becomes a single global `Setting` (`certificate_image`) with a bundled default; (2) Laravel passes the program name + resolved template URL to the canvas; (3) the canvas is rewritten to the new layout (name, program, date, QR) and gains correct Arabic rendering via contextual reshaping + bidi reordering; (4) the dashboard "Certificates" page becomes a single-template uploader.

**Tech Stack:** Laravel (PHP 8), DomPDF, BaconQrCode; Next.js 16 + `node-canvas` 3 + `qrcode`, new deps `arabic-reshaper` + `bidi-js`; dashboard Vite + React 19 + Mantine + TanStack Query.

## Global Constraints

- Brand teal for name + program name: `#1ad0d1` (`--color-primary`). Date/grey: `#3F4142`.
- Certificate font: IBM Plex Sans Arabic (already the site brand font; covers Latin + Arabic). TTFs live in `website/src/assets/fonts/`.
- Template canonical size: 1600×1235 (`website/public/certificate.jpeg`). Layout coordinates are fractions of the image height `H` and width `W`, multiplied by an optional `scale` factor.
- Locale-aware navigation rules still apply in dashboard/website, but no navigation is added here.
- Prettier: no semicolons, double quotes, `printWidth: 110` (website + dashboard).
- Do NOT remove `videos.certificate_url`, `VideoController@updateCertificate`, or `PUT admin/videos/{video}/certificate/image` — leave them unused (no destructive migration).
- QR encodes `{SITE_URL}/en/information-center/{certificate_code}` (unchanged). The certificate number is NOT drawn on the new design.
- Certificate output stays a PDF at `storage/certificates/{cert}.pdf`; email/verification flows unchanged.

**Proven during design (do not re-litigate):** `arabic-reshaper`'s `convertArabic()` + `bidi-js` `getEmbeddingLevels()`/`getReorderedString()` produce correctly joined, RTL-ordered Arabic that `node-canvas` renders. Latin strings pass through untouched. The layout fractions below were visually confirmed against `example-filled-certificate.jpeg`.

---

## Task 0: Branch

- [ ] **Step 1: Create a feature branch off main**

```bash
cd /d/work/aman
git checkout -b feat/global-certificate
```

- [ ] **Step 2: Confirm branch**

Run: `git branch --show-current`
Expected: `feat/global-certificate`

---

## Task 1: Backend — `CertificateService` canvas-URL builder (TDD)

Pure, DB-free URL builder so certificate-image URL construction is testable in isolation and reused by the generator.

**Files:**
- Create: `backend/app/Services/CertificateService.php`
- Test: `backend/tests/Unit/CertificateServiceTest.php`

**Interfaces:**
- Produces: `CertificateService::canvasImageUrl(string $platform, int|string $videoId, array $query): string` — returns `{platform}/api/certificate/{videoId}?{query}`, dropping any query entries that are `null` or `''`.

- [ ] **Step 1: Write the failing test**

Create `backend/tests/Unit/CertificateServiceTest.php`:

```php
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
```

- [ ] **Step 2: Run the test, verify it fails**

Run: `cd backend && vendor/bin/phpunit tests/Unit/CertificateServiceTest.php`
Expected: FAIL — `Class "App\Services\CertificateService" not found`.

- [ ] **Step 3: Implement the service**

Create `backend/app/Services/CertificateService.php`:

```php
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
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `cd backend && vendor/bin/phpunit tests/Unit/CertificateServiceTest.php`
Expected: PASS (2 tests, ~4 assertions).

- [ ] **Step 5: Commit**

```bash
git add backend/app/Services/CertificateService.php backend/tests/Unit/CertificateServiceTest.php
git commit -m "feat(cert): add CertificateService canvas-url builder"
```

---

## Task 2: Backend — global template upload/show endpoints

Wire the single-template `Setting` (`certificate_image`) with an admin GET (preview) + PUT (upload), and ship a backend default image for the preview.

**Files:**
- Create: `backend/app/Http/Requests/CertificateImageUpdateRequest.php`
- Modify: `backend/app/Http/Controllers/Admin/CertificateController.php`
- Modify: `backend/routes/admin.php`
- Create: `backend/public/certificate.jpeg` (copy of `website/public/certificate.jpeg`)

**Interfaces:**
- Produces: `GET admin/certificate/image` → `{ data: { item: <url> } }`; `PUT admin/certificate/image` body `{ image: <relative-or-absolute path ending .png/.jpg/.jpeg> }` → `{ data: { item: <url> } }`. Setting `certificate_image.set_value` holds the **relative** storage path (e.g. `certificate/global/xxx.jpeg`).

- [ ] **Step 1: Create the request**

Create `backend/app/Http/Requests/CertificateImageUpdateRequest.php`:

```php
<?php

namespace App\Http\Requests;

use App\Helpers\CustomFormRequest;

class CertificateImageUpdateRequest extends CustomFormRequest
{
    public function rules()
    {
        return [
            'image' => ['required', 'string', 'min:1', 'max:191', 'regex:/\.(png|jpe?g)$/i'],
        ];
    }

    public function messages()
    {
        return [
            'image.required' => trans('يجب إدخال رابط الشهادة'),
            'image.regex' => trans('يجب أن يكون رابط الشهادة بصيغة PNG أو JPG'),
        ];
    }
}
```

- [ ] **Step 2: Rewrite the controller**

Replace the body of `backend/app/Http/Controllers/Admin/CertificateController.php` with:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\CertificateImageUpdateRequest;
use App\Models\Setting;
use App\Models\Video;

class CertificateController extends BaseApiController
{
    function __construct()
    {
        parent::__construct(Video::class);
    }

    /**
     * Return the current global certificate template URL (or the bundled default).
     */
    function show()
    {
        $setting = settings('certificate_image');
        $url = ($setting && $setting->set_value)
            ? asset('storage/' . $setting->set_value)
            : asset('certificate.jpeg');

        return $this->sendResponse(true, ['item' => $url], trans('Success'), null, 200, request());
    }

    /**
     * Upload / replace the single global certificate template.
     */
    function update(CertificateImageUpdateRequest $request)
    {
        try {
            $path = getRelative($request->image);

            $setting = settings('certificate_image');
            if ($setting) {
                $setting->update(['set_value' => $path]);
            } else {
                $setting = Setting::create([
                    'set_key' => 'certificate_image',
                    'set_value' => $path,
                    'type' => 'varchar',
                    'description' => 'Certificate Image Url',
                ]);
            }

            return $this->sendResponse(true, [
                'item' => asset('storage/' . $setting->set_value),
            ], trans('Updated'), null, 200, $request);
        } catch (\Throwable $th) {
            return $this->sendResponse(false, null, trans('msg.technicalError'), null, 500, $request);
        }
    }
}
```

- [ ] **Step 3: Add the routes**

In `backend/routes/admin.php`, add the import near the other `use App\Http\Controllers\Admin\...` lines:

```php
use App\Http\Controllers\Admin\CertificateController;
```

And add this block (place it after the `// End::Video` block, before `// Start::Rate`):

```php
// Start::Certificate (single global template) ===================================================== //
Route::get('certificate/image', [CertificateController::class, 'show'])->name('admin.certificate.image.show');
Route::put('certificate/image', [CertificateController::class, 'update'])->name('admin.certificate.image.update');
// End::Certificate ===================================================== //
```

- [ ] **Step 4: Add the backend default image**

```bash
cp /d/work/aman/website/public/certificate.jpeg /d/work/aman/backend/public/certificate.jpeg
```

- [ ] **Step 5: Verify routes register**

Run: `cd backend && php artisan route:list --path=certificate/image`
Expected: two rows — `GET|HEAD admin/certificate/image` and `PUT admin/certificate/image`.

- [ ] **Step 6: Verify the setting round-trips (tinker)**

Run:
```bash
cd backend && php artisan tinker --execute="\$s = App\Models\Setting::updateOrCreate(['set_key'=>'certificate_image'], ['set_value'=>'certificate/global/test.jpeg','type'=>'varchar','description'=>'Certificate Image Url']); echo settings('certificate_image')->set_value;"
```
Expected: prints `certificate/global/test.jpeg`. (Then delete it: `php artisan tinker --execute="App\Models\Setting::where('set_key','certificate_image')->delete();"`.)

- [ ] **Step 7: Commit**

```bash
git add backend/app/Http/Requests/CertificateImageUpdateRequest.php backend/app/Http/Controllers/Admin/CertificateController.php backend/routes/admin.php backend/public/certificate.jpeg
git commit -m "feat(cert): global certificate template upload/show endpoints"
```

---

## Task 3: Backend — generate certificate from global template + program name

Point `downloadCertificateAsPdf` at the global template, set the locale to the enrollment language, pass the program name, and simplify the Blade view.

**Files:**
- Modify: `backend/app/Http/Controllers/User/UserVideoController.php` (`downloadCertificateAsPdf`, ~lines 302-354)
- Modify: `backend/resources/views/pdf/sample-with-image.blade.php`

**Interfaces:**
- Consumes: `CertificateService::canvasImageUrl(...)` (Task 1).
- Produces: Blade `pdf.sample-with-image` now receives a single variable `image_url`.

- [ ] **Step 1: Add the import**

In `backend/app/Http/Controllers/User/UserVideoController.php`, add near the other `use` statements:

```php
use App\Services\CertificateService;
```

- [ ] **Step 2: Replace the template + view-build block**

In `downloadCertificateAsPdf`, replace this existing block:

```php
            $certificateUrl = $userVideo->video->certificate_url;
            $certificate_file_name = last(explode('/', $certificateUrl));

            // Load view with optimized memory settings
            // return env("PLATFORM") . "api/certificate/{$userVideo->video_id}?certificate_code={$userVideo->certificate_number}&certificate_no={$userVideo->certificate_number}&name={$userVideo->user->full_name}&date={$userVideo->updated_at}&certificate_file_name={$certificate_file_name}";

            // return view('pdf.sample-with-image', [
            //     'video_id' => $userVideo->video_id,
            //     'certificate_file_name' => $certificate_file_name,
            //     'full_name' => ($userVideo->user->full_name?? 'Aman'),
            //     'certificate_number' => strtolower($userVideo->certificate_number?? ''),
            //     'date' => $userVideo->updated_at,
            // ]);

            $pdf = PDF::setOptions([
                'memory_limit' => '1024M',
                'enable_font_subsetting' => true,
                'pdf_backend' => 'CPDF',
                'enable_php' => true,
                'enable_javascript' => true,
                'enable_remote' => true
            ])->loadView('pdf.sample-with-image', [
                'video_id' => $userVideo->video_id,
                'certificate_file_name' => $certificate_file_name,
                'full_name' => ($userVideo->user->full_name?? 'Aman'),
                'certificate_number' => strtolower($userVideo->certificate_number?? ''),
                'date' => $userVideo->updated_at,
            ]);
```

with:

```php
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
```

- [ ] **Step 3: Simplify the Blade view**

Replace the whole `<div class="image-container">` body in `backend/resources/views/pdf/sample-with-image.blade.php` so the file reads:

```blade

<html>
    <head>
        <style>
            body { margin: 0; }
            .image-container {
                position: relative;
                width: 100%;
            }
            .image-container img {
                width: 100%;
                height: auto;
                max-width: A4;
            }
        </style>
    </head>
    <body>
        <div class="image-container" style="position: relative">
            <img src="{{ $image_url }}" />
        </div>
    </body>
</html>
```

- [ ] **Step 4: Verify the URL builds (tinker, no PDF render)**

Run:
```bash
cd backend && php artisan tinker --execute="echo App\Services\CertificateService::canvasImageUrl(config('app.platform'), 3, ['name'=>'Mohammed Moeen','program_name'=>'Aman Program','date'=>'2026-01-27','certificate_code'=>'CERT3','template_url'=>null]);"
```
Expected: a URL like `.../api/certificate/3?name=Mohammed+Moeen&program_name=Aman+Program&date=2026-01-27&certificate_code=CERT3` (no `template_url`, no `certificate_file_name`, no dependency on `videos.certificate_url`).

- [ ] **Step 5: Confirm the per-video template is no longer referenced in the generator**

Run: `grep -n "certificate_file_name\|video->certificate_url" backend/app/Http/Controllers/User/UserVideoController.php`
Expected: no matches inside `downloadCertificateAsPdf` (the method now uses the global setting only).

- [ ] **Step 6: Commit**

```bash
git add backend/app/Http/Controllers/User/UserVideoController.php backend/resources/views/pdf/sample-with-image.blade.php
git commit -m "feat(cert): generate from global template with program name + enrollment locale"
```

---

## Task 4: Website — deps, fonts, Arabic shaping helper

Add the reshaping deps, bundle the fonts at a runtime-stable path, and add the `shapeText` helper + type declarations.

**Files:**
- Modify: `website/package.json` (via npm install)
- Create: `website/public/fonts/IBMPlexSansArabic-Bold.ttf`, `-SemiBold.ttf`, `-Regular.ttf` (copies)
- Modify: `website/src/app/api/certificate/[id]/utils/index.ts`
- Create: `website/src/types/certificate-shaping.d.ts`

**Interfaces:**
- Produces: `shapeText(input: string): string` — reshapes + RTL-reorders Arabic; returns Latin/other input unchanged; never throws.

- [ ] **Step 1: Install deps**

```bash
cd /d/work/aman/website && npm install arabic-reshaper bidi-js
```

Expected: `package.json` gains `arabic-reshaper` and `bidi-js` under dependencies.

- [ ] **Step 2: Bundle the fonts**

```bash
cd /d/work/aman/website && mkdir -p public/fonts && cp src/assets/fonts/IBMPlexSansArabic-Bold.ttf src/assets/fonts/IBMPlexSansArabic-SemiBold.ttf src/assets/fonts/IBMPlexSansArabic-Regular.ttf public/fonts/
```

Expected: three `.ttf` files under `website/public/fonts/`.

- [ ] **Step 3: Add type declarations**

Create `website/src/types/certificate-shaping.d.ts`:

```ts
declare module "arabic-reshaper" {
  export function convertArabic(input: string): string
  export function convertArabicBack(input: string): string
}

declare module "bidi-js" {
  interface BidiApi {
    getEmbeddingLevels(text: string, baseDirection?: "ltr" | "rtl" | "auto"): unknown
    getReorderedString(text: string, embeddingLevels: unknown): string
  }
  export default function bidiFactory(): BidiApi
}
```

- [ ] **Step 4: Add `shapeText` to the utils file**

Append to `website/src/app/api/certificate/[id]/utils/index.ts`:

```ts
import { convertArabic } from "arabic-reshaper"
import bidiFactory from "bidi-js"

const bidi = bidiFactory()

// Arabic + Arabic Supplement/Extended + Presentation Forms A/B.
const ARABIC_RANGE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/

/**
 * Reshape Arabic to contextual presentation forms and reorder to visual (RTL)
 * order so node-canvas (which does no complex shaping) draws it correctly.
 * Non-Arabic strings pass through untouched. Never throws.
 */
export const shapeText = (input: string): string => {
  if (!input || !ARABIC_RANGE.test(input)) return input
  try {
    const reshaped = convertArabic(input)
    const levels = bidi.getEmbeddingLevels(reshaped, "rtl")
    return bidi.getReorderedString(reshaped, levels)
  } catch {
    return input
  }
}
```

- [ ] **Step 5: Verify the helper (standalone node check)**

Run:
```bash
cd /d/work/aman/website && node -e "const {convertArabic}=require('arabic-reshaper');const bidi=require('bidi-js')();const s='محمد معين';const r=convertArabic(s);const l=bidi.getEmbeddingLevels(r,'rtl');const out=bidi.getReorderedString(r,l);console.log('in ',[...s].map(c=>c.codePointAt(0).toString(16)).join(' '));console.log('out',[...out].map(c=>c.codePointAt(0).toString(16)).join(' '));console.log('latin passthrough:', require('arabic-reshaper').convertArabic('Aman')==='Aman')"
```
Expected: `out` codepoints are in the `fe70`–`fefc` presentation-form range and reversed vs `in`; `latin passthrough: true`.

- [ ] **Step 6: Commit**

```bash
git add website/package.json website/package-lock.json website/public/fonts website/src/types/certificate-shaping.d.ts website/src/app/api/certificate/[id]/utils/index.ts
git commit -m "feat(cert): add arabic reshaping deps, fonts, and shapeText helper"
```

---

## Task 5: Website — rewrite the canvas route (new layout + global template + fonts)

**Files:**
- Modify (full rewrite): `website/src/app/api/certificate/[id]/route.ts`

**Interfaces:**
- Consumes: `shapeText`, `formatDateToDDMMYYYY`, `drawRoundedRectangle`, `searchParamsToObject` from `./utils`; `SITE_URL` from `@/config`.
- Query params: `name` (req), `date` (req), `certificate_code` (req), `program_name` (req), `certificate_no` (opt), `template_url` (opt url), `scale` (opt number).

- [ ] **Step 1: Replace the route file**

Overwrite `website/src/app/api/certificate/[id]/route.ts` with:

```ts
import { NextRequest, NextResponse } from "next/server"

import path from "node:path"
import { createCanvas, loadImage, registerFont } from "canvas"
import QRCode from "qrcode"
import { z } from "zod"

import { drawRoundedRectangle, formatDateToDDMMYYYY, searchParamsToObject, shapeText } from "./utils"
import { SITE_URL } from "@/config"

// Register the brand font (Latin + Arabic) once, from a runtime-stable path.
const fontFile = (name: string) => path.join(process.cwd(), "public", "fonts", name)
try {
  registerFont(fontFile("IBMPlexSansArabic-Bold.ttf"), { family: "IBMPlexSansArabicBold" })
  registerFont(fontFile("IBMPlexSansArabic-SemiBold.ttf"), { family: "IBMPlexSansArabicSemiBold" })
  registerFont(fontFile("IBMPlexSansArabic-Regular.ttf"), { family: "IBMPlexSansArabicRegular" })
} catch {
  // registerFont throws if called after a canvas context is created in the same
  // process; fonts already registered are fine to reuse.
}

const TEAL = "#1ad0d1"
const GREY = "#3F4142"

const searchParamsSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1),
  program_name: z.string().min(1),
  certificate_code: z.string().min(1),
  certificate_no: z.string().optional(),
  template_url: z.string().url().optional(),
  scale: z.coerce.number().optional(),
})

/** Word-wrap `text` to at most `maxLines` lines that each fit `maxWidth`. */
const wrapLines = (
  ctx: ReturnType<ReturnType<typeof createCanvas>["getContext"]>,
  text: string,
  maxWidth: number,
  maxLines = 2,
): string[] => {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  if (lines.length <= maxLines) return lines
  // Collapse overflow into the last allowed line.
  return [...lines.slice(0, maxLines - 1), lines.slice(maxLines - 1).join(" ")]
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { success, error, data } = searchParamsSchema.safeParse(
    searchParamsToObject(request.nextUrl.searchParams),
  )
  if (!success) return NextResponse.json(error, { status: 422 })

  const { name, date, program_name, certificate_code, template_url } = data
  const scale = data.scale ?? 1
  await params // route param (video id) is not used for template selection anymore

  const defaultTemplate = path.join(process.cwd(), "public", "certificate.jpeg")

  try {
    const template = await loadImage(template_url ?? defaultTemplate).catch(() =>
      loadImage(defaultTemplate),
    )

    const W = template.width * scale
    const H = template.height * scale
    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext("2d")

    ctx.drawImage(template, 0, 0, W, H)
    ctx.textAlign = "center"

    // 1) User name — teal, bold.
    ctx.fillStyle = TEAL
    ctx.font = `${70 * scale}px IBMPlexSansArabicBold`
    ctx.fillText(shapeText(name), W / 2, H * 0.4)

    // 2) Program name — teal, semibold, wrapped to <= 2 lines.
    ctx.fillStyle = TEAL
    ctx.font = `${40 * scale}px IBMPlexSansArabicSemiBold`
    const programLines = wrapLines(ctx, shapeText(program_name), W * 0.82, 2)
    const programBaseline = H * 0.505
    const lineHeight = 52 * scale
    // Bottom-anchor the block just above the "Through the Aman…" template line.
    const startY = programBaseline - (programLines.length - 1) * lineHeight
    programLines.forEach((line, i) => ctx.fillText(line, W / 2, startY + i * lineHeight))

    // 3) Date — grey.
    ctx.fillStyle = GREY
    ctx.font = `${40 * scale}px IBMPlexSansArabicRegular`
    ctx.fillText(formatDateToDDMMYYYY(new Date(date)), W / 2, H * 0.61)

    // 4) QR code — centered below the date.
    const qrDataUrl = await QRCode.toDataURL(`${SITE_URL}/en/information-center/${certificate_code}`, {
      margin: 0.5,
      errorCorrectionLevel: "M",
    })
    const qrImage = await loadImage(qrDataUrl)
    const qrSize = W * 0.135
    const qrX = W / 2 - qrSize / 2
    const qrY = H * 0.645
    const radius = 24 * scale

    ctx.save()
    // @ts-ignore — drawRoundedRectangle takes the node-canvas 2d context
    drawRoundedRectangle(ctx, qrX, qrY, qrSize, qrSize, radius)
    ctx.clip()
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)
    ctx.restore()

    const stream = canvas.createPNGStream()
    const readable = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk))
        stream.on("end", () => controller.close())
        stream.on("error", (err) => controller.error(err))
      },
    })

    return new Response(readable, { headers: { "Content-Type": "image/png" } })
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error: " + err }, { status: 500 })
  }
}
```

- [ ] **Step 2: Start the dev server**

Run: `cd /d/work/aman/website && npm run dev`
(leave running; note the port, usually `3000`.)

- [ ] **Step 3: Render an English sample and inspect it**

Run:
```bash
curl -s "http://localhost:3000/api/certificate/1?name=Mohammed%20Moeen&program_name=Aman%20Interactive%20Safety%20%26%20First%20Aid%20Awareness%20Program&date=2026-01-27&certificate_code=CERT1&certificate_no=cert1" -o "$SCRATCH/cert-en.png"
```
(substitute `$SCRATCH` with the scratchpad dir). Open `cert-en.png`.
Expected: name in teal centered under "presented to:"; program in teal under "activity entitled"; date `27/01/2026` under "Through the Aman…"; QR centered below the date. Matches `website/public/example-filled-certificate.jpeg`.

- [ ] **Step 4: Render an Arabic sample and inspect it**

Run:
```bash
curl -s "http://localhost:3000/api/certificate/1?name=%D9%85%D8%AD%D9%85%D8%AF%20%D9%85%D8%B9%D9%8A%D9%86&program_name=%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC%20%D8%A3%D9%85%D8%A7%D9%86%20%D8%A7%D9%84%D8%AA%D9%81%D8%A7%D8%B9%D9%84%D9%8A&date=2026-01-27&certificate_code=CERT1" -o "$SCRATCH/cert-ar.png"
```
Open `cert-ar.png`.
Expected: Arabic name + program render as connected, right-to-left glyphs (not disconnected/backwards). Positions match the English sample.

- [ ] **Step 5: Stop the dev server** (Ctrl-C).

- [ ] **Step 6: Commit**

```bash
git add website/src/app/api/certificate/[id]/route.ts
git commit -m "feat(cert): rewrite canvas route for global template, program name, arabic + QR"
```

---

## Task 6: Dashboard — single global template uploader

Turn the per-program "Certificates" page into one global uploader + preview.

**Files:**
- Modify: `dashboard/src/app/dashboard/certificates/get-certificates.ts`
- Modify: `dashboard/src/app/dashboard/certificates/types.ts`
- Modify: `dashboard/src/app/dashboard/certificates/update-certificate.ts`
- Modify: `dashboard/src/app/dashboard/certificates/page.tsx`
- Modify: `dashboard/src/app/dashboard/certificates/components/upload-modal.tsx`
- Modify: `dashboard/src/content/en.json`, `dashboard/src/content/ar.json` (copy only)

**Interfaces:**
- Consumes: `GET admin/certificate/image` → `{ item: string }`; `PUT admin/certificate/image` body `{ image: string }` (Task 2).

- [ ] **Step 1: Replace the fetcher**

Overwrite `dashboard/src/app/dashboard/certificates/get-certificates.ts`:

```ts
import AmanApi from "@/services/aman"
import { CertificateResponse } from "./types"

export const GetCertificate = async () => {
  const response = await AmanApi.get<CertificateResponse>("/certificate/image")
  return response.data.data
}
```

- [ ] **Step 2: Replace the types**

Overwrite `dashboard/src/app/dashboard/certificates/types.ts`:

```ts
export interface CertificateResponse {
  status: boolean
  message: string
  data: {
    item: string
  }
  errors: null
  response_code: number
}
```

- [ ] **Step 3: Replace the update service**

Overwrite `dashboard/src/app/dashboard/certificates/update-certificate.ts`:

```ts
import AmanApi from "@/services/aman"

export const PutUpdateCertificate = async (data: { image: string }) => {
  const response = await AmanApi.put(`certificate/image`, data)
  return response.data
}
```

- [ ] **Step 4: Replace the page**

Overwrite `dashboard/src/app/dashboard/certificates/page.tsx`:

```tsx
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Image, Stack, Text, Title } from "@mantine/core"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import UploadModal from "./components/upload-modal"
import { GetCertificate } from "./get-certificates"

const Certificates = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()

  const { data, error, isFetching } = useSuspenseQuery({
    queryKey: ["certificate"],
    queryFn: () => GetCertificate(),
  })
  if (error && !isFetching) {
    throw error
  }

  return (
    <Stack>
      <Group justify="space-between" wrap="nowrap">
        <div>
          <Title
            className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
            size={sm ? "h3" : "h2"}
            order={2}>
            {t("certificates.title")}
          </Title>
          <Text size="sm" c={"gary"}>
            {t("certificates.description")}
          </Text>
        </div>
        <UploadModal />
      </Group>

      <Group justify="center" mt="md">
        <Image src={data.item} alt={t("certificates.title")} maw={800} />
      </Group>
    </Stack>
  )
}

export default Certificates
```

- [ ] **Step 5: Replace the upload modal**

Overwrite `dashboard/src/app/dashboard/certificates/components/upload-modal.tsx`:

```tsx
import { UploadFile } from "@/services/utils/upload-file"
import { Alert, Button, Modal } from "@mantine/core"
import "@mantine/dropzone/styles.css"
import { useDisclosure } from "@mantine/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trans, useTranslation } from "react-i18next"

import { Group, Text } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { ImageUp, Upload, X } from "lucide-react"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { useState } from "react"
import { PutUpdateCertificate } from "../update-certificate"
import { notifications } from "@mantine/notifications"
import axios from "axios"

const UploadModal = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()

  const [isOpen, { open, close }] = useDisclosure()
  const [fileToUpload, setFileToUpload] = useState<File[]>([])
  const onCancel = () => {
    setFileToUpload([])
    close()
  }

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const response = await UploadFile({ file, path: "certificate/global" })
      return PutUpdateCertificate({ image: response.relativePath })
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["certificate"] })
      onCancel()
    },
    onError(error) {
      notifications.show({
        radius: "xs",
        color: "white",
        title: axios.isAxiosError(error) ? error.response?.data.message || "" : error.message,
        message: "",
        classNames: {
          title: "!text-white",
          description: "!text-white",
          root: "!bg-red-500",
        },
      })
    },
  })
  const handleUpdateCertificate = () => {
    mutate({ file: fileToUpload[0] })
  }

  return (
    <>
      <Modal centered opened={isOpen} onClose={close} title={t(`certificates.upload-modal.title`)}>
        <div>
          <Dropzone
            loading={isPending}
            multiple={false}
            onDrop={setFileToUpload}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}>
            <Group justify="center" gap="lg" p={"md"} mih={180} style={{ pointerEvents: "none" }}>
              <Dropzone.Accept>
                <Upload size={50} strokeWidth={1} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <X size={50} strokeWidth={1} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <ImageUp size={50} strokeWidth={1} />
              </Dropzone.Idle>

              <div className="text-center">
                <Text ta={"center"}>
                  <Trans
                    i18nKey="certificates.upload-modal.dropzone.title"
                    components={{ span: <span className="font-bold text-primary" /> }}
                  />
                </Text>
                <Text ta={"center"} size="sm" c="dimmed" inline mt={7}>
                  {t("certificates.upload-modal.dropzone.description")}
                </Text>
              </div>
            </Group>
          </Dropzone>
        </div>
        {fileToUpload.length > 0 ? <Alert>{fileToUpload[0].name}</Alert> : null}
        <Group justify="center" mt={"md"}>
          <Button
            onClick={handleUpdateCertificate}
            loading={isPending}
            disabled={fileToUpload.length <= 0}
            miw={"120px"}>
            {t("certificates.upload-modal.save")}
          </Button>
          <Button onClick={onCancel} miw={"120px"} variant="outline">
            {t("certificates.upload-modal.cancel")}
          </Button>
        </Group>
      </Modal>
      <Button size={sm ? "sm" : "md"} onClick={open} color="secondary">
        {t("certificates.download")}
      </Button>
    </>
  )
}

export default UploadModal
```

- [ ] **Step 6: Tidy the copy (optional, keep keys)**

In `dashboard/src/content/en.json` under `certificates`, set `"description": "One certificate template used for every program"`. Mirror an Arabic equivalent in `ar.json` (e.g. `"description": "قالب شهادة واحد لجميع البرامج"`). No key names change.

- [ ] **Step 7: Typecheck**

Run: `cd /d/work/aman/dashboard && npm run typecheck`
Expected: no errors in `src/app/dashboard/certificates/**`.

- [ ] **Step 8: Commit**

```bash
git add dashboard/src/app/dashboard/certificates dashboard/src/content/en.json dashboard/src/content/ar.json
git commit -m "feat(cert): dashboard single global certificate template uploader"
```

---

## Task 7: Cleanup — remove the mockup and dead per-program template assets

**Files:**
- Delete: `website/public/example-filled-certificate.jpeg` (reference mockup — must not ship)
- Delete (if unused): `website/src/assets/certificates/1.png`, `2.png`, `index.ts`
- Stage: the already-deleted `website/public/1.png`, `website/public/2.png`

- [ ] **Step 1: Confirm the old asset index is unused**

Run: `grep -rn "assets/certificates\|firstCertificate\|secondCertificate" website/src`
Expected: no references. If any exist, STOP and leave the files; otherwise continue.

- [ ] **Step 2: Remove mockup + dead assets**

```bash
cd /d/work/aman/website
git rm -f public/example-filled-certificate.jpeg 2>/dev/null || rm -f public/example-filled-certificate.jpeg
git rm -f src/assets/certificates/1.png src/assets/certificates/2.png src/assets/certificates/index.ts 2>/dev/null || true
git rm -f public/1.png public/2.png 2>/dev/null || true
```

- [ ] **Step 3: Verify the default template survives**

Run: `ls website/public/certificate.jpeg backend/public/certificate.jpeg`
Expected: both exist.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(cert): drop reference mockup and dead per-program template assets"
```

---

## Task 8: End-to-end verification

- [ ] **Step 1: Backend unit tests pass**

Run: `cd backend && vendor/bin/phpunit tests/Unit/CertificateServiceTest.php`
Expected: PASS.

- [ ] **Step 2: Dashboard typechecks**

Run: `cd dashboard && npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Website builds (route + fonts resolve)**

Run: `cd website && npm run build`
Expected: build succeeds; `/api/certificate/[id]` compiles.

- [ ] **Step 4: Full-loop visual check (optional but recommended)**

With backend (`php artisan serve`) + website (`npm run dev`) running, and a real completed+rated enrollment, hit `GET guest/user-videos/{certificate_number}/pdf` (or trigger completion) and open the resulting `storage/certificates/{cert}.pdf` — verify it shows name + program + date + QR on the global template. Upload a replacement template from the dashboard Certificates page and regenerate to confirm the new template is picked up.

---

## Self-Review Notes (author)

- **Spec coverage:** global template (Task 2), dashboard upload (Task 6), name/program/date/QR render (Task 5), Arabic (Task 4/5), PDF output preserved (Task 3), default template (Task 2/5), backward-compat kept (no column/route removed). ✓
- **Types consistent:** `canvasImageUrl` signature identical in Tasks 1 & 3; `{ item: string }` response shape identical in Tasks 2 & 6; `shapeText` signature identical in Tasks 4 & 5; query param names identical between backend builder (Task 3) and zod schema (Task 5): `name, date, program_name, certificate_code, certificate_no, template_url, scale`. ✓
- **No placeholders:** every step has concrete code/commands. ✓
- **Known residual risk:** node-canvas font binding differs on Windows dev (falls back to system Sans) vs Linux prod (uses IBM Plex). Arabic shaping is correct in both; only the Latin typeface fidelity depends on the platform. Verified acceptable during design.
```
