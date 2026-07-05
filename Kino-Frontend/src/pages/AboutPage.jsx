import React from 'react';
import { Sparkles, Calendar, Heart, Shield } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="pt-28 pb-20 bg-white select-none">
      
      {/* Editorial Header */}
      <section className="container max-w-4xl text-center flex flex-col items-center gap-6 mb-16">
        <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
          Kino Atelier
        </span>
        <h1 className="font-editorial text-5xl md:text-7xl text-text-dark font-light tracking-wide leading-tight">
          Quiet spaces, <br />
          <span className="italic text-accent-gold font-medium">honest</span> materials.
        </h1>
        <div className="w-12 h-[1px] bg-accent-gold mt-2" />
        <p className="text-sm md:text-base text-text-muted max-w-xl leading-relaxed mt-2 font-light">
          A study in structural minimalism. Handcrafting bespoke heirloom furniture and organic tabletop pieces designed to evoke tranquility in modern architectural dwellings.
        </p>
      </section>

      {/* Large Banner Image */}
      <div className="w-full h-[500px] overflow-hidden bg-black mb-20 relative">
        <img
          src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1600&q=80"
          alt="Curated interior styled space design"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-black/35" />
      </div>

      {/* Story Column Split */}
      <section className="container mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="flex flex-col gap-6">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
              Our Vision
            </span>
            <h2 className="font-editorial text-4xl text-text-dark font-medium leading-tight">
              Honoring the natural grain and structural imperfections of raw materials.
            </h2>
          </div>

          <div className="flex flex-col gap-6 text-sm text-text-muted leading-relaxed">
            <p>
              Founded in 2024 by a collective of visual directors and architects, Kino Atelier was established to disrupt the industrial mass-manufacturing cycle of residential decor. We believe modern spaces shouldn’t be cluttered with synthetic polymers and short-lived fast designs.
            </p>
            <p>
              Instead, we look toward raw Italian travertine blocks, European oak logs, and natural minerals. We work in tandem with the material’s natural flaws, permitting holes, grains, and specks to remain visible. Every element tells a visual log of the geographical source it emerged from.
            </p>
          </div>

        </div>
      </section>

      {/* Workshop visual split */}
      <section className="bg-bg-light/40 py-20 border-t border-b border-black/5 mb-20">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <h4 className="font-editorial text-xl font-bold mt-2">Bespoke Design</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              We prototype every piece at our Copenhagen studio, optimizing dimensions, line contours, and light shadows.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
              <Calendar size={16} />
            </div>
            <h4 className="font-editorial text-xl font-bold mt-2">Limited Drops</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              We operate on structured quarterly releases containing limited-run hand-numbered pieces to prevent over-extraction.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
              <Shield size={16} />
            </div>
            <h4 className="font-editorial text-xl font-bold mt-2">Certified Source</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              FSC-certified timber and Italian marble quarries adhering to strict preservation standards.
            </p>
          </div>

        </div>
      </section>

      {/* Heritage Quote */}
      <section className="container max-w-3xl text-center py-8">
        <h3 className="font-editorial text-3xl italic text-text-dark font-medium leading-relaxed">
          "Simplicity is not about reducing details. It is about understanding the core weight of materials so they can command a room without speaking."
        </h3>
        <span className="text-[0.65rem] uppercase tracking-widest font-bold text-accent-gold font-price-label mt-4 block">
          - Julian Sterling, Design Lead
        </span>
      </section>

    </div>
  );
};
export default AboutPage;
