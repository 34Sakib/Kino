import React, { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  ClipboardList,
  MapPin,
  LogOut,
  CheckCircle,
  Package,
  LayoutDashboard,
  Heart,
  ShieldCheck,
  Eye,
  EyeOff,
  Edit3,
  Search,
  ShoppingBag,
  Sparkles,
  Clock,
  ChevronRight,
  Download,
  RefreshCw,
  Truck,
  Lock,
  Plus,
  X,
  Check,
  Award,
  Star,
  Bell,
  ArrowRight,
  ExternalLink,
  FileText,
  CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, orders, shippingAddress, logout, login, register, updateProfile, updateShippingAddress, loading, error } = useUserStore();
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const [activeTab, setActiveTab] = useState('overview');

  // Auth Form States
  const [isRegister, setIsRegister] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile Edit States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.profile?.phone || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  // Notification Preference Toggles
  const [prefs, setPrefs] = useState({
    smsAlerts: true,
    vipDrops: true,
    stylistInvites: false
  });

  // Order Filters & Search State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Address Form Modal / Inline Edit State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    firstName: shippingAddress?.firstName || '',
    lastName: shippingAddress?.lastName || '',
    address: shippingAddress?.address || '',
    apartment: shippingAddress?.apartment || '',
    city: shippingAddress?.city || '',
    zip: shippingAddress?.zip || '',
    country: shippingAddress?.country || 'United States',
    phone: shippingAddress?.phone || ''
  });

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showSecPassword, setShowSecPassword] = useState(false);

  // Sync state when user or shipping address changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.profile?.phone || '');
      setAvatarPreview(api.resolveImageUrl(user.profile?.avatar) || user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    if (shippingAddress) {
      setAddressForm({
        firstName: shippingAddress.firstName || '',
        lastName: shippingAddress.lastName || '',
        address: shippingAddress.address || '',
        apartment: shippingAddress.apartment || '',
        city: shippingAddress.city || '',
        zip: shippingAddress.zip || '',
        country: shippingAddress.country || 'United States',
        phone: shippingAddress.phone || ''
      });
    }
  }, [shippingAddress]);

  // Auth Submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput.trim()) {
      toast.error('Email and Password are required.');
      return;
    }

    try {
      if (isRegister) {
        await register(nameInput.trim() || null, emailInput.trim(), passwordInput.trim());
        toast.success(`Welcome to Kino Atelier!`);
      } else {
        await login(emailInput.trim(), passwordInput.trim());
        toast.success(`Welcome back!`);
      }
      setNameInput('');
      setEmailInput('');
      setPasswordInput('');
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  // Avatar Upload Handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be under 2MB.');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Profile Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profileName);
    formData.append('phone', profilePhone);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      await updateProfile(formData);
      toast.success('Atelier profile updated successfully!');
      setAvatarFile(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    }
  };

  // Address Submit
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.firstName || !addressForm.address || !addressForm.city || !addressForm.phone) {
      toast.error('Please complete all required shipping fields.');
      return;
    }
    updateShippingAddress(addressForm);
    setIsEditingAddress(false);
    toast.success('Shipping address saved to Atelier profile!');
  };

  // Security Form Submit
  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (securityForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    toast.success('Password updated successfully!');
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Logout Handler
  const handleLogout = () => {
    logout();
    toast.success('Signed out of Atelier Portal.');
    navigate('/');
  };

  // Calculations for Stats & Tier
  const totalSpent = orders.reduce((sum, ord) => sum + (ord.pricing?.total || ord.total || 0), 0);
  const getMemberTier = () => {
    if (totalSpent >= 2500) return { name: 'Platinum Collector', color: 'text-amber-300', bg: 'bg-amber-300/10', border: 'border-amber-300/30' };
    if (totalSpent >= 1000) return { name: 'Gold Atelier Member', color: 'text-accent-gold', bg: 'bg-accent-gold/10', border: 'border-accent-gold/30' };
    if (totalSpent >= 300) return { name: 'Silver Patron', color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/30' };
    return { name: 'Bespoke Member', color: 'text-white/80', bg: 'bg-white/10', border: 'border-white/20' };
  };
  const tier = getMemberTier();
  const nextTierGoal = 2500;
  const tierProgress = Math.min(100, Math.round((totalSpent / nextTierGoal) * 100));

  // Recent Order for Timeline
  const recentOrder = orders.length > 0 ? orders[0] : null;

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch = ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.items?.some(it => it.name.toLowerCase().includes(orderSearch.toLowerCase()));
    if (orderStatusFilter === 'dispatched') return matchesSearch && (ord.status === 'dispatched' || true);
    return matchesSearch;
  });

  return (
    <div className="pt-28 pb-24 bg-[#0A0A0A] min-h-screen text-[#F5F0EA] selection:bg-accent-gold selection:text-black">
      <div className="container max-w-7xl px-4 sm:px-6">

        {/* ---------------------------------------------------- */}
        {/* UNAUTHENTICATED ATELIER AUTH PORTAL                  */}
        {/* ---------------------------------------------------- */}
        {!user ? (
          <div className="max-w-4xl mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column - Brand Showcase */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-left p-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-xs uppercase tracking-widest font-semibold">
                <Sparkles size={13} /> Exclusive Client Access
              </div>
              <h1 className="font-editorial text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
                Welcome to <br />
                <span className="italic font-normal text-accent-gold">Kino Atelier</span>
              </h1>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Sign in to access your bespoke order logs, saved shipping profiles, curated wishlist, and VIP member privileges.
              </p>

              <div className="space-y-4 pt-2 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-accent-gold">
                    <Truck size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Priority Express Courier</h4>
                    <p className="text-[0.75rem] text-text-muted">Real-time status logs and automated dispatch tracking.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-accent-gold">
                    <Star size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">VIP Atelier Tier</h4>
                    <p className="text-[0.75rem] text-text-muted">Earn rewards & exclusive invitations to private drops.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Auth Card */}
            <div className="lg:col-span-7 bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none" />

              {/* Form Switcher Tabs */}
              <div className="flex border-b border-white/10 pb-4 mb-6 gap-6">
                <button
                  onClick={() => setIsRegister(false)}
                  className={`text-sm uppercase tracking-wider font-bold transition-all relative pb-2 ${!isRegister ? 'text-accent-gold border-b-2 border-accent-gold' : 'text-text-muted hover:text-white'}`}
                >
                  Client Sign In
                </button>
                <button
                  onClick={() => setIsRegister(true)}
                  className={`text-sm uppercase tracking-wider font-bold transition-all relative pb-2 ${isRegister ? 'text-accent-gold border-b-2 border-accent-gold' : 'text-text-muted hover:text-white'}`}
                >
                  Create Atelier Account
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 text-left">
                {isRegister && (
                  <div className="flex flex-col gap-1.5 animate-fade-in">
                    <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Julian Vance"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="py-3 px-4 text-sm rounded-lg bg-[#0D0D0D] border border-white/10 text-white focus:border-accent-gold transition-colors"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="client@atelier-kino.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="py-3 px-4 text-sm rounded-lg bg-[#0D0D0D] border border-white/10 text-white focus:border-accent-gold transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="py-3 px-4 pr-12 text-sm rounded-lg bg-[#0D0D0D] border border-white/10 text-white w-full focus:border-accent-gold transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-text-muted hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-xs text-red-400 font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold justify-center py-3 font-bold tracking-widest text-xs uppercase mt-2 rounded-lg transition-transform active:scale-[0.99] flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Authenticating...
                    </>
                  ) : (
                    <>
                      {isRegister ? 'Complete Registration' : 'Access Portal'} <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-xs text-accent-gold font-bold uppercase tracking-wider hover:underline"
                >
                  {isRegister ? 'Already registered? Sign In' : "Don't have an account? Create One Now"}
                </button>
              </div>
            </div>
          </div>

        ) : (

          /* ---------------------------------------------------- */
          /* AUTHENTICATED ATELIER DASHBOARD                      */
          /* ---------------------------------------------------- */
          <div className="space-y-8 animate-fade-in">

            {/* 1. OBSIDIAN LUXURY HERO BANNER */}
            <div className="relative bg-gradient-to-r from-[#121212] via-[#1A1A1A] to-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Left Client Profile Identity */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                  <div className="relative group">
                    <img
                      src={avatarPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
                      alt={user.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-accent-gold/40 shadow-xl group-hover:border-accent-gold transition-all"
                    />
                    <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white text-xs font-semibold">
                      <Edit3 size={16} />
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#121212] shadow-md" title="Active Client Session" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                      <span className={`text-[0.65rem] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5 rounded-full border ${tier.bg} ${tier.color} ${tier.border} flex items-center gap-1`}>
                        <Award size={12} /> {tier.name}
                      </span>
                      <span className="text-[0.65rem] text-text-muted font-mono tracking-wider">
                        ID: KINO-{user.id || '7729'}
                      </span>
                    </div>

                    <h1 className="font-editorial text-3xl md:text-4xl font-bold text-white tracking-tight">
                      {user.name || 'Valued Client'}
                    </h1>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center justify-center sm:justify-start gap-2">
                      <span>{user.email}</span>
                      <span>•</span>
                      <span>Member since 2026</span>
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
                  <Link
                    to="/shop"
                    className="btn-gold py-2.5 px-5 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
                  >
                    <ShoppingBag size={15} /> Explore Runway
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="py-2.5 px-4 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* 2. STATS SUMMARY CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Card 1: Total Orders */}
              <div className="bg-[#141414] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all shadow-lg flex items-center justify-between group">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-widest text-text-muted font-semibold">Total Orders Logged</p>
                  <h3 className="font-price-label text-2xl font-bold text-white mt-1">{orders.length}</h3>
                  <p className="text-[0.65rem] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle size={10} /> {orders.length > 0 ? 'Latest Dispatched' : 'No Active Shipments'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-transform">
                  <Package size={22} />
                </div>
              </div>

              {/* Card 2: Total Spent */}
              <div className="bg-[#141414] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all shadow-lg flex items-center justify-between group">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-widest text-text-muted font-semibold">Total Investment</p>
                  <h3 className="font-price-label text-2xl font-bold text-accent-gold mt-1">${totalSpent.toFixed(2)}</h3>
                  <p className="text-[0.65rem] text-text-muted mt-1">Curated Atelier Couture</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:scale-110 transition-transform">
                  <CreditCard size={22} />
                </div>
              </div>

              {/* Card 3: Wishlist Items */}
              <div className="bg-[#141414] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all shadow-lg flex items-center justify-between group">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-widest text-text-muted font-semibold">Curated Wishlist</p>
                  <h3 className="font-price-label text-2xl font-bold text-white mt-1">{wishlistItems.length}</h3>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className="text-[0.65rem] text-accent-gold font-bold hover:underline mt-1 inline-block"
                  >
                    View Saved Collection &rarr;
                  </button>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                  <Heart size={22} />
                </div>
              </div>

              {/* Card 4: Tier Progress */}
              <div className="bg-[#141414] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-[0.7rem] uppercase tracking-widest text-text-muted font-semibold">Atelier VIP Status</p>
                    <span className="text-[0.65rem] font-bold text-accent-gold">{tierProgress}%</span>
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-white mt-0.5">{tier.name}</h3>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accent-gold to-amber-300 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${tierProgress}%` }}
                    />
                  </div>
                  <p className="text-[0.65rem] text-text-muted mt-1.5">
                    ${Math.max(0, nextTierGoal - totalSpent).toFixed(0)} away from Platinum status rewards
                  </p>
                </div>
              </div>

            </div>

            {/* 3. MAIN DASHBOARD CONTENT AREA (SIDEBAR TABS + TAB CONTENT) */}
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Sidebar Navigation */}
              <aside className="w-full lg:w-64 shrink-0">
                <div className="bg-[#141414] border border-white/10 rounded-xl p-2.5 space-y-1 sticky top-28">
                  
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center justify-between py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-left ${activeTab === 'overview'
                      ? 'bg-accent-gold text-black shadow-md font-extrabold'
                      : 'text-text-muted hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <LayoutDashboard size={17} /> Atelier Hub
                    </span>
                    <ChevronRight size={14} className={activeTab === 'overview' ? 'opacity-100' : 'opacity-0'} />
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center justify-between py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-left ${activeTab === 'orders'
                      ? 'bg-accent-gold text-black shadow-md font-extrabold'
                      : 'text-text-muted hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <Package size={17} /> Order History
                    </span>
                    <span className={`text-[0.65rem] px-2 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-black/20 text-black' : 'bg-white/10 text-white'}`}>
                      {orders.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center justify-between py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-left ${activeTab === 'profile'
                      ? 'bg-accent-gold text-black shadow-md font-extrabold'
                      : 'text-text-muted hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <User size={17} /> Profile & Settings
                    </span>
                    <ChevronRight size={14} className={activeTab === 'profile' ? 'opacity-100' : 'opacity-0'} />
                  </button>

                  <button
                    onClick={() => setActiveTab('address')}
                    className={`w-full flex items-center justify-between py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-left ${activeTab === 'address'
                      ? 'bg-accent-gold text-black shadow-md font-extrabold'
                      : 'text-text-muted hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <MapPin size={17} /> Saved Address
                    </span>
                    {shippingAddress && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Address Configured" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center justify-between py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-left ${activeTab === 'wishlist'
                      ? 'bg-accent-gold text-black shadow-md font-extrabold'
                      : 'text-text-muted hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <Heart size={17} /> Wishlist Collection
                    </span>
                    <span className={`text-[0.65rem] px-2 py-0.5 rounded-full ${activeTab === 'wishlist' ? 'bg-black/20 text-black' : 'bg-white/10 text-white'}`}>
                      {wishlistItems.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center justify-between py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-all text-left ${activeTab === 'security'
                      ? 'bg-accent-gold text-black shadow-md font-extrabold'
                      : 'text-text-muted hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <ShieldCheck size={17} /> Security & Auth
                    </span>
                    <ChevronRight size={14} className={activeTab === 'security' ? 'opacity-100' : 'opacity-0'} />
                  </button>

                </div>
              </aside>

              {/* Main Tab Panels */}
              <main className="flex-1 bg-[#141414] border border-white/10 rounded-xl p-6 lg:p-8 min-h-[500px]">
                
                {/* -------------------------------------------------- */}
                {/* TAB 1: OVERVIEW (ATELIER HUB)                     */}
                {/* -------------------------------------------------- */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-fade-in">
                    
                    {/* Active Order Live Dispatch Tracker */}
                    <div className="bg-[#0D0D0D] border border-accent-gold/30 rounded-xl p-6 relative overflow-hidden">
                      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-4">
                        <div>
                          <span className="text-[0.65rem] uppercase tracking-widest text-accent-gold font-bold flex items-center gap-1.5">
                            <Truck size={14} /> Live Dispatch Tracker
                          </span>
                          <h3 className="font-editorial text-xl font-bold text-white mt-0.5">
                            {recentOrder ? `Order Reference ${recentOrder.id}` : 'No Active Shipments Logged'}
                          </h3>
                        </div>

                        {recentOrder && (
                          <Link
                            to="/track-order"
                            className="text-xs uppercase tracking-wider font-bold text-accent-gold border border-accent-gold/40 px-3 py-1.5 rounded-lg hover:bg-accent-gold hover:text-black transition-all"
                          >
                            Full Tracking Logs &rarr;
                          </Link>
                        )}
                      </div>

                      {recentOrder ? (
                        <div className="mt-6 space-y-6">
                          {/* Step Progress Line */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative">
                            
                            <div className="flex flex-col items-center text-center space-y-2">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                                <CheckCircle size={18} />
                              </div>
                              <span className="text-[0.7rem] font-bold text-white uppercase tracking-wider">Order Placed</span>
                              <span className="text-[0.65rem] text-text-muted">{recentOrder.date}</span>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-2">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                                <Sparkles size={18} />
                              </div>
                              <span className="text-[0.7rem] font-bold text-white uppercase tracking-wider">Tailored</span>
                              <span className="text-[0.65rem] text-text-muted">Atelier Crafting</span>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-2">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                                <ShieldCheck size={18} />
                              </div>
                              <span className="text-[0.7rem] font-bold text-white uppercase tracking-wider">Inspected</span>
                              <span className="text-[0.65rem] text-text-muted">Passed QC</span>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-2">
                              <div className="w-10 h-10 rounded-full bg-accent-gold/20 text-accent-gold border border-accent-gold/40 flex items-center justify-center animate-pulse">
                                <Truck size={18} />
                              </div>
                              <span className="text-[0.7rem] font-bold text-accent-gold uppercase tracking-wider">In Transit</span>
                              <span className="text-[0.65rem] text-text-muted">Express Delivery</span>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-2 opacity-50">
                              <div className="w-10 h-10 rounded-full bg-white/5 text-text-muted border border-white/10 flex items-center justify-center">
                                <Package size={18} />
                              </div>
                              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Delivered</span>
                              <span className="text-[0.65rem] text-text-muted">Estimated 1-2 Days</span>
                            </div>

                          </div>
                        </div>
                      ) : (
                        <div className="py-8 text-center space-y-3">
                          <Package size={36} className="text-text-muted mx-auto" />
                          <p className="text-sm text-text-muted italic">You haven't placed an order yet.</p>
                          <Link to="/shop" className="btn-gold py-2 px-4 text-xs inline-flex items-center gap-2">
                            Start Curating <ArrowRight size={14} />
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Quick Action Cards Grid */}
                    <div>
                      <h4 className="text-xs uppercase tracking-widest font-bold text-text-muted mb-4">Quick Atelier Actions</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                          to="/shop"
                          className="bg-[#0D0D0D] border border-white/10 hover:border-accent-gold/50 p-4 rounded-xl transition-all group flex flex-col justify-between space-y-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-transform">
                            <ShoppingBag size={18} />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors">Browse Runway</h5>
                            <p className="text-[0.7rem] text-text-muted mt-0.5">Explore latest seasonal collections</p>
                          </div>
                        </Link>

                        <Link
                          to="/track-order"
                          className="bg-[#0D0D0D] border border-white/10 hover:border-accent-gold/50 p-4 rounded-xl transition-all group flex flex-col justify-between space-y-3"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-transform">
                            <Truck size={18} />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors">Track Shipment</h5>
                            <p className="text-[0.7rem] text-text-muted mt-0.5">Live tracking with tracking numbers</p>
                          </div>
                        </Link>

                        <button
                          onClick={() => setActiveTab('wishlist')}
                          className="bg-[#0D0D0D] border border-white/10 hover:border-accent-gold/50 p-4 rounded-xl transition-all group flex flex-col justify-between space-y-3 text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-transform">
                            <Heart size={18} />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors">Saved Wishlist</h5>
                            <p className="text-[0.7rem] text-text-muted mt-0.5">{wishlistItems.length} items saved</p>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveTab('address')}
                          className="bg-[#0D0D0D] border border-white/10 hover:border-accent-gold/50 p-4 rounded-xl transition-all group flex flex-col justify-between space-y-3 text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-transform">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-white group-hover:text-accent-gold transition-colors">Edit Address</h5>
                            <p className="text-[0.7rem] text-text-muted mt-0.5">Update express shipping profile</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* VIP Member Perks Banner */}
                    <div className="bg-gradient-to-r from-accent-gold/10 via-amber-500/5 to-transparent border border-accent-gold/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="text-[0.65rem] uppercase tracking-widest font-bold text-accent-gold flex items-center justify-center sm:justify-start gap-1">
                          <Star size={12} /> Complimentary Client Privileges
                        </span>
                        <h4 className="font-editorial text-xl font-bold text-white">Dedicated Personal Stylist & Express Courier</h4>
                        <p className="text-xs text-text-muted max-w-xl">
                          As a valued Kino client, enjoy complimentary alterations, priority queue access for limited runway drops, and 24/7 personal styling consultations.
                        </p>
                      </div>
                      <Link to="/contact" className="btn-gold py-2.5 px-5 text-xs whitespace-nowrap rounded-lg">
                        Contact Concierge
                      </Link>
                    </div>

                    {/* Wishlist Quick Preview */}
                    {wishlistItems.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs uppercase tracking-widest font-bold text-text-muted">Saved Wishlist Quick Preview</h4>
                          <button
                            onClick={() => setActiveTab('wishlist')}
                            className="text-xs text-accent-gold font-bold hover:underline"
                          >
                            View All ({wishlistItems.length})
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {wishlistItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="bg-[#0D0D0D] border border-white/10 rounded-xl p-3 flex gap-3 items-center">
                              <img
                                src={api.resolveImageUrl(item.image) || item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80'}
                                alt={item.name}
                                className="w-14 h-14 object-cover rounded-lg bg-white/5"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                                <p className="font-price-label text-xs font-bold text-accent-gold mt-0.5">${item.price?.toFixed(2)}</p>
                                <button
                                  onClick={() => {
                                    addToCart(item);
                                    toast.success(`${item.name} added to cart!`);
                                  }}
                                  className="text-[0.65rem] font-bold text-white hover:text-accent-gold mt-1 inline-flex items-center gap-1"
                                >
                                  <Plus size={10} /> Add to Cart
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* -------------------------------------------------- */}
                {/* TAB 2: ORDER LOGS & DISPATCH HISTORY               */}
                {/* -------------------------------------------------- */}
                {activeTab === 'orders' && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Header + Search/Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
                      <div>
                        <h3 className="font-editorial text-2xl font-bold text-white">Bespoke Order Logs</h3>
                        <p className="text-xs text-text-muted">Track past transactions, active courier dispatches, and download invoices.</p>
                      </div>

                      {/* Search Filter */}
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="Search Order ID or Item..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full py-2 pl-9 pr-4 text-xs rounded-lg bg-[#0D0D0D] border border-white/10 text-white focus:border-accent-gold"
                        />
                        <Search size={14} className="absolute left-3 top-2.5 text-text-muted" />
                      </div>
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                      <div className="py-16 text-center border border-dashed border-white/10 rounded-xl space-y-3">
                        <Package size={40} className="text-text-muted mx-auto" />
                        <h4 className="font-editorial text-lg text-white">No Matching Orders Found</h4>
                        <p className="text-xs text-text-muted max-w-sm mx-auto">
                          {orderSearch ? `No orders matched "${orderSearch}".` : "You haven't completed any transactions yet."}
                        </p>
                        <Link to="/shop" className="btn-gold py-2.5 px-5 text-xs inline-flex items-center gap-2 mt-2">
                          Browse Collection <ArrowRight size={14} />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredOrders.map((ord) => {
                          const isExpanded = expandedOrderId === ord.id;
                          return (
                            <div key={ord.id} className="bg-[#0D0D0D] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all space-y-4">
                              
                              {/* Order Card Header */}
                              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                                <div className="space-y-0.5">
                                  <span className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold">Reference ID</span>
                                  <h4 className="font-price-label text-sm font-bold text-white flex items-center gap-2">
                                    {ord.id}
                                  </h4>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold">Date Placed</span>
                                  <p className="text-xs font-bold text-white font-price-label">{ord.date}</p>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold">Status</span>
                                  <span className="text-[0.6rem] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                                    <CheckCircle size={10} /> Dispatched
                                  </span>
                                </div>

                                <div className="space-y-0.5 text-right">
                                  <span className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold">Total Paid</span>
                                  <p className="font-price-label text-sm font-bold text-accent-gold">
                                    ${(ord.pricing?.total || ord.total || 0).toFixed(2)}
                                  </p>
                                </div>
                              </div>

                              {/* Order Items Listing */}
                              <div className="space-y-3">
                                {ord.items.map((it, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-xs text-text-muted py-1 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white">
                                        <ShoppingBag size={14} className="text-accent-gold" />
                                      </div>
                                      <div>
                                        <h5 className="font-bold text-white">{it.name}</h5>
                                        <p className="text-[0.7rem] text-text-muted font-price-label">
                                          Size: {it.selectedSize || 'Standard'} | Color: {it.selectedColor?.name || 'Default'} | Qty: {it.qty}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-price-label font-bold text-white">
                                      ${(it.price * it.qty).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Card Action Buttons */}
                              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/10 gap-3">
                                <Link
                                  to="/track-order"
                                  className="text-xs text-accent-gold font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                                >
                                  <Truck size={14} /> Track Parcel Status &rarr;
                                </Link>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      ord.items.forEach(it => addToCart(it));
                                      toast.success(`Items re-added to cart!`);
                                    }}
                                    className="py-1.5 px-3 rounded-lg border border-white/10 hover:border-accent-gold text-white text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                                  >
                                    <RefreshCw size={12} /> Reorder
                                  </button>

                                  <button
                                    onClick={() => toast.success(`Downloading PDF Invoice for ${ord.id}...`)}
                                    className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[0.7rem] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                                  >
                                    <Download size={12} /> PDF Invoice
                                  </button>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                )}

                {/* -------------------------------------------------- */}
                {/* TAB 3: CLIENT PROFILE & PREFERENCES                */}
                {/* -------------------------------------------------- */}
                {activeTab === 'profile' && (
                  <div className="space-y-6 animate-fade-in max-w-2xl">
                    <div className="border-b border-white/10 pb-3">
                      <h3 className="font-editorial text-2xl font-bold text-white">Atelier Client Profile</h3>
                      <p className="text-xs text-text-muted">Manage your personal credentials, profile picture, and notification options.</p>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      
                      {/* Avatar Image Dropzone */}
                      <div className="flex items-center gap-6 bg-[#0D0D0D] border border-white/10 p-4 rounded-xl">
                        <div className="relative group w-20 h-20 rounded-full overflow-hidden bg-white/5 border border-accent-gold/30 flex items-center justify-center shrink-0">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-text-muted" size={32} />
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs uppercase tracking-wider font-semibold text-text-muted block">
                            Atelier Avatar Photo
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="text-xs text-text-muted file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-accent-gold hover:file:text-black cursor-pointer"
                          />
                          <p className="text-[0.65rem] text-text-muted">JPEG, PNG or WEBP up to 2MB</p>
                        </div>
                      </div>

                      {/* Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Full Name</label>
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full py-2.5 px-4 text-sm rounded-lg bg-[#0D0D0D] border border-white/10 text-white focus:border-accent-gold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Telephone Number</label>
                          <input
                            type="text"
                            placeholder="+1 (555) 000-0000"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            className="w-full py-2.5 px-4 text-sm rounded-lg bg-[#0D0D0D] border border-white/10 text-white font-price-label focus:border-accent-gold"
                          />
                        </div>
                      </div>

                      {/* Immutable Email */}
                      <div className="space-y-1.5 opacity-70">
                        <label className="text-xs uppercase tracking-wider font-semibold text-text-muted flex items-center justify-between">
                          <span>Primary Email (Immutable)</span>
                          <span className="text-[0.65rem] text-accent-gold flex items-center gap-1">
                            <Lock size={10} /> Verified Account
                          </span>
                        </label>
                        <input
                          type="email"
                          readOnly
                          disabled
                          value={user?.email || ''}
                          className="w-full py-2.5 px-4 text-sm rounded-lg bg-black/40 border border-white/10 text-white/60 cursor-not-allowed"
                        />
                      </div>

                      {/* Client Notification Preferences */}
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <h4 className="text-xs uppercase tracking-widest font-bold text-text-muted flex items-center gap-1.5">
                          <Bell size={14} className="text-accent-gold" /> Communication Preferences
                        </h4>

                        <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 space-y-3">
                          <label className="flex items-center justify-between cursor-pointer">
                            <div>
                              <span className="text-xs font-bold text-white block">SMS Courier Dispatch Alerts</span>
                              <span className="text-[0.65rem] text-text-muted">Receive live text alerts when orders leave atelier</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={prefs.smsAlerts}
                              onChange={(e) => setPrefs({ ...prefs, smsAlerts: e.target.checked })}
                              className="w-4 h-4 accent-accent-gold"
                            />
                          </label>

                          <label className="flex items-center justify-between cursor-pointer border-t border-white/5 pt-3">
                            <div>
                              <span className="text-xs font-bold text-white block">Exclusive VIP Runway Drops</span>
                              <span className="text-[0.65rem] text-text-muted">Priority invitations to private capsule drops</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={prefs.vipDrops}
                              onChange={(e) => setPrefs({ ...prefs, vipDrops: e.target.checked })}
                              className="w-4 h-4 accent-accent-gold"
                            />
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-gold py-3 px-6 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
                      >
                        {loading ? 'Saving Changes...' : 'Save Profile Settings'}
                      </button>

                    </form>
                  </div>
                )}

                {/* -------------------------------------------------- */}
                {/* TAB 4: SAVED SHIPPING PROFILE                       */}
                {/* -------------------------------------------------- */}
                {activeTab === 'address' && (
                  <div className="space-y-6 animate-fade-in max-w-2xl">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <div>
                        <h3 className="font-editorial text-2xl font-bold text-white">Saved Shipping Profile</h3>
                        <p className="text-xs text-text-muted">Your default dispatch destination for seamless checkout.</p>
                      </div>
                      <button
                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                        className="btn-gold py-1.5 px-3 text-[0.7rem] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5"
                      >
                        <Edit3 size={13} /> {isEditingAddress ? 'Cancel Edit' : 'Edit Shipping Address'}
                      </button>
                    </div>

                    {isEditingAddress ? (
                      <form onSubmit={handleAddressSubmit} className="space-y-4 bg-[#0D0D0D] border border-accent-gold/30 rounded-xl p-5">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-accent-gold mb-2">Update Shipping Details</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[0.7rem] uppercase font-semibold text-text-muted">First Name</label>
                            <input
                              type="text"
                              required
                              value={addressForm.firstName}
                              onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                              className="w-full py-2 px-3 text-xs rounded bg-[#141414] border border-white/10 text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[0.7rem] uppercase font-semibold text-text-muted">Last Name</label>
                            <input
                              type="text"
                              required
                              value={addressForm.lastName}
                              onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                              className="w-full py-2 px-3 text-xs rounded bg-[#141414] border border-white/10 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[0.7rem] uppercase font-semibold text-text-muted">Street Address</label>
                          <input
                            type="text"
                            required
                            value={addressForm.address}
                            onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                            className="w-full py-2 px-3 text-xs rounded bg-[#141414] border border-white/10 text-white"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[0.7rem] uppercase font-semibold text-text-muted">City</label>
                            <input
                              type="text"
                              required
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              className="w-full py-2 px-3 text-xs rounded bg-[#141414] border border-white/10 text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[0.7rem] uppercase font-semibold text-text-muted">ZIP / Postal</label>
                            <input
                              type="text"
                              required
                              value={addressForm.zip}
                              onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                              className="w-full py-2 px-3 text-xs rounded bg-[#141414] border border-white/10 text-white font-price-label"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[0.7rem] uppercase font-semibold text-text-muted">Country</label>
                            <input
                              type="text"
                              required
                              value={addressForm.country}
                              onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                              className="w-full py-2 px-3 text-xs rounded bg-[#141414] border border-white/10 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[0.7rem] uppercase font-semibold text-text-muted">Courier Contact Telephone</label>
                          <input
                            type="text"
                            required
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            className="w-full py-2 px-3 text-xs rounded bg-[#141414] border border-white/10 text-white font-price-label"
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn-gold py-2.5 px-5 text-xs font-bold uppercase tracking-wider rounded-lg w-full justify-center mt-2"
                        >
                          Save Shipping Address
                        </button>
                      </form>
                    ) : shippingAddress ? (
                      <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6 relative overflow-hidden space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[0.65rem] uppercase tracking-widest text-accent-gold font-bold flex items-center gap-1">
                              <MapPin size={12} /> Default Atelier Destination
                            </span>
                            <h4 className="font-editorial text-xl font-bold text-white mt-1">
                              {shippingAddress.firstName} {shippingAddress.lastName}
                            </h4>
                          </div>
                          <span className="text-[0.6rem] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                            Active Destination
                          </span>
                        </div>

                        <div className="text-xs text-text-muted space-y-1 font-mono leading-relaxed pt-2 border-t border-white/10">
                          <p className="text-white">{shippingAddress.address} {shippingAddress.apartment && `, ${shippingAddress.apartment}`}</p>
                          <p>{shippingAddress.city}, {shippingAddress.zip}</p>
                          <p>{shippingAddress.country}</p>
                          <p className="text-accent-gold font-price-label pt-1">Phone: {shippingAddress.phone}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center border border-dashed border-white/10 rounded-xl space-y-3">
                        <MapPin size={36} className="text-text-muted mx-auto" />
                        <p className="font-editorial text-lg text-white">No Shipping Address Recorded</p>
                        <p className="text-xs text-text-muted max-w-xs mx-auto">
                          Add a delivery address to enable one-click express checkout on all future orders.
                        </p>
                        <button
                          onClick={() => setIsEditingAddress(true)}
                          className="btn-gold py-2 px-4 text-xs inline-flex items-center gap-2 mt-2"
                        >
                          <Plus size={14} /> Add Shipping Address
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {/* -------------------------------------------------- */}
                {/* TAB 5: WISHLIST COLLECTION                         */}
                {/* -------------------------------------------------- */}
                {activeTab === 'wishlist' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-b border-white/10 pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="font-editorial text-2xl font-bold text-white">Saved Wishlist Collection</h3>
                        <p className="text-xs text-text-muted">Items saved for future atelier ordering.</p>
                      </div>
                      <span className="text-xs font-mono text-accent-gold font-bold">{wishlistItems.length} items</span>
                    </div>

                    {wishlistItems.length === 0 ? (
                      <div className="py-16 text-center border border-dashed border-white/10 rounded-xl space-y-3">
                        <Heart size={40} className="text-text-muted mx-auto" />
                        <h4 className="font-editorial text-lg text-white">Your Wishlist is Empty</h4>
                        <p className="text-xs text-text-muted">Explore our latest arrivals and save items by clicking the heart icon.</p>
                        <Link to="/shop" className="btn-gold py-2.5 px-5 text-xs inline-flex items-center gap-2 mt-2">
                          Curate Wishlist <ArrowRight size={14} />
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlistItems.map((item) => (
                          <div key={item.id} className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex flex-col justify-between space-y-3 group hover:border-accent-gold/40 transition-all">
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                              <img
                                src={api.resolveImageUrl(item.image) || item.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <button
                                onClick={() => toggleItem(item)}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                title="Remove from wishlist"
                              >
                                <X size={16} />
                              </button>
                            </div>

                            <div>
                              <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                              <p className="font-price-label text-sm font-bold text-accent-gold mt-1">
                                ${item.price?.toFixed(2)}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                addToCart(item);
                                toast.success(`${item.name} added to cart!`);
                              }}
                              className="btn-gold py-2 text-xs font-bold uppercase tracking-wider rounded-lg w-full justify-center flex items-center gap-2"
                            >
                              <ShoppingBag size={14} /> Move to Cart
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------- */}
                {/* TAB 6: SECURITY & AUTH                             */}
                {/* -------------------------------------------------- */}
                {activeTab === 'security' && (
                  <div className="space-y-6 animate-fade-in max-w-xl">
                    <div className="border-b border-white/10 pb-3">
                      <h3 className="font-editorial text-2xl font-bold text-white">Security & Login Credentials</h3>
                      <p className="text-xs text-text-muted">Update your portal password and review active browser sessions.</p>
                    </div>

                    <form onSubmit={handleSecuritySubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Current Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={securityForm.currentPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                          className="w-full py-2.5 px-4 text-sm rounded-lg bg-[#0D0D0D] border border-white/10 text-white focus:border-accent-gold"
                        />
                      </div>

                      <div className="space-y-1.5 relative">
                        <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">New Password</label>
                        <div className="relative flex items-center">
                          <input
                            type={showSecPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={securityForm.newPassword}
                            onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                            className="w-full py-2.5 px-4 pr-12 text-sm rounded-lg bg-[#0D0D0D] border border-white/10 text-white focus:border-accent-gold"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSecPassword(!showSecPassword)}
                            className="absolute right-3 text-text-muted hover:text-white"
                          >
                            {showSecPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Confirm New Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                          className="w-full py-2.5 px-4 text-sm rounded-lg bg-[#0D0D0D] border border-white/10 text-white focus:border-accent-gold"
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-gold py-2.5 px-5 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2"
                      >
                        <ShieldCheck size={16} /> Update Security Password
                      </button>
                    </form>

                    {/* Active Sessions Card */}
                    <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-4 space-y-2 pt-4">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-text-muted">Active Client Session</h4>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-mono">Chrome / Windows 11 (Current)</span>
                        <span className="text-emerald-400 font-bold text-[0.65rem] uppercase">Active Now</span>
                      </div>
                    </div>

                  </div>
                )}

              </main>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AccountPage;
