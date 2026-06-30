import React from 'react';
import { products } from '../data/products';
import { ProductGrid } from '../components/product/ProductGrid';
import { Tag } from 'lucide-react';

export const SalePage = () => {
  // Filter products carrying sale badge or original price
  const saleProducts = products.filter((p) => p.originalPrice !== null || p.badge === 'Sale');

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none animate-fade-in">
      <div className="container">
        
        {/* Banner header */}
        <div className="bg-[#0D0D0D] text-white p-12 rounded-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col gap-3 max-w-xl text-center md:text-left items-center md:items-start">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label flex items-center gap-1.5">
              <Tag size={12} /> Seasonal Clearance
            </span>
            <h1 className="font-editorial text-4xl md:text-5xl font-light tracking-wide text-white leading-tight">
              The Private <br />
              <span className="italic text-accent-gold font-medium">Sale Collection</span>
            </h1>
            <p className="text-xs text-white/50 leading-relaxed font-light mt-1">
              Curated architectural studio pieces carrying limited-run discounts. Authenticate using code <span className="font-bold text-accent-gold font-price-label">GOLDEN</span> inside your summary sidebar to claim an additional 10% off.
            </p>
          </div>

          <div className="border border-solid border-white/10 p-6 rounded-sm text-center min-w-[200px] bg-white/5 backdrop-blur-xs">
            <span className="text-[0.65rem] uppercase text-white/40 tracking-widest block font-bold">Additional discount</span>
            <span className="font-price-label text-4xl font-extrabold text-accent-gold block mt-1">10% OFF</span>
            <span className="text-[0.55rem] uppercase text-white/30 tracking-widest mt-1 block">CODE: GOLDEN</span>
          </div>
        </div>

        {/* Grid listing */}
        <div className="border-b border-black/5 pb-4 mb-8 flex items-center justify-between">
          <h2 className="font-editorial text-2xl font-bold">Archived Studio Offers</h2>
          <span className="text-xs text-text-muted font-price-label">({saleProducts.length} pieces on sale)</span>
        </div>

        <ProductGrid products={saleProducts} columns={3} />

      </div>
    </div>
  );
};
export default SalePage;
