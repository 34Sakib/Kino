import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/Button';
import { Clock } from 'lucide-react';

export const PromoBanner = () => {
  const navigate = useNavigate();
  
  // Urgent countdown state (cycles every day or sets a future date)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <section className="relative py-24 bg-[#0D0D0D] text-white overflow-hidden select-none">
      
      {/* Background Image overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"
          alt="Luxury living architectural space"
          className="w-full h-full object-cover opacity-25 filter brightness-[0.7] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <div className="container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Column: Promotion details */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 max-w-xl">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Limited Seasonal Release
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl text-white font-medium leading-tight">
            10% Off Private Collection
          </h2>
          <p className="text-sm text-white/50 leading-relaxed font-light">
            Enter private access code <span className="font-bold text-accent-gold font-price-label">GOLDEN</span> at checkout. Receive a complimentary hand-carved soapstone dish with orders exceeding $150.
          </p>
          <div className="flex mt-2">
            <Button
              onClick={() => navigate('/shop')}
              variant="gold"
              className="font-bold tracking-widest px-8"
            >
              Shop Private Sale
            </Button>
          </div>
        </div>

        {/* Right Column: Visual Urgency Timer */}
        <div className="bg-white/5 border border-solid border-white/10 backdrop-blur-md p-8 rounded-sm text-center flex flex-col items-center gap-4 min-w-[280px] sm:min-w-[340px]">
          <div className="flex items-center gap-2 text-accent-gold text-xs uppercase tracking-widest font-bold font-price-label">
            <Clock size={14} className="animate-pulse" /> Sale Ends In
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="flex flex-col items-center">
              <span className="font-price-label text-4xl font-bold tracking-wider text-white">
                {formatNumber(timeLeft.hours)}
              </span>
              <span className="text-[0.55rem] uppercase text-white/40 mt-1 font-bold">Hours</span>
            </div>
            <span className="text-2xl text-accent-gold font-price-label">:</span>
            <div className="flex flex-col items-center">
              <span className="font-price-label text-4xl font-bold tracking-wider text-white">
                {formatNumber(timeLeft.minutes)}
              </span>
              <span className="text-[0.55rem] uppercase text-white/40 mt-1 font-bold">Minutes</span>
            </div>
            <span className="text-2xl text-accent-gold font-price-label">:</span>
            <div className="flex flex-col items-center">
              <span className="font-price-label text-4xl font-bold tracking-wider text-accent-gold">
                {formatNumber(timeLeft.seconds)}
              </span>
              <span className="text-[0.55rem] uppercase text-white/40 mt-1 font-bold">Seconds</span>
            </div>
          </div>

          <p className="text-[0.65rem] text-white/30 italic mt-2">
            *Offer valid on listed items only. Free shipping automatically applied.
          </p>
        </div>

      </div>

    </section>
  );
};
export default PromoBanner;
