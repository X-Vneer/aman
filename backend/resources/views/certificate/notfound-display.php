<?php
/** Plain PHP view (PhpEngine): no Blade compile — avoids storage/framework/views write on restricted hosts. */
$htmlLang = str_replace('_', '-', app()->getLocale());
$unknown_certificate = ! empty($unknown_certificate);
$progress_phases = $progress_phases ?? null;
$certificate_number = $certificate_number ?? '';
$full_name = $full_name ?? null;
?>
<!doctype html>
<html lang="<?php echo e($htmlLang); ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo e(__('certificate.notfound_title')); ?></title>
    <style>
        body{font-family: Arial, Helvetica, sans-serif;background:linear-gradient(180deg,#f0f4f8,#ffffff);color:#1a202c;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px 0}
        .card{background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(2,6,23,0.08);padding:30px;max-width:820px;width:94%;text-align:center}
        .icon{font-size:48px;margin-bottom:12px;color:#e53e3e}
        .title{font-size:22px;margin-bottom:8px;font-weight:700}
        .hint{margin-top:18px;color:#4a5568;font-size:14px}
        .reason{margin-top:14px;padding-top:14px;border-top:1px solid #e2e8f0}
        .reason:first-of-type{margin-top:18px;border-top:none;padding-top:0}
    </style>
    </head>
<body>
    <div class="card" role="main">
        <div class="icon">📄</div>
        <div class="title">
            <div style="margin-bottom: 8px;"><?php echo e(__('certificate.notfound_title', [], 'en')); ?></div>
            <div dir="rtl"><?php echo e(__('certificate.notfound_title', [], 'ar')); ?></div>
        </div>

        <?php if ($unknown_certificate) : ?>
            <div class="hint">
                <div style="margin-bottom: 8px;"><?php echo e(__('certificate.notfound_unknown', [], 'en')); ?></div>
                <div dir="rtl"><?php echo e(__('certificate.notfound_unknown', [], 'ar')); ?></div>
            </div>
        <?php elseif (is_array($progress_phases)) : ?>
            <?php if (empty($progress_phases['phase_1_completed'])) : ?>
                <div class="reason hint">
                    <div style="margin-bottom: 8px;"><?php echo e(__('certificate.must_watch', [], 'en')); ?></div>
                    <div dir="rtl"><?php echo e(__('certificate.must_watch', [], 'ar')); ?></div>
                </div>
            <?php endif; ?>
            <?php if (empty($progress_phases['phase_2_completed'])) : ?>
                <div class="reason hint">
                    <div style="margin-bottom: 8px;"><?php echo e(__('certificate.reason_rate_video', [], 'en')); ?></div>
                    <div dir="rtl"><?php echo e(__('certificate.reason_rate_video', [], 'ar')); ?></div>
                </div>
            <?php endif; ?>
            <?php if (empty($progress_phases['phase_3_completed'])) : ?>
                <div class="reason hint">
                    <div style="margin-bottom: 8px;"><?php echo e(__('certificate.must_set_full_name', [], 'en')); ?></div>
                    <div dir="rtl"><?php echo e(__('certificate.must_set_full_name', [], 'ar')); ?></div>
                </div>
            <?php endif; ?>
            <?php if (empty($progress_phases['phase_4_completed'])) : ?>
                <div class="reason hint">
                    <div style="margin-bottom: 8px;"><?php echo e(__('certificate.must_fill_user_info', ['number' => $certificate_number], 'en')); ?></div>
                    <div dir="rtl"><?php echo e(__('certificate.must_fill_user_info', ['number' => $certificate_number], 'ar')); ?></div>
                </div>
            <?php endif; ?>
            <?php
            $p = $progress_phases;
            $allFour = ! empty($p['phase_1_completed']) && ! empty($p['phase_2_completed'])
                && ! empty($p['phase_3_completed']) && ! empty($p['phase_4_completed']);
            ?>
            <?php if ($allFour && empty($p['phase_5_completed'])) : ?>
                <div class="reason hint">
                    <div style="margin-bottom: 8px;"><?php echo e(__('certificate.pending_generation', [], 'en')); ?></div>
                    <div dir="rtl"><?php echo e(__('certificate.pending_generation', [], 'ar')); ?></div>
                </div>
            <?php endif; ?>
            <?php if ($allFour && ! empty($p['phase_5_completed'])) : ?>
                <div class="reason hint">
                    <div style="margin-bottom: 8px;"><?php echo e(__('certificate.notfound_hint', [], 'en')); ?></div>
                    <div dir="rtl"><?php echo e(__('certificate.notfound_hint', [], 'ar')); ?></div>
                </div>
            <?php endif; ?>
        <?php else : ?>
            <div class="hint">
                <div style="margin-bottom: 8px;"><?php echo e(__('certificate.must_watch', [], 'en')); ?></div>
                <div dir="rtl"><?php echo e(__('certificate.must_watch', [], 'ar')); ?></div>
            </div>
            <div class="hint" style="margin-top: 14px;">
                <?php if (empty($full_name)) : ?>
                    <div style="margin-bottom: 8px;"><?php echo e(__('certificate.must_set_full_name', [], 'en')); ?></div>
                    <div dir="rtl"><?php echo e(__('certificate.must_set_full_name', [], 'ar')); ?></div>
                <?php else : ?>
                    <?php echo e($full_name); ?>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>

</body>
</html>
