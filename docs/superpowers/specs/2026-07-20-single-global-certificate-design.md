# Single Global Certificate for All Programs — Design

**Date:** 2026-07-20
**Status:** Approved (design), pending implementation plan
**Author:** Claude Code + Moneer

## 1. Context & Problem

Certificates today are **per-program**. Each `Video` (program) carries its own template image in
`videos.certificate_url`, uploaded from the dashboard "Certificates" page via a program selector.

The generation pipeline:

1. On program completion (`progress >= 99` and rated) — or when re-opening an applicable enrollment —
   `UserVideoController@show` / `checkQuestionAnswer` dispatch `GenerateCertificate`
   (`afterResponse`).
2. The job calls `UserVideoController@downloadCertificateAsPdf($certificate_number)`.
3. That method reads `$userVideo->video->certificate_url`, then renders the Blade view
   `resources/views/pdf/sample-with-image.blade.php`, which embeds a single `<img>` pointing at the
   **website** route `{PLATFORM}api/certificate/{video_id}?name=&date=&certificate_no=&certificate_code=&certificate_file_name=`.
4. DomPDF (with `enable_remote`) fetches that URL. The Next.js route
   `website/src/app/api/certificate/[id]/route.ts` draws **name + date + certificate number + QR**
   onto the per-video template with `node-canvas`, returns a PNG.
5. Laravel wraps the PNG in a PDF, saves `storage/certificates/{cert}.pdf`, also writes a separate
   `storage/qr/{cert}.png` (via BaconQrCode) used by the verification card, emails the PDF.

**Requested change:** one certificate template for **all** programs, uploadable from the dashboard,
generated with **user name, date, program name, QR code**, and saved on the server.

The new template (`website/public/certificate.jpeg`, 1600×1235) differs from the old ones
(`1.png` / `2.png`, now deleted): it **adds the program name** (teal) and **drops** the visible
"Date:" / "Certificate no:" labels. `example-filled-certificate.jpeg` is the target layout mockup.

## 2. Goals / Non-Goals

**Goals**
- One global certificate template used by every program.
- Upload/replace that template from the dashboard.
- Rendered fields: user name, program name, date, QR code — matching `example-filled-certificate.jpeg`.
- Correct Arabic rendering (RTL) for Arabic user names and Arabic program titles.
- Output stays a PDF saved on the server (existing download / email / verification flows keep working).

**Non-Goals**
- No change to the completion → generation trigger logic, the verification page, email, or the
  `information-center` flow.
- No removal of the `videos.certificate_url` column or the old per-video upload route (kept, unused —
  no destructive migration).
- No move of rendering out of the Next.js canvas (confirmed: keep the current engine).

## 3. Decisions (locked)

| Decision | Choice |
|---|---|
| Render engine | Keep the Next.js `node-canvas` route (minimal change). |
| Arabic | Must render correctly — add contextual reshaping + bidi. |
| Output format | Keep PDF (`storage/certificates/{cert}.pdf`). |
| Template storage | Global `Setting` key `certificate_image`; bundled `certificate.jpeg` as default. |
| Brand color (name/program) | `--color-primary` = `#1ad0d1` (teal). |
| Font | IBM Plex Sans Arabic (already the site brand font; covers Latin + Arabic). |

## 4. Architecture

### 4.1 Template storage & resolution

- **Authoritative store:** `Setting` row `set_key = 'certificate_image'`, `set_value = <relative storage path>`.
  Read via the existing `settings('certificate_image')` helper.
- **Default:** the committed website asset `website/public/certificate.jpeg`. When the setting is
  empty, the canvas loads this bundled file from disk. This guarantees certificates render before any
  admin upload.
- **Resolution rule (backend):** `downloadCertificateAsPdf` computes
  `$templateUrl = settings('certificate_image') ? asset('storage/'.$path) : null` and passes it to the
  canvas as `template_url`. Null/absent ⇒ canvas uses its bundled default.

### 4.2 Backend changes (Laravel)

**`app/Http/Controllers/User/UserVideoController.php` → `downloadCertificateAsPdf`**
- Remove the per-video template lookup (`$userVideo->video->certificate_url` /
  `$certificate_file_name`).
