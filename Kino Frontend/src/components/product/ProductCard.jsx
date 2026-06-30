import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { Badge } from '../shared/Badge';
import { StarRating } from '../shared/StarRating';
import { toast } from 'react-hot-toast';

export const ProductCard = ({ product }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Zustand State hooks
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, hasItem } = useWishlistStore();
  const isWishlisted = hasItem(product.id);

  // 3D Magnetic Tilt math
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Max rotation is 8 degrees
    const factorX = -(y / (rect.height / 2)) * 8;
    const factorY = (x / (rect.width / 2)) * 8;
    
    setTilt({ x: factorX, y: factorY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) {
      toast.error(`${product.name} is currently sold out.`);
      return;
    }
    
    addItem(product);
    toast.success(`Added ${product.name} to cart.`);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
    if (!isWishlisted) {
      toast.success(`Saved ${product.name} to wishlist.`);
    } else {
      toast.success(`Removed ${product.name} from wishlist.`);
    }
  };

  const hasDiscount = product.originalPrice !== null;
  const isSoldOut = product.stock === 0;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between h-full bg-white select-none cursor-pointer rounded-sm"
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        border: '1px solid rgba(0,0,0,0.03)',
        padding: '12px'
      }}
    >
      <Link to={`/product/${product.id}`} className="block relative w-full h-[280px] overflow-hidden bg-white mb-4 rounded-sm">
        
        {/* Badges (Top Left) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
          {isSoldOut ? (
            <Badge variant="soldout">Sold Out</Badge>
          ) : product.badge ? (
            <Badge variant={product.badge.toLowerCase()}>{product.badge}</Badge>
          ) : null}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isWishlisted 
              ? 'bg-[#0D0D0D] text-[#E8B86D]' 
              : 'bg-white/80 hover:bg-[#0D0D0D] hover:text-[#E8B86D] text-[#0D0D0D]'
          }`}
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          <Heart size={16} fill={isWishlisted ? '#E8B86D' : 'none'} />
        </button>

        {/* Product Image swap */}
        <div className="w-full h-full relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
            }`}
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                isHovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
            />
          )}
        </div>

        {/* Quick Add Button Slide Up */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 transition-transform duration-500 z-10 flex justify-center translate-y-full group-hover:translate-y-0`}
        >
          <button
            onClick={handleQuickAdd}
            disabled={isSoldOut}
            className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
              isSoldOut 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#0D0D0D] text-white hover:bg-[#E8B86D] hover:text-[#0D0D0D]'
            } transition-colors duration-300`}
          >
            <ShoppingBag size={14} />
            <span>Quick Add</span>
          </button>
        </div>
      </Link>

      {/* Info Block */}
      <div className="flex flex-col gap-1.5 flex-1 justify-between px-1">
        <div>
          <span className="text-[0.65rem] text-[#6B6B6B] uppercase tracking-widest font-semibold block mb-1">
            {product.category.replace('-', ' ')}
          </span>
          <h3 className="font-editorial text-base font-bold text-[#0D0D0D] tracking-wide line-clamp-1 group-hover:text-accent-gold transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-[0.7rem] text-[#6B6B6B] line-clamp-1 italic">
            {product.tagline}
          </p>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-solid border-black/5">
          <StarRating rating={product.rating} count={product.reviewCount} size={12} />
          
          <div className="flex items-center gap-1.5">
            {hasDiscount && (
              <span className="text-xs text-[#6B6B6B] line-through font-price-label">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-sm font-bold text-[#E8B86D] font-price-label">
              ${product.price}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
export default ProductCard;
