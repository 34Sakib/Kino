import React, { useState } from 'react';
import { Button } from '../shared/Button';
import { CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const PaymentForm = ({ orderTotal, onPaymentSuccess, onBack }) => {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Input Formatting helpers
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    // Add spaces every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleCVCChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCVC(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Invalid card number. Must be 16 digits.');
        return;
      }
      if (cardExpiry.length < 5) {
        toast.error('Invalid expiry date (MM/YY).');
        return;
      }
      if (cardCVC.length < 3) {
        toast.error('Invalid CVC code.');
        return;
      }
      if (!cardName.trim()) {
        toast.error('Please enter the cardholder name.');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate Stripe payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        method: paymentMethod,
        cardLast4: paymentMethod === 'card' ? cardNumber.slice(-4) : 'PayPal'
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-50 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-2 border-solid border-accent-gold border-t-transparent rounded-full animate-spin" />
          <p className="font-editorial text-lg italic text-text-dark">Processing secure payment via Stripe...</p>
        </div>
      )}

      {/* Methods selectors */}
      <div className="flex flex-col gap-3">
        <h4 className="font-editorial text-lg font-bold border-b border-black/5 pb-2 mb-1">
          Payment Method
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`py-3 border rounded-sm flex items-center justify-center gap-2 font-semibold text-xs uppercase tracking-wider transition-all duration-300 ${
              paymentMethod === 'card'
                ? 'border-accent-gold bg-bg-light/20 text-text-dark font-bold'
                : 'border-black/10 text-text-muted hover:border-black/30'
            }`}
          >
            <CreditCard size={14} /> Credit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={`py-3 border rounded-sm flex items-center justify-center gap-2 font-semibold text-xs uppercase tracking-wider transition-all duration-300 ${
              paymentMethod === 'paypal'
                ? 'border-accent-gold bg-bg-light/20 text-text-dark font-bold'
                : 'border-black/10 text-text-muted hover:border-black/30'
            }`}
          >
            PayPal
          </button>
        </div>
      </div>

      {paymentMethod === 'card' ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Cardholder Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Julian Sterling"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="py-2 px-3 text-sm rounded-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Card Number</label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                placeholder="4000 1234 5678 9010"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="py-2 pr-10 pl-3 text-sm rounded-sm w-full font-price-label"
              />
              <CreditCard size={16} className="absolute right-3 text-text-muted/60" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Expiry Date</label>
              <input
                type="text"
                required
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={handleExpiryChange}
                className="py-2 px-3 text-sm rounded-sm font-price-label"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">CVC / CVV</label>
              <input
                type="text"
                required
                placeholder="123"
                value={cardCVC}
                onChange={handleCVCChange}
                className="py-2 px-3 text-sm rounded-sm font-price-label"
              />
            </div>
          </div>

          {/* Secure details */}
          <div className="bg-bg-light/30 border border-solid border-black/5 p-4 rounded-sm flex items-start gap-3 mt-2">
            <Lock size={16} className="text-accent-gold mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-bold text-text-dark flex items-center gap-1.5">
                Secure SSL Checkout
              </p>
              <p className="text-[0.65rem] text-text-muted leading-relaxed">
                Your payment credentials are encrypted using industry-standard protocols. We do not store full card numbers on our servers.
              </p>
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="flex items-center gap-4 mt-6">
            <button
              type="button"
              onClick={onBack}
              className="py-3 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text-dark px-4"
            >
              &larr; Back to Shipping
            </button>
            <Button
              type="submit"
              variant="gold"
              fullWidth
              className="py-3 font-bold flex-1"
            >
              Pay ${orderTotal.toFixed(2)}
            </Button>
          </div>

        </form>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-center py-6">
          <p className="text-sm text-text-muted leading-relaxed">
            Clicking pay will redirect you to PayPal secure gateway to complete authentication and select credentials.
          </p>
          
          <div className="flex items-center gap-4 mt-6">
            <button
              type="button"
              onClick={onBack}
              className="py-3 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text-dark px-4"
            >
              &larr; Back
            </button>
            <Button
              type="submit"
              variant="gold"
              fullWidth
              className="py-3 font-bold flex-1 animate-pulse-gold"
            >
              Express Pay with PayPal
            </Button>
          </div>
        </form>
      )}

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-8 border-t border-black/5 pt-6 mt-2 text-text-muted/50">
        <div className="flex items-center gap-1">
          <ShieldCheck size={14} className="text-[#E8B86D]" />
          <span className="text-[0.6rem] uppercase tracking-wider font-bold">Stripe Verified</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock size={14} className="text-[#E8B86D]" />
          <span className="text-[0.6rem] uppercase tracking-wider font-bold">AES-256 Encrypted</span>
        </div>
      </div>

    </div>
  );
};
export default PaymentForm;
