@php
    $setting = \App\Models\Setting::current();
    $faviconUrl = $setting && $setting->favicon 
        ? (str_starts_with($setting->favicon, 'http') ? $setting->favicon : asset('storage/' . $setting->favicon)) 
        : asset('favicon.ico');
    $cssVersion = @filemtime(public_path('css/custom-filament.css')) ?: time();
@endphp

<!-- Dynamic Favicon linked to Frontend settings -->
@if(!empty($faviconUrl))
<link rel="icon" href="{{ $faviconUrl }}" />
@endif

<!-- Preconnect Google Fonts for ultra-fast typography rendering -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet">

<!-- High-Performance Cached Kino Luxury Design System -->
<link rel="stylesheet" href="{{ asset('css/custom-filament.css') }}?v={{ $cssVersion }}" />

