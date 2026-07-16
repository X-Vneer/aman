<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Aman OTP Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">


</head>

<body>
    <div style="padding-left: 50px;">
        <div>
            <img style="display: block; margin:auto;" src="{{ config("app.aman_api") }}img/inaash.png" alt="aman" width="128" height="165">
        </div>
        <br>
        Hello,
        <br>
        Your one-time password (OTP) for verification is:
        <br>
        <br>
        <div style="text-align:center; font-size:26px;"><strong>{{ $code }}</strong></div>
        <br>
        It will expire after 6 minutes
        <br>
        If you did not request this OTP, please ignore this email.
        <br><br>
        Thanks,<br>
        inaash.sa
    </div>

</body>

</html>