- Resolve the global `template_url` from the setting (§4.1).
- Before reading the program title, set the app locale to the enrollment's stored language:
  `app()->setLocale($userVideo->lang ?: app()->getLocale())` — so the certificate shows the title in
  the language the user took the program in (works for both the post-completion `afterResponse`
  dispatch and admin regeneration).
- Pass to the Blade view: `full_name`, `certificate_number`, `date`, **`program_name`**
  (`$userVideo->video?->title`), **`template_url`**. Drop `video_id` (path kept for route param) and
  `certificate_file_name`.
- Everything else (QR PNG write, DB update, PDF save, email dispatch, guards) unchanged.

**`resources/views/pdf/sample-with-image.blade.php`**
- Rebuild the `<img>` query string with the new param set:
  `name`, `date`, `certificate_no`, `certificate_code`, `program_name`, `template_url` (all
  `urlencode`d). Keep the `{video_id}` path segment (route shape unchanged) but it is no longer used
  for template selection.

**`app/Http/Controllers/Admin/CertificateController.php`**
- `update()`: already writes the `certificate_image` setting from `$request->image`. Align the request
  field name with the dashboard payload and return the resolved asset URL. Keep the create-or-update
  branch.
- Add `show()`: returns the current global template URL (or the default) so the dashboard can preview it.

**`app/Http/Requests/CertificateUpdateRequest.php`** (or a new dedicated request)
- The existing request is tied to the per-video route (`exists:videos,id`, `.png` only). Introduce a
  **separate** request for the global endpoint that validates the uploaded `image` path and allows
  `jpg|jpeg|png`. Do not repurpose the per-video request (leave the old route intact).

**`routes/admin.php`**
- Add:
  - `GET  admin/certificate/image` → `CertificateController@show`
  - `PUT  admin/certificate/image` → `CertificateController@update`
- Leave `PUT admin/videos/{video}/certificate/image` in place (unused).

### 4.3 Canvas changes (website)

**`website/src/app/api/certificate/[id]/route.ts`** — layout rewrite + Arabic + global template.

- **Fonts:** `registerFont` for IBM Plex Sans Arabic **Bold** and **Regular** (and SemiBold if used),
  at module load, from a runtime-stable path. Copy the required TTFs to `website/public/fonts/`
  (`public/` is present on disk in the standalone build; `src/assets` may not be). Family name e.g.
  `"IBM Plex Sans Arabic"`.
- **Params (zod):** add `program_name: string.min(1)` and `template_url: string.url().optional()`.
  Make `certificate_file_name` optional/removed. Keep `name`, `date`, `certificate_no`,
  `certificate_code`, `scale?`.
- **Template load:** `const img = template_url ? await loadImage(template_url) :
  await loadImage(path.join(process.cwd(), "public", "certificate.jpeg"))`.
- **Arabic handling:** helper `shapeText(s)` — if the string contains Arabic-range codepoints, run
  `arabic-reshaper` (join to presentation forms) then bidi reorder (`bidi-js`) to visual order;
  otherwise return `s` unchanged. Applied to `name` and `program_name`. `date` (digits/slashes) and
  the QR are unaffected. Centered `textAlign` keeps placement correct for both directions.
- **Draw order (all horizontally centered, coordinates as fractions of 1600×1235, tuned against the
  mockup):**
  1. **name** — teal `#1ad0d1`, IBM Plex Bold, ~`70px` (× scale), baseline ≈ `0.40·H`.
  2. **program name** — teal `#1ad0d1`, SemiBold, ~`42px`, baseline ≈ `0.50·H`; wrap to 2 lines if the
     measured width exceeds ~`0.8·W`.
  3. **date** — grey `#3F4142`, Regular, ~`40px`, baseline ≈ `0.61·H`, `formatDateToDDMMYYYY`.
  4. **QR** — from `certificate_code` → `{SITE_URL}/en/information-center/{code}`, size ≈ `0.13·W`,
     centered, top ≈ `0.66·H`, existing rounded-clip preserved.
- **Remove** the "Date:" and "Certificate no:" labels and the certificate-number text.
- Response and PNG streaming unchanged.

**New website deps:** `arabic-reshaper`, `bidi-js` (both pure-JS). Add to `website/package.json`.

**New website asset:** `website/public/fonts/IBMPlexSansArabic-Bold.ttf`,
`IBMPlexSansArabic-Regular.ttf` (+ SemiBold if used) — copied from `src/assets/fonts/`.

