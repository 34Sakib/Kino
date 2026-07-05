import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { PaymentForm } from '../components/checkout/PaymentForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import api from '../utils/api';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Zustand State hooks
  const cartItems = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useUserStore((state) => state.addOrder);

  const subtotal = getSubtotal();

  const initialPricing = location.state?.pricing || {
    subtotal: subtotal,
    shipping: subtotal >= 500 ? 0 : 25.00,
    discount: 0,
    total: subtotal + (subtotal >= 500 ? 0 : 25.00),
    code: ''
  };

  const [step, setStep] = useState(1); // Step 1: Shipping, Step 2: Payment
  const [shippingDetails, setShippingDetails] = useState(null);
  const [pricing, setPricing] = useState(initialPricing);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Safety redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your shopping bag is empty.');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Handle shipping step submission
  const handleShippingSubmit = (details) => {
    setLoading(true);
    
    // Call backend checkout session trigger
    api.post('/checkout/session', {
      items: cartItems.map(item => ({
        id: item.id,
        qty: item.qty,
        sku: item.sku || `${item.category.toUpperCase()}-VESSEL-SM`, // default fallback SKU if missing
        name: item.name
      })),
      email: details.email || 'guest@example.com',
      shipping_address: {
        first_name: details.firstName,
        last_name: details.lastName,
        address_line1: details.address,
        city: details.city,
        zip: details.zip,
        country: details.country || 'US'
      },
      coupon_code: pricing.code || null
    })
      .then(res => {
        setSessionData(res);
        setShippingDetails(details);
        setPricing(prev => ({
          ...prev,
          total: parseFloat(res.total)
        }));
        setStep(2); // Proceed to payment
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch(err => {
        toast.error(err.message || 'Inventory validation failed.');
        setLoading(false);
      });
  };

  // Handle payment completion
  const handlePaymentSuccess = (paymentDetails) => {
    if (!sessionData) return;

    setLoading(true);
    
    // Confirm order payment in backend
    api.post('/checkout/confirm', {
      order_id: sessionData.order_id,
      payment_intent_id: sessionData.payment_intent_id
    })
      .then(res => {
        const placedOrder = {
          items: cartItems,
          shipping: shippingDetails,
          pricing: pricing,
          payment: paymentDetails,
          order_number: sessionData.order_number,
          id: sessionData.order_id
        };

        // Add to local state orders list
        const completedOrder = addOrder(placedOrder);
        
        clearCart();
        toast.success('Thank you! Your order was authorized.');
        setLoading(false);
        
        // Redirect to Order Success Page
        navigate('/order-success', { state: { order: completedOrder } });
      })
      .catch(err => {
        toast.error(err.message || 'Payment confirmation failed.');
        setLoading(false);
      });
  };

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none">
      <div className="container">
        
        {/* Stepper Progress Bar */}
        <div className="max-w-xl mx-auto mb-10 flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-black/5 z-0" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-accent-gold z-0 transition-all duration-500" 
            style={{ width: step === 1 ? '0%' : '100%' }}
          />

          {/* Step 1 marker */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-3">
            <div className={`w-8 h-8 rounded-full border-2 border-solid flex items-center justify-center text-xs font-bold font-price-label transition-colors duration-300 ${
              step >= 1 ? 'border-accent-gold bg-accent-gold text-bg-dark' : 'border-black/10 bg-white text-text-muted'
            }`}>
              1
            </div>
            <span className="text-[0.6rem] uppercase tracking-wider font-bold text-text-dark">Shipping</span>
          </div>

          {/* Step 2 marker */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-3">
            <div className={`w-8 h-8 rounded-full border-2 border-solid flex items-center justify-center text-xs font-bold font-price-label transition-colors duration-300 ${
              step >= 2 ? 'border-accent-gold bg-accent-gold text-bg-dark' : 'border-black/10 bg-white text-text-muted'
            }`}>
              2
            </div>
            <span className="text-[0.6rem] uppercase tracking-wider font-bold text-text-dark">Payment</span>
          </div>
        </div>

        {/* Main Grid Checkout content */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column */}
          <div className="w-full lg:w-2/3 border border-solid border-black/5 rounded-sm p-6 bg-white shadow-xs">
            {loading ? (
              <div className="py-20 text-center text-text-muted text-xs">
                Authorizing secure transaction...
              </div>
            ) : step === 1 ? (
              <ShippingForm onSubmit={handleShippingSubmit} />
            ) : (
              <PaymentForm
                orderTotal={pricing.total}
                onPaymentSuccess={handlePaymentSuccess}
                onBack={() => setStep(1)}
              />
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <OrderSummary pricingInfo={pricing} />
          </div>

        </div>

      </div>
    </div>
  );
};
export default CheckoutPage;
