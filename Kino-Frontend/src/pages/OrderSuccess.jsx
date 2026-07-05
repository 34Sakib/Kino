import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Calendar, Mail, ShieldAlert } from 'lucide-react';

export const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const order = location.state?.order;

  // Safety check if someone visits /order-success directly without a context order
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none">
      <div className="container max-w-3xl flex flex-col items-center">
        
        {/* Success Icon Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center justify-center animate-fade-in shadow-sm">
            <CheckCircle size={32} />
          </div>
          
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Transaction Authorized
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl font-medium text-text-dark">
            Thank you for your order
          </h1>
          <p className="text-sm text-text-muted max-w-md">
            Your payment was securely authenticated by Stripe. A receipt and order log has been dispatched to <span className="font-bold text-text-dark">{order.shipping?.email}</span>.
          </p>
        </div>

        {/* Order Meta details */}
        <div className="w-full bg-bg-light/45 border border-solid border-black/5 rounded-sm p-6 flex flex-col gap-6 mb-8">
          
          {/* Order Details header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-4">
            <div>
              <p className="text-[0.65rem] uppercase tracking-wider font-semibold text-text-muted">Order Reference</p>
              <h3 className="font-price-label text-base font-bold text-text-dark">{order.id}</h3>
            </div>
            <div className="flex items-center gap-2 text-text-muted text-xs font-semibold">
              <Calendar size={14} /> {order.date}
            </div>
          </div>

          {/* Line items list */}
          <div className="flex flex-col gap-4">
            <h4 className="font-editorial text-sm font-bold uppercase tracking-wider">Purchased Items</h4>
            <div className="flex flex-col gap-3">
              {order.items?.map((item) => (
                <div key={`${item.id}-${item.selectedColor?.name || 'none'}-${item.selectedSize || 'none'}`} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-10 h-12 object-cover bg-white border border-black/5 rounded-xs"
                    />
                    <div>
                      <p className="font-bold text-text-dark">{item.name}</p>
                      <p className="text-[0.6rem] text-text-muted mt-0.5 font-price-label">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedColor && ` / Color: ${item.selectedColor.name}`}
                        {` x ${item.qty}`}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-text-dark font-price-label">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Surcharge summary breakdown */}
          <div className="border-t border-black/5 pt-4 flex flex-col gap-2 text-xs">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal</span>
              <span className="font-price-label">${order.pricing?.subtotal?.toFixed(2)}</span>
            </div>
            {order.pricing?.code && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount Code ({order.pricing.code})</span>
                <span className="font-price-label">-${order.pricing?.discount?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-text-muted">
              <span>Shipping cost</span>
              <span className="font-price-label">
                {order.pricing?.shipping === 0 ? 'Complimentary' : `$${order.pricing?.shipping?.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between items-baseline font-bold border-t border-black/5 pt-3 mt-1 text-sm text-text-dark">
              <span>Total Paid</span>
              <span className="text-base text-accent-gold font-price-label font-extrabold">
                ${order.pricing?.total?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="border-t border-black/5 pt-4 text-xs flex flex-col gap-2">
            <h4 className="font-editorial text-sm font-bold uppercase tracking-wider">Delivery Destination</h4>
            <p className="text-text-muted leading-relaxed">
              {order.shipping?.firstName} {order.shipping?.lastName} <br />
              {order.shipping?.address} {order.shipping?.apartment && `, ${order.shipping.apartment}`} <br />
              {order.shipping?.city}, {order.shipping?.zip} <br />
              {order.shipping?.country}
            </p>
          </div>

        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            to="/shop"
            className="btn-gold justify-center py-2.5 px-8 font-bold tracking-widest text-xs uppercase w-full sm:w-auto text-center"
          >
            Continue Browsing
          </Link>
          <Link
            to="/account"
            className="btn-outline justify-center py-2.5 px-8 font-bold tracking-widest text-xs uppercase w-full sm:w-auto text-center text-text-dark border-black"
          >
            View Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};
export default OrderSuccess;
