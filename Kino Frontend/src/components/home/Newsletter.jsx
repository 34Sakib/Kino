import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Mail, CheckCircle } from 'lucide-react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === '') {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Simulate database registration delay
    setTimeout(() => {
      setSubmitted(true);
      toast.success('Successfully subscribed to Kino Atelier Lookbook.');
      setEmail('');
    }, 600);
  };

  return (
    <section className="py-24 bg-bg-light border-b border-black/5 text-center">
      <div className="container max-w-2xl flex flex-col items-center gap-6">
        
        {/* Visual Icon */}
        <div className="w-12 h-12 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center mb-2">
          <Mail size={20} />
        </div>

        <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
          The Atelier Letter
        </span>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 animate-fade-in py-4">
            <CheckCircle size={36} className="text-green-600" />
            <h3 className="font-editorial text-2xl font-bold">You are Subscribed</h3>
            <p className="text-sm text-text-muted max-w-sm">
              We look forward to sharing private collections, styling edits, and journal logs with you.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            <h2 className="font-editorial text-4xl md:text-5xl text-text-dark font-medium leading-tight">
              Join the Lookbook Journal
            </h2>
            <p className="text-sm text-text-muted leading-relaxed max-w-md">
              Receive curated styling logs, early access to new studio drops, and private capsule sales directly in your inbox.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-3 px-4 text-sm rounded-sm flex-1 border border-black/10 focus:border-accent-gold"
              />
              <button
                type="submit"
                className="bg-black text-white hover:bg-accent-gold hover:text-black font-bold text-xs uppercase tracking-widest py-3 px-8 rounded-sm transition-colors duration-300 flex-shrink-0"
              >
                Join Atelier
              </button>
            </form>

            <p className="text-[0.65rem] text-text-muted/60 mt-1">
              By subscribing, you agree to our Privacy Policy. Opt-out at any time.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
export default Newsletter;
