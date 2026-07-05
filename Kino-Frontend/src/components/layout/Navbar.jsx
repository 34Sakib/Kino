import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, ChevronDown, LogOut, X, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useUserStore } from '../../store/userStore';
import api from '../../utils/api';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Zustand Stores
  const getCartCount = useCartStore((state) => state.getCount);
  const openCart = useCartStore((state) => state.openDrawer);
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, login, logout } = useUserStore();

  // Local State
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [badgePop, setBadgePop] = useState(false);

  // Refs
  const searchRef = useRef(null);
  const accountRef = useRef(null);

  // Fetch categories and products dynamically on mount
  useEffect(() => {
    let active = true;
    api.get('/categories')
      .then(res => {
        if (active) setCategories(api.mapCategories(res));
      })
      .catch(err => console.error('Navbar category load failed:', err));

    api.get('/products?limit=100')
      .then(res => {
        if (active) {
          const mapped = api.mapProducts(res);
          setAllProducts(mapped || []);
        }
      })
      .catch(err => console.error('Navbar products load failed:', err));

    return () => { active = false; };
  }, []);

  // Count animations
  const cartCount = getCartCount();
  useEffect(() => {
    if (cartCount > 0) {
      setBadgePop(true);
      const timer = setTimeout(() => setBadgePop(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount, cartItems]); // Trigger when cart count/items array changes

  // Scroll handler for floating navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search input live filtering against API products
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchSuggestions([]);
      return;
    }
    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Max 5 suggestions
    setSearchSuggestions(filtered);
  }, [searchQuery, allProducts]);

  // Execute Search
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Quick select suggestion
  const handleSuggestionClick = (productId) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    navigate(`/product/${productId}`);
  };

  // Handle Mock Authentication
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail.trim()) {
      login(loginEmail, loginName.trim() || undefined);
      setLoginEmail('');
      setLoginName('');
      setIsAccountOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-[36px] left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container flex items-center justify-between gap-4">
        
        {/* Left Side: Navigation Links / Mega Menu trigger */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-sm font-semibold tracking-wider uppercase hover:text-accent-gold transition-colors">
            Home
          </Link>
          
          {/* Shop with hover mega menu */}
          <div className="relative group py-2">
            <Link
              to="/shop"
              className="text-sm font-semibold tracking-wider uppercase hover:text-accent-gold transition-colors flex items-center gap-1"
            >
              Shop <ChevronDown size={14} />
            </Link>

            {/* Mega Menu Overlay */}
            <div className="absolute top-full left-[-40px] w-[880px] bg-white shadow-xl opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 border border-solid border-black/5 p-8 flex gap-8 rounded-sm">
              <div className="w-1/4">
                <h4 className="font-editorial text-lg font-bold border-b border-black/5 pb-2 mb-4">Categories</h4>
                <ul className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/shop/${cat.slug}`}
                        className="text-sm text-text-muted hover:text-accent-gold transition-colors hover:pl-1 flex items-center"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/shop"
                      className="text-sm text-accent-gold font-bold flex items-center gap-1 hover:gap-2 transition-all mt-2"
                    >
                      View All Collection <ArrowRight size={14} />
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Bento-like visual items in Mega Menu */}
              <div className="w-3/4 grid grid-cols-3 gap-4">
                {categories.slice(0, 3).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/shop/${cat.slug}`}
                    className="relative group/mega h-40 overflow-hidden rounded-sm block bg-black"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover opacity-75 group-hover/mega:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                      <span className="text-white text-xs font-semibold uppercase tracking-wider font-price-label">{cat.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link to="/about" className="text-sm font-semibold tracking-wider uppercase hover:text-accent-gold transition-colors">
            Our Story
          </Link>
          <Link to="/contact" className="text-sm font-semibold tracking-wider uppercase hover:text-accent-gold transition-colors">
            Contact
          </Link>
        </nav>

        {/* Center: Brand Logo */}
        <Link to="/" className="flex flex-col items-center">
          <span className="font-editorial text-2xl md:text-3xl font-semibold tracking-[0.2em] uppercase text-text-dark">
            Kino
          </span>
          <span className="text-[0.6rem] tracking-[0.4em] uppercase text-accent-gold mt-[-3px] font-price-label font-bold">
            Atelier
          </span>
        </Link>

        {/* Right Side: Actions (Search, Account, Wishlist, Cart) */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Live Search */}
          <div ref={searchRef} className="relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-36 md:w-52 pr-8 pl-4 py-1.5 text-sm rounded-full bg-black/5 border border-transparent focus:bg-white focus:w-48 md:focus:w-72 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-3 text-text-dark/70 hover:text-accent-gold"
              >
                <Search size={16} />
              </button>
            </form>

            {/* Suggestions Overlay */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white border border-solid border-black/5 rounded-sm shadow-xl p-3 z-50">
                <p className="text-[0.65rem] font-semibold text-text-muted uppercase tracking-wider px-2 pb-2 border-b border-black/5">
                  Suggestions
                </p>
                <ul className="flex flex-col mt-2">
                  {searchSuggestions.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(product.id)}
                        className="w-full text-left flex items-center gap-3 p-2 hover:bg-black/5 rounded-sm transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-text-dark truncate">
                            {product.name}
                          </p>
                          <p className="text-[0.65rem] text-text-muted font-price-label">
                            {product.tagline}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-accent-gold font-price-label">
                          ${product.price}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Wishlist Shortcut */}
          <Link
            to="/wishlist"
            className="text-text-dark hover:text-accent-gold transition-colors relative hidden md:block"
            title="Saved Items"
          >
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center font-price-label">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Account Login Portal */}
          <div ref={accountRef} className="relative">
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="text-text-dark hover:text-accent-gold transition-colors flex items-center gap-0.5"
            >
              <User size={20} />
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-solid border-black/5 rounded-sm shadow-xl p-4 z-50">
                {user ? (
                  <div>
                    <div className="flex items-center gap-3 border-b border-black/5 pb-3 mb-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-dark truncate">{user.name}</p>
                        <p className="text-[0.65rem] text-text-muted truncate">{user.email}</p>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2">
                      <li>
                        <Link
                          to="/account"
                          onClick={() => setIsAccountOpen(false)}
                          className="text-xs text-text-muted hover:text-accent-gold transition-colors block py-1"
                        >
                          My Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/account"
                          onClick={() => setIsAccountOpen(false)}
                          className="text-xs text-text-muted hover:text-accent-gold transition-colors block py-1"
                        >
                          Order History
                        </Link>
                      </li>
                      <li className="border-t border-black/5 pt-2 mt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsAccountOpen(false);
                            navigate('/');
                          }}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5 w-full py-1 text-left"
                        >
                          <LogOut size={12} /> Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-dark">
                      Sign In / Register
                    </p>
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      className="py-1 px-2.5 text-xs rounded-sm"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="py-1 px-2.5 text-xs rounded-sm"
                    />
                    <button
                      type="submit"
                      className="btn-gold justify-center py-1.5 text-xs font-bold text-center w-full mt-1"
                    >
                      Authenticate
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Cart Bag Icon with badge animate popup */}
          <button
            onClick={openCart}
            className="text-text-dark hover:text-accent-gold transition-colors relative flex items-center"
            title="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-1.5 bg-accent-gold text-bg-dark text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center font-price-label border border-solid border-white ${
                  badgePop ? 'animate-badge-pop' : ''
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
export default Navbar;
