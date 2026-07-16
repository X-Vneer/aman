<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('certificate.view_title') }}</title>
    <style>
        html,body{height:100%;margin:0}
        iframe{border:none;width:100%;height:100vh}
    </style>
</head>
<body>
    <iframe src="{{ $pdfUrl }}"></iframe>
</body>
</html>
