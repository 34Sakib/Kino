@php
    $setting = \App\Models\Setting::current();
    $logoUrl = $setting?->logo ? (str_starts_with($setting->logo, 'http') ? $setting->logo : asset('storage/' . $setting->logo)) : null;
    $companyName = $setting?->company_name ?? 'Kino';
@endphp

<div class="fi-custom-logo-container flex items-center h-full max-h-full py-1 select-none overflow-visible" style="display: flex; align-items: center; min-height: 48px; max-height: 56px;">
    @if ($logoUrl)
        <img 
            src="{{ $logoUrl }}" 
            alt="{{ $companyName }}" 
            class="fi-custom-logo-img"
            style="height: 44px; max-height: 48px; width: auto; max-width: 220px; object-fit: contain; object-position: left center; display: block; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));" 
        />
    @else
        <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="width: 40px; height: 40px; min-width: 40px; background: linear-gradient(135deg, #F0D5A8 0%, #D4AF37 50%, #91701B 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #0B0F19; box-shadow: 0 4px 16px -2px rgba(212, 175, 55, 0.45); flex-shrink: 0; border: 1px solid rgba(255, 255, 255, 0.2);">
                <svg style="width: 20px; height: 20px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: center; line-height: 1.1; white-space: nowrap;">
                <span style="font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; color: #F8FAFC;">
                    {{ $companyName }}<span style="color: #D4AF37;">.</span>
                </span>
                <span style="font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: #E0BC72; font-weight: 700; margin-top: 2px;">
                    Commerce Suite
                </span>
            </div>
        </div>
    @endif
</div>

