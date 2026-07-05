import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { ProductGrid } from '../product/ProductGrid';
import { Button } from '../shared/Button';
import { SkeletonGrid } from '../shared/Loader';

export const FeaturedProducts = () => {
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get('/products?limit=4')
      .then(res => {
        if (active) {
          const mapped = api.mapProducts(res);
          setFeaturedItems(mapped);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

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
          {loading ? (
            <SkeletonGrid limit={4} columns={4} />
          ) : (
            <ProductGrid products={featuredItems} columns={4} />
          )}
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
