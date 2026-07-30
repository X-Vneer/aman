@extends('emails.layout')

@section('title', __('emailCertTitle'))

@php
    $locale = app()->getLocale();
    $api = rtrim(config('app.aman_api'), '/');
    $site = rtrim(config('app.platform') ?: config('app.url'), '/');
@endphp

@section('content')
    <p style="margin:0 0 8px; font-size:17px; font-weight:600;">{{ __('emailGreeting', ['name' => $name]) }}</p>
    <p style="margin:0 0 18px; color:#52525b;">{{ __('emailCertIntro') }}</p>

    <div style="background:#f0fdfd; border:1px solid #b8f0f0; border-radius:10px; padding:16px 18px; text-align:center;">
        <div style="font-size:13px; color:#0e9c9d;">{{ __('emailCertProgram') }}</div>
        <div style="margin-top:4px; font-size:18px; font-weight:700;">{{ $video_title }}</div>
        <div style="margin-top:6px; font-size:13px; color:#71717a; direction:ltr;">#{{ $cert_number }}</div>
    </div>

    <div style="text-align:center; padding:22px 0 6px;">
        <a href="{{ $site }}/{{ $locale }}/information-center/{{ $cert_number }}"
            style="display:inline-block; background:#1ad0d1; color:#ffffff; font-size:15px; font-weight:600;
                   text-decoration:none; padding:12px 26px; border-radius:8px;">
            {{ __('emailCertButton') }}
        </a>
    </div>

    <p style="margin:14px 0 0; text-align:center;">
        <a href="{{ $api }}/pdf/{{ $video_id }}.pdf" style="color:#1ad0d1; font-size:14px; text-decoration:none;">
            {{ __('emailCertBooklet') }}
        </a>
    </p>

    <div style="text-align:center; padding-top:18px;">
        <img src="{{ $api }}/storage/qr/{{ $cert_number }}.png" alt="{{ __('emailCertTitle') }}" width="120"
            style="display:inline-block; border:0; height:auto;">
        <div style="margin-top:6px; font-size:12px; color:#a1a1aa;">{{ __('emailCertQr') }}</div>
    </div>
@endsection
