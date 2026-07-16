<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Inaash</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">


</head>

<body dir="rtl">
    <div style="padding-right: 50px;">
        <div>
            <img style="display: block; margin:auto;" src="{{ config("app.inaash_api") }}img/inaash.png" alt="inaash" width="128" height="165">
        </div>
        <br>
       مرحبا : {{ $name }},
        <br>
        <div><p>
             تهانينا لك من انعاش! تم اصدار شهادة برنامج التثقيف على
        </p></div>

        <h2><a href="{{ config("app.platform") }}ar/information-center/{{ $cert_number }}">{{ $video_title }}</a></h2>

        <h2>
            <a href="{{ config("app.inaash_api") }}pdf/{{ $video_id }}.pdf">
                حمل الكتيب التوعوي من هنا
            </a>
        </h2>

        <div>
            <img style="display: block; margin:auto;" src="{{ config("app.inaash_api") }}storage/qr/{{ $cert_number }}.png" alt="inaash">
        </div>
        <br><br>
        شكرا لك,<br>
        {{ config("app.platform") }}
    </div>

</body>

</html>
