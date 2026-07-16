import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import api from '../../utils/api';

export const Footer = () => {
  const settings = useSettingsStore((state) => state.settings);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0D0D0D] text-white pt-16 pb-8 border-t border-solid border-white/5">
      <div className="container">
        
        {/* Upper footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex flex-col self-start">
              {settings?.logo ? (
                <img
                  src={api.resolveImageUrl(settings.logo)}
                  alt={settings.company_name || "Kino Atelier"}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <>
                  <span className="font-editorial text-2xl font-semibold tracking-[0.2em] uppercase text-white">
                    {settings?.company_name || 'Kino'}
                  </span>
                  <span className="text-[0.6rem] tracking-[0.4em] uppercase text-accent-gold mt-[-3px] font-price-label font-bold">
                    Atelier
                  </span>
                </>
              )}
            </Link>
            <p className="text-xs text-white/50 max-w-sm mt-2">
              Curating elevated sensory items for modern architectural interiors. Handcrafted, organic materials and sculptural minimalism.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-8 h-8 rounded-full border border-solid border-white/10 flex items-center justify-center hover:border-accent-gold hover:text-accent-gold transition-colors text-white/70">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-solid border-white/10 flex items-center justify-center hover:border-accent-gold hover:text-accent-gold transition-colors text-white/70">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-solid border-white/10 flex items-center justify-center hover:border-accent-gold hover:text-accent-gold transition-colors text-white/70">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-price-label text-xs uppercase tracking-wider font-semibold text-white/95">
              Collections
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/shop/living-room" className="text-xs text-white/50 hover:text-accent-gold transition-colors">
                  Living Room Lounge
                </Link>
              </li>
              <li>
                <Link to="/shop/bedroom" className="text-xs text-white/50 hover:text-accent-gold transition-colors">
                  Bedroom Sanctuary
                </Link>
              </li>
              <li>
                <Link to="/shop/workspace" className="text-xs text-white/50 hover:text-accent-gold transition-colors">
                  Workspace Atelier
                </Link>
              </li>
              <li>
                <Link to="/shop/lighting" className="text-xs text-white/50 hover:text-accent-gold transition-colors">
                  Sculptural Lighting
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="flex flex-col gap-3">
            <h4 className="font-price-label text-xs uppercase tracking-wider font-semibold text-white/95">
              Assistance
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/contact" className="text-xs text-white/50 hover:text-accent-gold transition-colors">
                  Client Services
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-xs text-white/50 hover:text-accent-gold transition-colors">
                  FAQ & Assistance
                </Link>
              </li>
              <li>
                <Link to="/policies/returns" className="text-xs text-white/50 hover:text-accent-gold transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-xs text-white/50 hover:text-accent-gold transition-colors">
                  Track Order Status
                </Link>
              </li>
              <li>
                <Link to="/gift-cards" className="text-xs text-white/50 hover:text-accent-gold transition-colors">
                  Digital Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter teaser */}
          <div className="flex flex-col gap-3">
            <h4 className="font-price-label text-xs uppercase tracking-wider font-semibold text-white/95">
              The Lookbook Journal
            </h4>
            <p className="text-xs text-white/50">
              Subscribe to receive private styling logs and early access to limited edition drops.
            </p>
            <div className="flex mt-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-white/5 border-white/10 text-white placeholder-white/30 text-xs rounded-l-sm focus:border-accent-gold w-full"
              />
              <button className="bg-accent-gold text-bg-dark font-bold text-xs uppercase tracking-wider px-3 rounded-r-sm hover:bg-accent-gold-hover transition-colors flex items-center justify-center">
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Lower footer */}
        <div className="border-t border-solid border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[0.65rem] text-white/40 tracking-wider">
            &copy; {new Date().getFullYear()} KINO ATELIER. All rights reserved. Created for premium spaces.
          </p>
          
          <div className="flex items-center gap-6 text-[0.65rem] text-white/40">
            <Link to="/policies/privacy" className="hover:text-accent-gold transition-colors">Privacy Policy</Link>
            <Link to="/policies/returns" className="hover:text-accent-gold transition-colors">Refund Guidelines</Link>
            <button
              onClick={handleScrollToTop}
              className="text-white/40 hover:text-accent-gold transition-colors text-[0.65rem] uppercase tracking-widest flex items-center gap-1"
            >
              Back To Top &uarr;
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
