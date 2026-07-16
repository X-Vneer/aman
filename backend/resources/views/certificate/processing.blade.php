<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('certificate.processing_title') }}</title>
    <style>
        body{font-family: Arial, Helvetica, sans-serif;background:#f7fafc;color:#1a202c;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
        .card{background:#fff;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,0.08);padding:28px;max-width:720px;width:94%;text-align:center}
        .title{font-size:20px;margin-bottom:12px}
        .desc{color:#4a5568;margin-bottom:18px}
        .timer{font-weight:700;font-size:28px;margin-top:8px}
        .sub{color:#718096;font-size:13px;margin-top:12px}
    </style>
</head>
<body>
    <div class="card">
        <div class="title">{{ __('certificate.processing_title') }}</div>
        <div class="desc">{{ __('certificate.processing_message') }}</div>

        <div>
            <div>{{ __('certificate.waiting_label') }}</div>
            <div id="countdown" class="timer">30</div>
            <div class="sub">{{ __('certificate.auto_refresh') }}</div>
        </div>

        <div style="margin-top:16px;color:#718096;font-size:13px">{{ __('certificate.if_not_ready') }}</div>
    </div>

    <script>
        (function(){
            var countdownEl = document.getElementById('countdown');
            var seconds = 30;
            countdownEl.innerText = seconds;
            var interval = setInterval(function(){
                seconds -= 1;
                if(seconds <= 0){
                    clearInterval(interval);
                    // reload current page to check if certificate was generated
                    window.location.reload();
                } else {
                    countdownEl.innerText = seconds;
                }
            }, 1000);
        })();
    </script>
</body>
</html>
