import React from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import { ProductGrid } from '../product/ProductGrid';
import { Button } from '../shared/Button';

export const FeaturedProducts = () => {
  const navigate = useNavigate();
  // Filter products that are not sold out or just grab the first 4 for display
  const featuredItems = products.slice(0, 4);

  return (
    <section id="featured-collection" className="py-20 bg-white border-b border-black/5">
      <div className="container flex flex-col items-center gap-12">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Curator's Edit
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl text-text-dark font-medium leading-tight">
            Featured Masterpieces
          </h2>
          <div className="w-12 h-[1px] bg-accent-gold mt-4" />
        </div>

        {/* 4-col product grid */}
        <div className="w-full">
          <ProductGrid products={featuredItems} columns={4} />
        </div>

        {/* View All Collection CTA */}
        <Button
          onClick={() => navigate('/shop')}
          variant="outline"
          className="font-bold tracking-widest px-8 mt-4"
        >
          View Full Collection
        </Button>

      </div>
    </section>
  );
};
export default FeaturedProducts;
