import React, { useState } from 'react';

export const ImageGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };

  if (!images || images.length === 0) {
    return <div className="aspect-square bg-gray-100 flex items-center justify-center">No images</div>;
  }

  return (
    <div className="flex gap-4 flex-col-reverse md:flex-row h-full">
      {/* Thumbnail Strip */}
      <div className="flex md:flex-col gap-3 max-h-[500px] overflow-y-auto overflow-x-auto md:overflow-x-hidden pb-2 md:pb-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 border rounded-sm overflow-hidden transition-all duration-300 ${
              activeIndex === idx ? 'border-accent-gold scale-[1.03] shadow-md' : 'border-black/5 hover:border-black/20'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image with Hover Zoom */}
      <div 
        className="flex-1 aspect-[4/5] relative overflow-hidden bg-[#F5F0EA] rounded-sm cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => {
          setIsZooming(false);
          setZoomOrigin('50% 50%');
        }}
        style={{
          border: '1px solid rgba(0,0,0,0.03)'
        }}
      >
        <img
          src={images[activeIndex]}
          alt="Active product visualization"
          className="w-full h-full object-cover transition-transform duration-200 ease-out"
          style={{
            transform: isZooming ? 'scale(2.2)' : 'scale(1)',
            transformOrigin: zoomOrigin,
          }}
        />
        
        {/* Subtle Zoom Hint Overlay */}
        {!isZooming && (
          <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[0.65rem] uppercase tracking-wider font-price-label text-text-dark border border-solid border-black/5 pointer-events-none">
            Hover to magnify
          </div>
        )}
      </div>
    </div>
  );
};
export default ImageGallery;
