import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, Search, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export const MobileTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const openCart = useCartStore((state) => state.openDrawer);
  const getCartCount = useCartStore((state) => state.getCount);
  const cartCount = getCartCount();

  const handleTabClick = (path, isCart = false) => {
    if (isCart) {
      openCart();
    } else {
      navigate(path);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-solid border-black/5 flex items-center justify-around py-2.5 lg:hidden"
      style={{
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
      }}
    >
      {/* Home Tab */}
      <button
        onClick={() => handleTabClick('/')}
        className={`flex flex-col items-center gap-0.5 ${isActive('/') ? 'text-accent-gold' : 'text-text-dark/60'}`}
      >
        <Home size={20} />
        <span className="text-[0.6rem] font-bold uppercase tracking-wider font-price-label">Home</span>
      </button>

      {/* Shop Tab */}
      <button
        onClick={() => handleTabClick('/shop')}
        className={`flex flex-col items-center gap-0.5 ${isActive('/shop') || location.pathname.startsWith('/shop/') ? 'text-accent-gold' : 'text-text-dark/60'}`}
      >
        <Compass size={20} />
        <span className="text-[0.6rem] font-bold uppercase tracking-wider font-price-label">Shop</span>
      </button>

      {/* Search Tab (takes to shop and focuses query) */}
      <button
        onClick={() => handleTabClick('/shop')}
        className="flex flex-col items-center gap-0.5 text-text-dark/60"
      >
        <Search size={20} />
        <span className="text-[0.6rem] font-bold uppercase tracking-wider font-price-label">Search</span>
      </button>

      {/* Cart Tab */}
      <button
        onClick={() => handleTabClick('', true)}
        className="flex flex-col items-center gap-0.5 text-text-dark/60 relative"
      >
        <ShoppingBag size={20} />
        {cartCount > 0 && (
          <span className="absolute top-0 right-1 bg-accent-gold text-bg-dark text-[0.55rem] font-bold w-4 h-4 rounded-full flex items-center justify-center font-price-label">
            {cartCount}
          </span>
        )}
        <span className="text-[0.6rem] font-bold uppercase tracking-wider font-price-label">Cart</span>
      </button>

      {/* Account Tab */}
      <button
        onClick={() => handleTabClick('/account')}
        className={`flex flex-col items-center gap-0.5 ${isActive('/account') ? 'text-accent-gold' : 'text-text-dark/60'}`}
      >
        <User size={20} />
        <span className="text-[0.6rem] font-bold uppercase tracking-wider font-price-label">Account</span>
      </button>
    </div>
  );
};
export default MobileTabBar;
