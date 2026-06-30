import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Award, Heart } from 'lucide-react';

export const BrandStory = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-bg-light/45 border-b border-black/5">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Visual Split Overlay */}
          <div className="relative h-[550px] w-full rounded-sm overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
              alt="Atelier workspace wood crafting details"
              className="w-full h-full object-cover"
            />
            {/* Overlay float panel */}
            <div 
              className="absolute bottom-8 right-8 bg-white p-6 shadow-xl max-w-xs border border-solid border-black/5 rounded-sm"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              <h4 className="font-editorial text-xl font-bold mb-2">Sustainable Sourcing</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Every piece is carved from certified raw oak logs and stone blocks harvested under strict eco-preservation guidelines in Italy and Denmark.
              </p>
            </div>
          </div>

          {/* Right Column: Narrative Info */}
          <div className="flex flex-col gap-6 items-start">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
              Our Heritage
            </span>
            <h2 className="font-editorial text-4xl md:text-5xl text-text-dark font-medium leading-tight">
              An Atelier built on quiet, organic textures
            </h2>
            
            <p className="text-sm text-text-muted leading-relaxed mt-2">
              Kino Atelier emerged from a simple desire: to remove the noise from modern spaces. We design sculptural interior objects that speak through natural wood grains, raw travertine holes, and speckled clay shapes.
            </p>

            <p className="text-sm text-text-muted leading-relaxed">
              We collaborate with third-generation family workshops in Tuscany and Copenhagen to produce limited-run collections. We do not mass-produce; we build heirloom elements intended to survive generations.
            </p>

            {/* Core credentials checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-4 pt-6 border-t border-solid border-black/5">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
                <h5 className="font-editorial text-sm font-bold mt-1">10-Year Warranty</h5>
                <p className="text-[0.7rem] text-text-muted">On joinery & structure.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                  <Award size={18} />
                </div>
                <h5 className="font-editorial text-sm font-bold mt-1">Artisan Made</h5>
                <p className="text-[0.7rem] text-text-muted">Hand-finished details.</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center">
                  <Heart size={18} />
                </div>
                <h5 className="font-editorial text-sm font-bold mt-1">100% Organic</h5>
                <p className="text-[0.7rem] text-text-muted">Natural stone & finishes.</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/about')}
              className="btn-gold py-2.5 px-6 text-xs mt-6 font-bold tracking-wider"
            >
              Discover Our Process
            </button>

          </div>

        </div>
      </div>
    </section>
  );
};
export default BrandStory;
