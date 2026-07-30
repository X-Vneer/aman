@extends('emails.layout')

@section('title', __('emailOtpTitle'))

@section('content')
    <p style="margin:0 0 8px; font-size:17px; font-weight:600;">{{ __('emailHello') }}</p>
    <p style="margin:0 0 20px; color:#52525b;">{{ __('emailOtpIntro') }}</p>

    <div style="background-color:#f0fdfd; border:1px solid #b8f0f0; border-radius:10px; padding:18px; text-align:center;">
        <div style="font-size:32px; font-weight:700; letter-spacing:6px; color:#0e9c9d; direction:ltr;">
            {{ $code }}
        </div>
    </div>

    <p style="margin:18px 0 0; color:#52525b;">{{ __('emailOtpExpiry') }}</p>
    <p style="margin:8px 0 0; font-size:13px; color:#a1a1aa;">{{ __('emailOtpIgnore') }}</p>
@endsection
