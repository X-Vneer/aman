<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Inaash: {{ $title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">


</head>

<body dir="rtl">
    <div style="padding-right: 50px;">
        <br>

        مرحبا لديك اشعار من Inaash

        <div>
            <img style="display: block; margin:auto;" src="{{ config("app.inaash_api") }}img/inaash.png" alt="inaash" width="128" height="165">
        </div>
        <br>
        {{ $title }}
        <br>
        <br>
        <div style="text-align:center; font-size:26px;"><strong>{{ $body }}</strong></div>

        <br><br>
        شكرا لك,<br>
        {{ config("app.platform") }}
    </div>

</body>

</html>
