
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
            <img src="{{ config("app.platform") }}api/certificate/{{ $video_id }}?certificate_code={{ $certificate_number }}&certificate_no={{ $certificate_number }}&name={{ $full_name }}&date={{ $date }}&certificate_file_name={{ $certificate_file_name }}" />
        </div>
    </body>
</html>
