
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
