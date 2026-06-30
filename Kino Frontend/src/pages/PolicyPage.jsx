import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldAlert, Scale, Lock } from 'lucide-react';

export const PolicyPage = () => {
  const location = useLocation();
  const [activePolicy, setActivePolicy] = useState('returns');

  // Sync active policy state with URL path
  useEffect(() => {
    if (location.pathname.includes('/privacy')) {
      setActivePolicy('privacy');
    } else {
      setActivePolicy('returns');
    }
  }, [location.pathname]);

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none animate-fade-in">
      <div className="container max-w-3xl">
        
        {/* Tab Selection */}
        <div className="flex justify-center border-b border-black/5 mb-10">
          <div className="flex gap-8">
            <button
              onClick={() => setActivePolicy('returns')}
              className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-all duration-300 ${
                activePolicy === 'returns'
                  ? 'border-accent-gold text-text-dark font-extrabold'
                  : 'border-transparent text-text-muted hover:text-text-dark'
              }`}
            >
              Return Guidelines
            </button>
            <button
              onClick={() => setActivePolicy('privacy')}
              className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-all duration-300 ${
                activePolicy === 'privacy'
                  ? 'border-accent-gold text-text-dark font-extrabold'
                  : 'border-transparent text-text-muted hover:text-text-dark'
              }`}
            >
              Privacy Policy
            </button>
          </div>
        </div>

        {activePolicy === 'returns' ? (
          /* Returns Policy */
          <div className="flex flex-col gap-6 text-sm text-text-muted leading-relaxed font-light animate-fade-in">
            <h1 className="font-editorial text-3xl md:text-4xl text-text-dark font-medium leading-tight mb-2">
              Returns & Exchanges Guidelines
            </h1>
            <p>
              We want you to feel fully confident in styling our creations inside your home sanctuary. We accept returns on all standard collections within 30 days of arrival.
            </p>
            <div className="bg-bg-light/45 border border-solid border-black/5 p-5 rounded-sm flex gap-4 items-start my-2">
              <ShieldAlert size={20} className="text-accent-gold flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs">
                <h4 className="font-bold text-text-dark uppercase tracking-wider">Please Note: Sizing Items</h4>
                <p>
                  Bespoke design pieces (like oak desks or tables customized to user-provided dimensions) cannot be returned or refunded once carving and assembly has commenced.
                </p>
              </div>
            </div>
            
            <h3 className="font-editorial text-xl font-bold text-text-dark mt-4 border-b border-black/5 pb-2">Return Conditions</h3>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Items must be returned unused, undamaged, and inside their original packaging crate/box.</li>
              <li>Returns are subject to a standard flat return shipping surcharge ($15 for accessories, $80 for heavy furniture pieces).</li>
              <li>Once returned items are received and inspected by our warehouse teams in Copenhagen, refunds are processed to your original payment method in 5-7 business days.</li>
            </ul>
          </div>
        ) : (
          /* Privacy Policy */
          <div className="flex flex-col gap-6 text-sm text-text-muted leading-relaxed font-light animate-fade-in">
            <h1 className="font-editorial text-3xl md:text-4xl text-text-dark font-medium leading-tight mb-2">
              Privacy Statement
            </h1>
            <p>
              Kino Atelier is committed to protecting your personal information. This Statement outlines how we collect, process, and protect your address details and email records.
            </p>
            
            <div className="bg-bg-light/45 border border-solid border-black/5 p-5 rounded-sm flex gap-4 items-start my-2">
              <Lock size={20} className="text-accent-gold flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 text-xs">
                <h4 className="font-bold text-text-dark uppercase tracking-wider">AES-256 Encryption</h4>
                <p>
                  Your login sessions, payment transactions, and address parameters are encrypted using SSL protocols.
                </p>
              </div>
            </div>

            <h3 className="font-editorial text-xl font-bold text-text-dark mt-4 border-b border-black/5 pb-2">Data Collection & Sourcing</h3>
            <p>
              We collect information you explicitly provide: email address when joining the Lookbook, name and telephone details, delivery addresses during checkout. We use these details solely to dispatch purchases and send customized lookbook edits. We do not sell data to third-party advertisers.
            </p>

            <h3 className="font-editorial text-xl font-bold text-text-dark mt-4 border-b border-black/5 pb-2">GDPR & CCPA Rights</h3>
            <p>
              Under international guidelines, clients retain the right to query the specific records stored by our database, adjust configurations, or request complete ledger deletion. Please contact details deletion queries directly to dpo@kino.design.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
export default PolicyPage;
