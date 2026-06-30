import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { Button } from '../components/shared/Button';
import { Package, Truck, CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Create a helper mock fallback order for demonstration
const MOCK_FALLBACK_ORDER = {
  id: 'ORD-888888',
  date: 'June 28, 2026',
  status: 'In Transit',
  milestones: [
    { label: 'Confirmed', date: 'June 28, 10:30 AM', completed: true },
    { label: 'Sanctuary Carving', date: 'June 28, 2:40 PM', completed: true },
    { label: 'Dispatched', date: 'June 29, 9:15 AM', completed: true },
    { label: 'In Transit', date: 'Est. July 2', completed: false }
  ],
  shipping: {
    firstName: 'Julian',
    lastName: 'Sterling',
    address: '42 Atelier Street',
    city: 'New York',
    zip: '10001',
    country: 'United States'
  },
  items: [
    { name: 'Travertine Sculpture Vessel', qty: 1, price: 180 },
    { name: 'Fluted Ceramic Pendant', qty: 2, price: 320 }
  ],
  pricing: { total: 820 }
};

export const TrackOrderPage = () => {
  const [orderQuery, setOrderQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const { orders } = useUserStore();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = orderQuery.trim().toUpperCase();

    if (!cleanQuery) return;

    // Check store orders
    const found = orders.find((o) => o.id === cleanQuery);

    if (found) {
      // Build dynamic milestones
      const decorated = {
        ...found,
        status: 'Dispatched',
        milestones: [
          { label: 'Confirmed', date: found.date, completed: true },
          { label: 'Processed', date: found.date, completed: true },
          { label: 'Dispatched', date: 'In Transit', completed: true },
          { label: 'Delivered', date: 'Pending Courier', completed: false }
        ]
      };
      setSearchedOrder(decorated);
      toast.success('Order status retrieved.');
    } else if (cleanQuery === 'ORD-888888' || cleanQuery === 'DEMO') {
      setSearchedOrder(MOCK_FALLBACK_ORDER);
      toast.success('Demo order status retrieved.');
    } else {
      toast.error('Order reference not recognized. Try typing ORD-888888 for a demo.');
      setSearchedOrder(null);
    }
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
            Enter your order reference code (found inside your receipt email, e.g., <span className="font-bold text-text-dark font-price-label">ORD-888888</span>) below to inspect shipping milestones.
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              required
              placeholder="e.g. ORD-888888"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="py-2.5 px-4 text-sm uppercase tracking-wider rounded-sm flex-1 font-price-label"
            />
            <Button type="submit" variant="gold" className="px-6 font-bold uppercase tracking-wider text-xs">
              <Search size={14} /> Search
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
