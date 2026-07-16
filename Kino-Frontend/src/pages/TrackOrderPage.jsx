import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { Button } from '../components/shared/Button';
import { Package, Truck, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

import api from '../utils/api';

// Create a helper mock fallback order for demonstration
const MOCK_FALLBACK_ORDER = {
  id: 'ORD-888888',
  status: 'In Transit',
  carrier: 'Kino Premium Delivery',
  tracking_number: 'TRK-992837492',
  milestones: [
    { label: 'Authorized', date: 'June 28 at 10:30 AM (Kino Atelier Center)', detail: 'Payment validation and checkout log authorized.', completed: true },
    { label: 'Processing', date: 'June 28 at 2:40 PM (Kino Atelier Center)', detail: 'Atelier team began carving the stone layers.', completed: true },
    { label: 'Dispatched', date: 'June 29 at 9:15 AM (Kino Atelier Center)', detail: 'Transferred to global shipping carrier.', completed: true },
    { label: 'In Transit', date: 'July 01 at 4:32 PM (In Transit)', detail: 'Package has departed Copenhagen terminal.', completed: true }
  ]
};

export const TrackOrderPage = () => {
  const [orderQuery, setOrderQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = orderQuery.trim().toUpperCase();
    const email = emailQuery.trim().toLowerCase();

    if (!cleanQuery || !email) return;

    if (cleanQuery === 'ORD-888888' || cleanQuery === 'DEMO') {
      setSearchedOrder(MOCK_FALLBACK_ORDER);
      toast.success('Demo order status retrieved.');
      return;
    }

    setLoading(true);

    api.get(`/orders/track/${cleanQuery}?email=${encodeURIComponent(email)}`)
      .then(res => {
        const decorated = {
          id: res.order_number,
          status: res.status,
          carrier: res.carrier,
          tracking_number: res.tracking_number,
          milestones: res.history.map(h => ({
            label: h.status,
            date: `${h.date} at ${h.time} (${h.location})`,
            detail: h.detail,
            completed: true
          }))
        };
        setSearchedOrder(decorated);
        setLoading(false);
        toast.success('Order tracking retrieved.');
      })
      .catch(err => {
        toast.error(err.message || 'No order found matching those credentials.');
        setSearchedOrder(null);
        setLoading(false);
      });
  };

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none animate-fade-in">
      <div className="container max-w-2xl">
        
        {/* Header */}
        <div className="mb-10 text-center flex flex-col items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Shipment Ledger
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl font-medium text-text-dark">
            Track Your Order
          </h1>
          <div className="w-12 h-[1px] bg-accent-gold mt-4" />
        </div>

        {/* Query Input */}
        <form onSubmit={handleTrackSubmit} className="bg-bg-light/45 border border-solid border-black/5 rounded-sm p-6 flex flex-col gap-4 mb-10">
          <p className="text-xs text-text-muted leading-relaxed">
            Enter your order reference code and the billing email address to inspect real-time shipping milestones and dispatch status logs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted">Order Code</label>
              <input
                type="text"
                required
                placeholder="e.g. ORD-2026-12345"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="py-2 px-3 text-xs uppercase tracking-wider rounded-sm font-price-label"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted">Billing Email</label>
              <input
                type="email"
                required
                placeholder="e.g. collector@example.com"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                className="py-2 px-3 text-xs rounded-sm"
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <Button 
              type="submit" 
              variant="gold" 
              disabled={loading}
              className="px-6 font-bold uppercase tracking-wider text-[0.65rem] h-9"
            >
              {loading ? 'Searching...' : (
                <>
                  <Search size={12} className="mr-1" /> Find Order
                </>
              )}
            </Button>
          </div>
        </form>

        {searchedOrder ? (
          /* Order Track Results */
          <div className="border border-solid border-black/5 rounded-sm p-6 bg-white flex flex-col gap-8 animate-fade-in">
            
            {/* Status overview */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-4">
              <div>
                <span className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold">Reference code</span>
                <h4 className="font-price-label text-base font-bold text-text-dark">{searchedOrder.id}</h4>
              </div>
              {searchedOrder.tracking_number && (
                <div>
                  <span className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold">Carrier / Tracking</span>
                  <p className="text-[0.7rem] font-bold text-text-dark font-price-label mt-0.5">{searchedOrder.carrier} - {searchedOrder.tracking_number}</p>
                </div>
              )}
              <div className="text-right">
                <span className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold">Current State</span>
                <p className="text-sm font-bold text-accent-gold uppercase tracking-widest mt-0.5">{searchedOrder.status}</p>
              </div>
            </div>

            {/* Stepper Progress Visualizer */}
            <div className="flex flex-col gap-6 pl-4 relative">
              {/* Stepper vertical line */}
              <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-black/5 z-0" />
              
              {searchedOrder.milestones.map((m, idx) => (
                <div key={idx} className="flex gap-4 items-start relative z-10">
                  <div className={`w-5 h-5 rounded-full border-2 border-solid flex items-center justify-center flex-shrink-0 bg-white ${
                    m.completed ? 'border-accent-gold text-accent-gold' : 'border-black/10 text-text-muted'
                  }`}>
                    {m.completed ? <CheckCircle2 size={10} fill="currentColor" className="text-white" /> : <div className="w-1.5 h-1.5 bg-black/15 rounded-full" />}
                  </div>
                  <div className="min-w-0">
                    <h5 className={`text-xs font-bold ${m.completed ? 'text-text-dark' : 'text-text-muted'}`}>
                      {m.label}
                    </h5>
                    <p className="text-[0.65rem] text-text-muted mt-0.5 font-price-label">{m.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Surcharge summary */}
            <div className="border-t border-black/5 pt-6 flex flex-col gap-4">
              <h4 className="font-editorial text-sm font-bold uppercase tracking-wider">Package Contents</h4>
              <div className="flex flex-col gap-2 text-xs">
                {searchedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-text-muted">
                    <span>{item.name} x{item.qty}</span>
                    <span className="font-price-label font-bold">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-baseline font-bold border-t border-black/5 pt-3 mt-1 text-sm text-text-dark">
                  <span>Grand Total</span>
                  <span className="text-accent-gold font-price-label">${searchedOrder.pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Destination summary */}
            <div className="border-t border-black/5 pt-6 text-xs flex flex-col gap-2">
              <h4 className="font-editorial text-sm font-bold uppercase tracking-wider">Delivery Destination</h4>
              <p className="text-text-muted leading-relaxed">
                {searchedOrder.shipping.firstName} {searchedOrder.shipping.lastName} <br />
                {searchedOrder.shipping.address} <br />
                {searchedOrder.shipping.city}, {searchedOrder.shipping.zip} <br />
                {searchedOrder.shipping.country}
              </p>
            </div>

          </div>
        ) : (
          <div className="text-center py-8 text-text-muted italic">
            Waiting for order reference search query...
          </div>
        )}

      </div>
    </div>
  );
};
export default TrackOrderPage;
