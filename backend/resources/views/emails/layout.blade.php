@php
    $locale = app()->getLocale();
    $rtl = $locale === 'ar';
    $align = $rtl ? 'right' : 'left';
    $logo = rtrim(config('app.aman_api'), '/') . '/img/aman.png';
    $site = rtrim(config('app.platform') ?: config('app.url'), '/');
@endphp
<!DOCTYPE html>
<html lang="{{ $locale }}" dir="{{ $rtl ? 'rtl' : 'ltr' }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>@yield('title', __('emailBrand'))</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color:#f4f6f8; padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:560px; background-color:#ffffff; border-radius:14px; overflow:hidden;
                           font-family:'Segoe UI', Tahoma, Arial, sans-serif; color:#2e2a33;">

                    {{-- header --}}
                    <tr>
                        <td align="center" style="background-color:#1ad0d1; padding:24px 24px 20px;">
                            <img src="{{ $logo }}" alt="{{ __('emailBrand') }}" width="56"
                                style="display:block; border:0; height:auto;">
                            <div style="margin-top:10px; font-size:20px; font-weight:700; color:#ffffff;">
                                {{ __('emailBrand') }}
                            </div>
                        </td>
                    </tr>

                    {{-- body --}}
                    <tr>
                        <td align="{{ $align }}" style="padding:28px 28px 8px; font-size:15px; line-height:1.8;">
                            @yield('content')
                        </td>
                    </tr>

                    {{-- footer --}}
                    <tr>
                        <td align="{{ $align }}" style="padding:20px 28px 28px;">
                            <div style="border-top:1px solid #e4e4e7; padding-top:16px; font-size:13px; color:#71717a;">
                                {{ __('emailSignOff') }}<br>
                                <a href="{{ $site }}" style="color:#1ad0d1; text-decoration:none;">{{ $site }}</a>
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
