import { create } from 'zustand';
import api from '../utils/api';

export const useSettingsStore = create((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/settings');
      set({ settings: response, loading: false });

      // Apply dynamic company name to page title
      if (response && response.company_name) {
        document.title = `${response.company_name} | Sculptural Home Sanctuary & Decor`;
      }

      // Apply dynamic favicon if uploaded
      if (response && response.favicon) {
        const faviconUrl = api.resolveImageUrl(response.favicon);
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = faviconUrl;
        
        // Dynamically update favicon MIME type
        if (faviconUrl.endsWith('.svg')) {
          link.type = 'image/svg+xml';
        } else if (faviconUrl.endsWith('.png')) {
          link.type = 'image/png';
        } else {
          link.type = 'image/x-icon';
        }
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
      set({ error: err.message, loading: false });
    }
  }
}));
