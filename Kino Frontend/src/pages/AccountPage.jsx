import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { Link, useNavigate } from 'react-router-dom';
import { User, ClipboardList, MapPin, LogOut, CheckCircle, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, orders, shippingAddress, logout, login } = useUserStore();
  const [activeTab, setActiveTab] = useState('orders');

  // Login form state (if visitor lands here logged out)
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      login(emailInput, nameInput.trim() || undefined);
      toast.success(`Welcome back!`);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
  };

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none">
      <div className="container">
        
        {/* Not Logged In Portal */}
        {!user ? (
          <div className="max-w-md mx-auto border border-solid border-black/5 rounded-sm p-8 bg-white shadow-md text-center flex flex-col gap-6">
            <div className="w-12 h-12 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center mx-auto">
              <User size={20} />
            </div>
            <div>
              <h2 className="font-editorial text-2xl font-bold">Atelier Dashboard</h2>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Log in with your email address to review your bespoke order history, saved addresses, and shipping logs.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Full Name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Julian Sterling"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="py-2 px-3 text-sm rounded-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="py-2 px-3 text-sm rounded-sm"
                />
              </div>

              <button type="submit" className="btn-gold justify-center py-2.5 font-bold tracking-widest text-xs uppercase mt-2">
                Enter Atelier
              </button>
            </form>
          </div>
        ) : (
          /* Dashboard Layout */
          <div>
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-black/5 pb-8 mb-10 gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border border-solid border-black/5"
                />
                <div>
                  <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
                    Client Account
                  </span>
                  <h1 className="font-editorial text-3xl font-bold text-text-dark">{user.name}</h1>
                  <p className="text-xs text-text-muted">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn-outline border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-transparent py-2 px-4 text-xs font-bold tracking-wider"
              >
                Sign Out
              </button>
            </div>

            {/* Dashboard grid panel */}
            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* Sidebar Tabs */}
              <aside className="w-full lg:w-1/4 flex lg:flex-col border-b lg:border-b-0 lg:border-r border-black/5 gap-2 pb-4 lg:pb-0 lg:pr-6">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors text-left ${
                    activeTab === 'orders' ? 'bg-[#0D0D0D] text-white' : 'text-text-muted hover:bg-black/5'
                  }`}
                >
                  <ClipboardList size={16} /> Order Logs ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('address')}
                  className={`flex items-center gap-3 py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors text-left ${
                    activeTab === 'address' ? 'bg-[#0D0D0D] text-white' : 'text-text-muted hover:bg-black/5'
                  }`}
                >
                  <MapPin size={16} /> Saved Address
                </button>
              </aside>

              {/* Main Tab Content */}
              <main className="w-full lg:w-3/4">
                
                {/* 1. Orders Tab Content */}
                {activeTab === 'orders' && (
                  <div className="flex flex-col gap-6 animate-fade-in">
                    <h3 className="font-editorial text-2xl font-bold uppercase tracking-wider border-b border-black/5 pb-2 mb-2">
                       Bespoke Order History
                    </h3>

                    {orders.length === 0 ? (
                      <div className="text-center py-12 bg-bg-light/20 border border-dashed border-black/10 rounded-sm">
                        <Package size={36} className="text-text-muted/40 mx-auto mb-3" />
                        <p className="font-editorial text-base italic text-text-muted">No past purchases logged.</p>
                        <Link to="/shop" className="text-xs uppercase tracking-widest text-accent-gold font-bold hover:underline mt-2 inline-block">
                          Start Curating
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        {orders.map((ord) => (
                          <div key={ord.id} className="border border-solid border-black/5 rounded-sm p-5 bg-white flex flex-col gap-4">
                            {/* Order Header info */}
                            <div className="flex flex-wrap items-center justify-between border-b border-black/5 pb-3 gap-2">
                              <div>
                                <span className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold">Reference</span>
                                <h4 className="font-price-label text-sm font-bold text-text-dark">{ord.id}</h4>
                              </div>
                              <div className="text-right">
                                <span className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold">Placed On</span>
                                <p className="text-xs font-bold text-text-dark font-price-label">{ord.date}</p>
                              </div>
                              <div>
                                <span className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold block text-right">Status</span>
                                <span className="text-[0.6rem] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-200 mt-0.5">
                                  <CheckCircle size={10} /> Dispatched
                                </span>
                              </div>
                            </div>

                            {/* Order Items list details */}
                            <div className="flex flex-col gap-3">
                              {ord.items.map((it) => (
                                <div key={`${it.id}-${it.selectedColor?.name || 'none'}-${it.selectedSize || 'none'}`} className="flex items-center justify-between text-xs text-text-muted">
                                  <span className="font-semibold text-text-dark">
                                    {it.name} <span className="font-normal font-price-label">({it.selectedSize} / {it.selectedColor?.name}) x{it.qty}</span>
                                  </span>
                                  <span className="font-price-label font-bold">${(it.price * it.qty).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>

                            {/* Total paid breakdown */}
                            <div className="flex justify-between items-baseline border-t border-black/5 pt-3 mt-1">
                              <span className="text-xs uppercase tracking-wider font-bold">Total Surcharge</span>
                              <span className="font-price-label text-sm font-bold text-accent-gold">${ord.pricing.total.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Address Tab Content */}
                {activeTab === 'address' && (
                  <div className="flex flex-col gap-6 animate-fade-in max-w-xl">
                    <h3 className="font-editorial text-2xl font-bold uppercase tracking-wider border-b border-black/5 pb-2 mb-2">
                      Saved Shipping Profile
                    </h3>

                    {shippingAddress ? (
                      <div className="bg-bg-light/45 p-6 border border-solid border-black/5 rounded-sm flex flex-col gap-3">
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-wider text-text-muted font-bold">Deliver To</p>
                          <p className="text-sm font-bold text-text-dark mt-0.5">
                            {shippingAddress.firstName} {shippingAddress.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-wider text-text-muted font-bold">Address Details</p>
                          <p className="text-sm text-text-muted mt-0.5 leading-relaxed">
                            {shippingAddress.address} {shippingAddress.apartment && `, ${shippingAddress.apartment}`} <br />
                            {shippingAddress.city}, {shippingAddress.zip} <br />
                            {shippingAddress.country}
                          </p>
                        </div>
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-wider text-text-muted font-bold">Contact Contact</p>
                          <p className="text-sm text-text-muted mt-0.5 font-price-label">
                            Phone: {shippingAddress.phone}
                          </p>
                        </div>
                        
                        <p className="text-[0.65rem] italic text-text-muted mt-3 pt-3 border-t border-black/5">
                          *Address will automatically populate during your checkout flow.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-bg-light/20 border border-dashed border-black/10 rounded-sm">
                        <MapPin size={36} className="text-text-muted/40 mx-auto mb-3" />
                        <p className="font-editorial text-base italic text-text-muted">No address details saved yet.</p>
                        <p className="text-xs text-text-muted mt-1 leading-normal max-w-xs mx-auto">
                          Completing checkout shipping forms will automatically record your details here.
                        </p>
                      </div>
                    )}
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
