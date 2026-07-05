import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { ProductCard } from '../components/product/ProductCard';
import api from '../utils/api';
import { ShoppingBag } from 'lucide-react';

export const CartPage = () => {
  const navigate = useNavigate();

  // Zustand State hooks
  const items = useCartStore((state) => state.items);
  const getCount = useCartStore((state) => state.getCount);
  const count = getCount();

  const [upsellItems, setUpsellItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch upsell items dynamically from the API
  useEffect(() => {
    let active = true;
    api.get('/products?limit=12')
      .then(res => {
        if (active) {
          const mapped = api.mapProducts(res);
          const filtered = mapped.filter((p) => !items.some((item) => item.id === p.id) && p.stock > 0).slice(0, 3);
          setUpsellItems(filtered);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch upsell items:', err);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [items]);

  // Redirect to checkout carrying selected discounts/totals
  const handleCheckout = (pricingInfo) => {
    navigate('/checkout', { state: { pricing: pricingInfo } });
  };

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none">
      <div className="container">
        
        {/* Title */}
        <div className="mb-10 text-center md:text-left flex flex-col gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Shopping Bag
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl font-medium">
            Review Your Items
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
            <ShoppingBag size={56} strokeWidth={1} className="text-text-muted/40 animate-float" />
            <div>
              <h2 className="font-editorial text-2xl italic text-text-muted">Your shopping bag is empty.</h2>
              <p className="text-sm text-text-muted mt-1">Select fine crafted designs to populate your space.</p>
              <Link to="/shop" className="btn-gold py-2.5 px-8 inline-block mt-6 font-bold tracking-widest text-xs uppercase">
                Browse Gallery
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Left Column: Cart line items */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div className="border border-solid border-black/5 rounded-sm p-6 bg-white">
                <h3 className="font-editorial text-xl font-bold uppercase tracking-wider border-b border-black/5 pb-2 mb-4">
                  Bag Items ({count})
                </h3>
                
                <div className="flex flex-col">
                  {items.map((item) => (
                    <CartItem key={`${item.id}-${item.selectedColor?.name || 'none'}-${item.selectedSize || 'none'}`} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (Sticky) */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-24">
                <CartSummary onCheckout={handleCheckout} />
              </div>
            </div>

          </div>
        )}

        {loading ? (
          <div className="border-t border-black/5 pt-16 mt-20 text-center text-text-muted text-xs">
            Curating suggestions for your concept...
          </div>
        ) : upsellItems.length > 0 && (
          <div className="border-t border-black/5 pt-16 mt-20">
            <div className="text-center mb-10 flex flex-col items-center gap-1.5">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
                Complete Your Concept
              </span>
              <h3 className="font-editorial text-2xl md:text-3xl text-text-dark font-medium">
                You May Also Like
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {upsellItems.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default CartPage;
