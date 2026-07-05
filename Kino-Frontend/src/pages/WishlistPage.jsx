import React from 'react';
import { useWishlistStore } from '../store/wishlistStore';
import { ProductGrid } from '../components/product/ProductGrid';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const WishlistPage = () => {
  const items = useWishlistStore((state) => state.items);

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none">
      <div className="container">
        
        {/* Title */}
        <div className="mb-10 text-center md:text-left flex flex-col gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Saved Designs
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl font-medium">
            Your Atelier Wishlist
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
            <Heart size={56} strokeWidth={1} className="text-text-muted/40 animate-float" />
            <div>
              <h2 className="font-editorial text-2xl italic text-text-muted">Your wishlist is empty.</h2>
              <p className="text-sm text-text-muted mt-1">Tap the heart on product cards to bookmark your favorites.</p>
              <Link to="/shop" className="btn-gold py-2.5 px-8 inline-block mt-6 font-bold tracking-widest text-xs uppercase">
                Explore Collection
              </Link>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in mt-4">
            <ProductGrid products={items} columns={3} />
          </div>
        )}

      </div>
    </div>
  );
};
export default WishlistPage;
