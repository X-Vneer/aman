@extends('emails.layout')

@section('title', __('emailBrand') . ': ' . $title)

@section('content')
    <p style="margin:0 0 8px; font-size:17px; font-weight:600;">{{ $title }}</p>
    <p style="margin:0 0 20px; color:#52525b;">{{ __('emailNotificationIntro') }}</p>

    <div style="background:#f9fafb; border-radius:10px; border-{{ app()->getLocale() === 'ar' ? 'right' : 'left' }}:4px solid #1ad0d1; padding:16px 18px;">
        {{ $body }}
    </div>
@endsection
