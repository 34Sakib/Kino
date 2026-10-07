@php
    $setting = \App\Models\Setting::current();
    $faviconUrl = $setting && $setting->favicon 
        ? (str_starts_with($setting->favicon, 'http') ? $setting->favicon : asset('storage/' . $setting->favicon)) 
        : asset('favicon.ico');
    $cssVersion = @filemtime(public_path('css/custom-filament.css')) ?: 2;
@endphp

@if(!empty($faviconUrl))
<link rel="icon" href="{{ $faviconUrl }}" />
@endif

<!-- High-Speed Typography Preconnect with Swap Display -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<!-- Cool Premium Slate & Sapphire Theme Engine -->
<link rel="stylesheet" href="{{ asset('css/custom-filament.css') }}?v={{ $cssVersion }}" />

