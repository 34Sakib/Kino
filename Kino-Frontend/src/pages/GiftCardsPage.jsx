import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/shared/Button';
import { Gift, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DENOMINATIONS = [50, 100, 250, 500];

export const GiftCardsPage = () => {
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');

  const handleAddToBag = (e) => {
    e.preventDefault();
    if (!recipientEmail.trim() || !recipientName.trim()) {
      toast.error('Please specify recipient details.');
      return;
    }

    // Create custom product structure representing the gift voucher
    const giftCardItem = {
      id: `gift-card-${selectedAmount}-${Date.now()}`,
      name: `Digital Gift Voucher — $${selectedAmount}`,
      tagline: `For ${recipientName} (${recipientEmail})`,
      price: selectedAmount,
      images: [
        'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'
      ],
      category: 'accessories',
      stock: 100,
      sizes: ['Digital Code'],
      colors: [{ name: 'Gold Voucher', hex: '#E8B86D' }],
      description: `A digital gift voucher valued at $${selectedAmount}, delivered via email to ${recipientEmail} with a private message.`,
      details: [
        `Value: $${selectedAmount}`,
        `Recipient: ${recipientName} (${recipientEmail})`,
        `Sender: ${senderName || 'Anonymous'}`,
        'Delivered via email instantly upon transaction completion',
        'Frictionless checkout code integration'
      ]
    };

    addItem(giftCardItem, giftCardItem.colors[0], giftCardItem.sizes[0], 1);
    toast.success(`Added $${selectedAmount} Gift Card to bag.`);
    
    // Reset forms
    setRecipientEmail('');
    setRecipientName('');
    setSenderName('');
    setMessage('');
  };

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none animate-fade-in">
      <div className="container max-w-4xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Visual Voucher mockup */}
          <div className="relative aspect-[1.58/1] w-full rounded-sm overflow-hidden bg-gradient-to-tr from-[#0D0D0D] via-[#1E1E1E] to-[#0D0D0D] p-8 border border-white/10 flex flex-col justify-between shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-gold/15 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="font-editorial text-2xl tracking-[0.2em] uppercase text-white">KINO</span>
                <span className="text-[0.5rem] tracking-[0.4em] uppercase text-accent-gold mt-[-3px] font-price-label font-bold">ATELIER</span>
              </div>
              <Gift size={24} className="text-accent-gold animate-float" />
            </div>

            <div className="text-right">
              <span className="text-[0.55rem] uppercase text-white/30 tracking-widest block font-bold">Digital Voucher</span>
              <span className="font-price-label text-4xl font-extrabold text-accent-gold block mt-1">
                ${selectedAmount}
              </span>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[0.55rem] text-white/40 uppercase tracking-widest">
              <span>FOR: {recipientName || '————'}</span>
              <span>CODE SENT ON PURCHASE</span>
            </div>
          </div>

          {/* Right Column: Denominations & Email Delivery fields */}
          <div className="border border-solid border-black/5 rounded-sm p-6 bg-white shadow-xs">
            
            <form onSubmit={handleAddToBag} className="flex flex-col gap-5">
              <h3 className="font-editorial text-2xl font-bold uppercase tracking-wider border-b border-black/5 pb-2">
                Send Gift Voucher
              </h3>

              {/* Denomination Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Select Amount</label>
                <div className="grid grid-cols-4 gap-2">
                  {DENOMINATIONS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setSelectedAmount(amount)}
                      className={`py-2 text-sm font-bold font-price-label border rounded-sm transition-all duration-300 ${
                        selectedAmount === amount
                          ? 'bg-[#0D0D0D] text-white border-[#0D0D0D] scale-102 shadow-sm'
                          : 'bg-white text-text-dark border-black/10 hover:border-black/30'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient details */}
              <div className="grid grid-cols-2 gap-4 border-t border-black/5 pt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Recipient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexandra"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="py-2 px-3 text-xs rounded-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Recipient Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="py-2 px-3 text-xs rounded-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Your Name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Julian Sterling"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="py-2 px-3 text-xs rounded-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Personalized Message (optional)</label>
                <textarea
                  rows="3"
                  placeholder="Style your message details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="py-2 px-3 text-xs rounded-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                fullWidth
                className="py-2.5 font-bold tracking-widest text-xs uppercase mt-1"
              >
                Add Gift Card to Bag
              </Button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
export default GiftCardsPage;
