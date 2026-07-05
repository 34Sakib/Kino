import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid = () => {
  const [bentoCats, setBentoCats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get('/categories')
      .then(res => {
        if (active) {
          setBentoCats(api.mapCategories(res).slice(0, 5));
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const gridClasses = [
    'col-span-3 h-[320px]',
    'col-span-3 h-[320px]',
    'col-span-2 h-[260px]',
    'col-span-2 h-[260px]',
    'col-span-2 h-[260px]',
  ];

  if (loading) {
    return (
      <section className="py-20 bg-bg-light">
        <div className="container text-center text-text-muted text-xs">
          Loading curator categories...
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-bg-light">
      <div className="container">
        
        {/* Title */}
        <div className="text-center mb-12 flex flex-col items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Curated Spaces
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl text-text-dark font-medium leading-tight">
            Shop by Sanctuary
          </h2>
          <div className="w-12 h-[1px] bg-accent-gold mt-4" />
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          {bentoCats.map((cat, idx) => {
            const sizeClass = gridClasses[idx] || 'col-span-2 h-[260px]';
            return (
              <Link
                key={cat.id}
                to={`/shop/${cat.slug}`}
                className={`relative group overflow-hidden rounded-sm bg-black ${sizeClass}`}
                style={{
                  gridColumn: sizeClass.includes('col-span-3') 
                    ? 'span 3 / span 3' 
                    : 'span 2 / span 2'
                }}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-75 group-hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
                />

                {/* Dark Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:via-black/40 transition-colors duration-500" />

                {/* Info Text */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end gap-1.5 z-10">
                  <span className="text-xs text-accent-gold font-bold uppercase tracking-wider font-price-label">
                    Sanctuary {idx + 1}
                  </span>
                  
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-2xl text-white font-medium group-hover:text-accent-gold transition-colors duration-300">
                      {cat.name}
                    </h3>
                    <div className="w-8 h-8 rounded-full border border-solid border-white/20 flex items-center justify-center text-white group-hover:border-accent-gold group-hover:bg-accent-gold group-hover:text-black transition-all duration-300">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>

                  <p className="text-white/60 text-xs font-light max-w-sm line-clamp-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>

      <style>{`
        @media (max-width: 991px) {
          .bento-grid > a {
            grid-column: span 6 / span 6 !important;
            height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
};
export default CategoryGrid;
