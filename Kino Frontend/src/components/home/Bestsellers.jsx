import React, { useRef } from 'react';
import { products } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Bestsellers = () => {
  const scrollRef = useRef(null);
  
  // Choose bestseller products
  const bestsellers = products.slice(0, 5);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 bg-white border-b border-black/5">
      <div className="container">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
              Highly Coveted
            </span>
            <h2 className="font-editorial text-4xl md:text-5xl text-text-dark font-medium leading-tight">
              Bestselling Pieces
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-solid border-black/10 flex items-center justify-center hover:border-accent-gold hover:text-accent-gold transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-solid border-black/10 flex items-center justify-center hover:border-accent-gold hover:text-accent-gold transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="bestsellers-scroll flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          {bestsellers.map((product) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

      </div>

      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .bestsellers-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
export default Bestsellers;