### 4.4 Dashboard changes

**`dashboard/src/app/dashboard/certificates/page.tsx`**
- Remove the program `<Select>` and the per-program mapping.
- Show a single global template preview (from the new `GET admin/certificate/image`) + one uploader.

**`dashboard/src/app/dashboard/certificates/components/upload-modal.tsx`**
- Upload to path `certificate/global` via the existing `UploadFile({ file, path })` helper, then
  `PUT admin/certificate/image` with `{ image: <uploaded relativePath/absolutePath> }`.

**`dashboard/src/app/dashboard/certificates/update-certificate.ts`**
- Replace `PutUpdateCertificate` to call `PUT certificate/image` with `{ image }` (drop the
  per-video `videos/{id}/certificate/image` call).

**`dashboard/src/app/dashboard/certificates/get-certificates.ts` + `types.ts`**
- Fetch the single global template from `GET certificate/image`; simplify the type to the
  `{ item: url }` shape.

- Adjust i18n copy in `dashboard/src/content/{ar,en}.json` (`certificates.*`) to drop program-selection
  wording. No behavioral dependency.

### 4.5 Data flow (after change)

```
completion (progress>=99 & rated)
  └─ GenerateCertificate (afterResponse)
       └─ downloadCertificateAsPdf(cert)
            ├─ template_url  = settings('certificate_image') → asset(...) | null
            ├─ program_name  = video.title  (locale = userVideo.lang)
            ├─ QR png         → storage/qr/{cert}.png            (unchanged)
            ├─ DomPDF loadView('pdf.sample-with-image', {...})
            │     └─ <img src="{PLATFORM}api/certificate/{video_id}
            │                    ?name&date&certificate_no&certificate_code
            │                    &program_name&template_url">
            │           └─ Next.js canvas: load template → shape(name),
            │                shape(program) → draw name/program/date/QR → PNG
            └─ save storage/certificates/{cert}.pdf → email → verification card
```

## 5. Error Handling

- Canvas: keep the existing try/catch → `500 { error, templatePath }`. If `template_url` fails to load,
  fall back to the bundled default before erroring.
- Reshaping: wrap in try/catch; on failure, draw the raw string (never throw the whole render).
- Backend upload: `CertificateController@update` keeps its `try/catch → sendResponse(false, …, 500)`.
- Missing setting: canvas default covers it; backend passes null `template_url` safely.

## 6. Backward Compatibility

- `videos.certificate_url` column, `PUT admin/videos/{video}/certificate/image`, and
  `VideoController@updateCertificate` remain but are unused by the new flow. No migration.
- Existing generated PDFs are untouched. Regeneration (`regenerateCertificate`,
  `updateCertificateUserName`) flows through the same `downloadCertificateAsPdf` and picks up the
  global template automatically.

## 7. Testing

- **Backend (PHPUnit):**
  - `downloadCertificateAsPdf` passes `program_name` and the resolved global `template_url` (assert the
    Blade receives them / the emitted `<img>` URL contains them); does **not** depend on
    `video.certificate_url`.
  - `PUT admin/certificate/image` creates/updates the `certificate_image` setting and returns the URL;
    `GET` returns it.
  - Locale: title resolves under `userVideo.lang`.
- **Canvas (manual visual):** render one English and one Arabic sample (Arabic name + Arabic program
  title) through the route and compare against `example-filled-certificate.jpeg` — verify Arabic is
  joined and RTL, name/program teal, date + QR placement.
- **Dashboard:** `npm run typecheck`; manual upload → preview refresh.

## 8. Risks / Open Points

- **Arabic shaping fidelity:** `arabic-reshaper` + `bidi-js` handle joining and direction but not full
  HarfBuzz-quality shaping (rare ligatures/kashida). Acceptable for names + titles; revisit only if a
  specific title renders wrong.
- **Font path in standalone build:** mitigated by shipping TTFs under `public/fonts/` and resolving via
  `process.cwd()`.
- **Coordinate tuning:** the §4.3 fractions are starting values; final positions tuned by visual
  comparison during implementation.
- **Program-name length:** long titles need the 2-line wrap; verify the longest real title fits above
  the "Through the Aman…" line.
- `example-filled-certificate.jpeg` is a reference mockup only — remove from `public/` (or move to
  `docs/`) before finishing so it does not ship.
```
