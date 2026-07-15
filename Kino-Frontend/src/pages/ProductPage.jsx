import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { ImageGallery } from '../components/product/ImageGallery';
import { ColorSelector } from '../components/product/ColorSelector';
import { SizeSelector } from '../components/product/SizeSelector';
import { ReviewSection } from '../components/product/ReviewSection';
import { StarRating } from '../components/shared/StarRating';
import { Modal } from '../components/shared/Modal';
import { Button } from '../components/shared/Button';
import { Heart, Truck, RefreshCw, ShieldCheck, Plus, Minus, Layers, ClipboardList } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // API States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [bundleProduct, setBundleProduct] = useState(null);

  // States
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Zustand Store Hooks
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, hasItem } = useWishlistStore();
  const isWishlisted = hasItem(product?.id);

  // Refs for sticky scroll mapping
  const addToCartRef = useRef(null);

  // Fetch product from API
  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(`/products/${id}`)
      .then(res => {
        if (active) {
          const mapped = api.mapProduct(res.product);
          setProduct(mapped);
          
          if (mapped.colors && mapped.colors.length > 0) {
            setSelectedColor(mapped.colors[0]);
          }
          if (mapped.sizes && mapped.sizes.length > 0) {
            setSelectedSize(mapped.sizes[0]);
          }
          setQty(1);
          setLoading(false);
          window.scrollTo(0, 0);

          // Fetch related product for bundle
          api.get(`/products/${mapped.id}/related`)
            .then(relRes => {
              if (active && relRes.length > 0) {
                setBundleProduct(api.mapProduct(relRes[0]));
              }
            });
        }
      })
      .catch(err => {
        console.error(err);
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  // Sync Recently Viewed history carousel
  useEffect(() => {
    if (product) {
      const saved = localStorage.getItem('kino-recently-viewed') || '[]';
      let historyList = JSON.parse(saved);
      historyList = [product.id, ...historyList.filter((item) => item !== product.id)].slice(0, 5);
      localStorage.setItem('kino-recently-viewed', JSON.stringify(historyList));

      api.get('/products?limit=5')
        .then(res => {
          const mapped = api.mapProducts(res);
          setRecentlyViewed(mapped.filter(p => p.id !== product.id).slice(0, 3));
        });
    }
  }, [id, product]);

  // Stepper handlers
  const handleQtyChange = (val) => {
    if (product && val > 0 && val <= product.stock) {
      setQty(val);
    }
  };

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('This piece is currently sold out.');
      return;
    }
    addItem(product, selectedColor, selectedSize, qty);
    toast.success(`Added ${qty}x ${product.name} to bag.`);
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      toast.error('This piece is currently sold out.');
      return;
    }
    addItem(product, selectedColor, selectedSize, qty);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    toggleItem(product);
    if (!isWishlisted) {
      toast.success(`Saved ${product.name} to wishlist.`);
    } else {
      toast.success(`Removed ${product.name} from wishlist.`);
    }
  };

  const handleClaimBundle = () => {
    if (isSoldOut || (bundleProduct && bundleProduct.stock === 0)) {
      toast.error('One or more bundle items are sold out.');
      return;
    }
    addItem(product, selectedColor, selectedSize, 1);
    if (bundleProduct) {
      addItem(bundleProduct, (bundleProduct.colors && bundleProduct.colors[0]) || null, (bundleProduct.sizes && bundleProduct.sizes[0]) || null, 1);
    }
    toast.success('Bespoke bundle set added to bag with 10% discount.');
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center container text-text-muted text-xs">
        Loading curator details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center container">
        <h2 className="font-editorial text-3xl font-bold">Piece Not Found</h2>
        <p className="text-text-muted mt-2">The requested design could not be found in our database.</p>
        <button onClick={() => navigate('/shop')} className="btn-gold mt-6">
          Return to Gallery
        </button>
      </div>
    );
  }

  const baseSum = product.price + (bundleProduct?.price || 0);
  const bundleSum = baseSum * 0.9;
  const isSoldOut = product.stock === 0;

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="container">
        
        {/* Main Details Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column (55%): Image Gallery */}
          <div className="w-full lg:w-[55%]">
            <ImageGallery images={product.images} />
          </div>

          {/* Right Column (45%): Purchase Configuration */}
          <div className="w-full lg:w-[45%] flex flex-col gap-6">
            
            {/* Header info */}
            <div>
              <span className="text-xs text-text-muted uppercase tracking-widest font-semibold block mb-1">
                {product.category.replace('-', ' ')} Collection
              </span>
              <h1 className="font-editorial text-4xl lg:text-5xl font-bold text-text-dark leading-tight tracking-wide">
                {product.name}
              </h1>
              <p className="text-sm italic text-text-muted mt-1 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Rating summary */}
            <div className="flex items-center gap-4">
              <StarRating rating={product.rating} count={product.reviewCount} size={14} />
              <span className="w-[1px] h-3 bg-black/10" />
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('product-details-tabs')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs uppercase tracking-wider font-semibold text-text-dark hover:underline"
              >
                Read Reviews
              </button>
            </div>

            {/* Price tag */}
            <div className="flex items-baseline gap-3">
              {product.originalPrice && (
                <span className="text-lg text-text-muted line-through font-price-label">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-3xl font-bold text-accent-gold font-price-label">
                ${product.price}
              </span>
              {isSoldOut && (
                <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-sm uppercase tracking-wide font-bold ml-3 font-price-label">
                  Sold Out
                </span>
              )}
            </div>

            <p className="text-sm text-text-muted leading-relaxed">
              {product.description}
            </p>

            {/* Material Highlight badge */}
            <div className="flex items-center gap-3.5 bg-bg-light/45 border border-solid border-black/5 p-4 rounded-sm mt-1">
              <Layers size={18} className="text-accent-gold flex-shrink-0" />
              <div className="text-xs text-text-muted leading-relaxed">
                {product.category === 'accessories' && (
                  <span>
                    <strong>Italian Travertine:</strong> Hand-carved from single-source raw stone in Tuscan workshops. Holes and porous textures remain un-filled to honor history.
                  </span>
                )}
                {product.category === 'living-room' && (
                  <span>
                    <strong>European White Oak:</strong> FSC-certified oak logs, seasoned and finished with organic protective mineral oils to highlight grains.
                  </span>
                )}
                {product.category === 'lighting' && (
                  <span>
                    <strong>Thrown Terracotta:</strong> Wheel-thrown natural clay fired at 2200°F, finished with responsive matte glazes.
                  </span>
                )}
                {product.category === 'bedroom' && (
                  <span>
                    <strong>French Flax Linen:</strong> Pre-washed standard flax woven to 165 GSM. Thermoregulating, breathable, and naturally textured.
                  </span>
                )}
                {product.category === 'workspace' && (
                  <span>
                    <strong>Atelier Solid Joinery:</strong> Fitted soft-close drawers and steel support struts designed for architectural work.
                  </span>
                )}
                {product.category === 'dining' && (
                  <span>
                    <strong>Reactive Stoneware:</strong> Speckled mineral reactive glaze, making every ceramic plate pattern completely unique.
                  </span>
                )}
              </div>
            </div>

            {/* Variants Selectors */}
            <div className="flex flex-col gap-5 border-t border-black/5 pt-5">
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onSelect={(col) => setSelectedColor(col)}
              />
              
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelect={(sz) => setSelectedSize(sz)}
                onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              />
            </div>

            {/* Quantity Picker & Primary Buttons */}
            <div className="flex flex-col gap-4 border-t border-black/5 pt-5" ref={addToCartRef}>
              <div className="flex items-center gap-4">
                {/* Stepper */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">Qty</span>
                  <div className="flex items-center border border-black/10 rounded-sm h-11">
                    <button
                      onClick={() => handleQtyChange(qty - 1)}
                      className="px-3.5 h-full text-text-dark hover:bg-black/5"
                      type="button"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-4 text-sm font-bold font-price-label">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleQtyChange(qty + 1)}
                      className="px-3.5 h-full text-text-dark hover:bg-black/5"
                      type="button"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-xs uppercase tracking-wider font-semibold text-transparent select-none">Action</span>
                  <Button
                    onClick={handleAddToCart}
                    variant="gold"
                    fullWidth
                    disabled={isSoldOut}
                    className="h-11 font-bold"
                  >
                    Add to Bag
                  </Button>
                </div>

                {/* Wishlist Toggle Icon */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase tracking-wider font-semibold text-transparent select-none">Save</span>
                  <button
                    onClick={handleWishlistToggle}
                    className={`h-11 w-11 rounded-sm border border-solid flex items-center justify-center transition-all ${
                      isWishlisted 
                        ? 'border-accent-gold bg-bg-light/10 text-accent-gold' 
                        : 'border-black/10 hover:border-black/30 text-text-dark'
                    }`}
                  >
                    <Heart size={18} fill={isWishlisted ? '#E8B86D' : 'none'} />
                  </button>
                </div>
              </div>

              {/* Instant checkout CTAs */}
              <button
                onClick={handleBuyNow}
                disabled={isSoldOut}
                className={`w-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isSoldOut 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-accent-gold hover:text-black'
                }`}
              >
                Instant Checkout
              </button>
            </div>

            {/* Shopping Policies list */}
            <div className="border-t border-black/5 pt-5 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs">
                <Truck size={16} className="text-accent-gold" />
                <span className="text-text-muted leading-relaxed">
                  Complimentary standard shipping on all orders over $50.
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <RefreshCw size={16} className="text-accent-gold" />
                <span className="text-text-muted leading-relaxed">
                  Hassle-free 30-day return policy on all unworn, custom pieces.
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <ShieldCheck size={16} className="text-accent-gold" />
                <span className="text-text-muted leading-relaxed flex items-center gap-1">
                  100% Secure Checkout via Stripe & AES Encryption.
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Info Panels (Details | Care | Reviews) */}
        <div id="product-details-tabs" className="mt-20 border-t border-black/5 pt-12">
          
          {/* Tab selector menu */}
          <div className="flex justify-center border-b border-black/5 mb-8">
            <div className="flex gap-10">
              {['details', 'care', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-xs uppercase tracking-[0.2em] font-bold border-b-2 transition-all duration-300 ${
                    activeTab === tab 
                      ? 'border-accent-gold text-text-dark font-extrabold scale-102' 
                      : 'border-transparent text-text-muted hover:text-text-dark'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content renders */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'details' && (
              <ul className="flex flex-col gap-3 list-disc pl-5 text-sm text-text-muted leading-relaxed">
                {product.details?.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}

            {activeTab === 'care' && (
              <ul className="flex flex-col gap-3 list-disc pl-5 text-sm text-text-muted leading-relaxed">
                {product.care?.map((careItem, idx) => (
                  <li key={idx}>{careItem}</li>
                ))}
              </ul>
            )}

            {activeTab === 'reviews' && (
              <ReviewSection productId={product.id} />
            )}
        </div>

      </div>

        {/* BUNDLE OFFER SECTION */}
        {bundleProduct && (
          <div className="mt-16 bg-bg-light/35 border border-solid border-black/5 rounded-sm p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 min-w-0 text-left">
              <span className="text-[0.65rem] uppercase tracking-wider font-bold text-accent-gold font-price-label">Style as a Set</span>
              <h3 className="font-editorial text-2xl font-bold text-text-dark mt-1">Complete Your Sanctuary</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Bundle the <span className="font-bold text-text-dark">{product.name}</span> with the <span className="font-bold text-text-dark">{bundleProduct.name}</span>. Receive both in matching finishes and save an automatic 10% off the set.
              </p>
              
              <div className="flex items-center gap-6 mt-4">
                <div className="flex -space-x-4">
                  <img src={product.images[0]} alt={product.name} className="w-12 h-16 object-cover bg-white border border-black/5 rounded-xs" />
                  {bundleProduct.images && bundleProduct.images[0] && (
                    <img src={bundleProduct.images[0]} alt={bundleProduct.name} className="w-12 h-16 object-cover bg-white border border-black/5 rounded-xs" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.65rem] uppercase text-text-muted font-bold font-price-label">Bundle price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs line-through text-text-muted font-price-label">${baseSum}</span>
                    <span className="text-sm font-bold text-accent-gold font-price-label">${bundleSum.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleClaimBundle}
              className="btn-gold font-bold tracking-widest text-xs uppercase px-6 py-3 flex-shrink-0"
            >
              Add Set to Bag
            </button>
          </div>
        )}

        {/* COMPETITOR COMPARISON TABLE */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="font-editorial text-2xl font-bold uppercase tracking-wider border-b border-black/5 pb-2 mb-8 text-center md:text-left">
            Atelier Standards
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-price-label">
              <thead>
                <tr className="border-b border-black/10 text-text-muted uppercase tracking-wider font-bold">
                  <th className="py-2.5">Feature Details</th>
                  <th className="py-2.5 text-accent-gold">Kino Atelier Design</th>
                  <th className="py-2.5">Generic Alternatives</th>
                </tr>
              </thead>
              <tbody className="text-text-muted">
                <tr className="border-b border-black/5">
                  <td className="py-3 font-semibold text-text-dark">Material Base</td>
                  <td className="py-3 text-text-dark font-bold">100% Solid White Oak / Tuscan Travertine Stone</td>
                  <td className="py-3">MDF composite, veneer prints, synthetic resin casting</td>
                </tr>
                <tr className="border-b border-black/5">
                  <td className="py-3 font-semibold text-text-dark">Crafting Process</td>
                  <td className="py-3 text-text-dark font-bold">Hand-carved and hand-joined in Copenhagen & Florence</td>
                  <td className="py-3">Molded assembly lines, toxic synthetic chemical glues</td>
                </tr>
                <tr className="border-b border-black/5">
                  <td className="py-3 font-semibold text-text-dark">Guaranteed Longevity</td>
                  <td className="py-3 text-text-dark font-bold">10-year timber joinery structural warranty</td>
                  <td className="py-3">30-day standard factory return policy</td>
                </tr>
                <tr className="border-b border-black/5">
                  <td className="py-3 font-semibold text-text-dark">Lifecycle Impact</td>
                  <td className="py-3 text-text-dark font-bold">Biodegradable organic timber, zero synthetic chemicals</td>
                  <td className="py-3">Non-recyclable plastics, toxic VOC emissions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PRODUCT SPECIFIC FAQ */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="font-editorial text-2xl font-bold uppercase tracking-wider border-b border-black/5 pb-2 mb-8 text-center md:text-left">
            Piece FAQs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-text-muted text-left">
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-text-dark uppercase tracking-wider">Is assembly required?</h4>
              <p className="leading-relaxed">
                Accessories and light pendants ship fully assembled. Nordic Oak Desks require mounting the legs onto pre-fitted timber brackets using the provided solid brass hardware.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-text-dark uppercase tracking-wider">How do I clean the raw surfaces?</h4>
              <p className="leading-relaxed">
                Dust wood frames and natural stones using a clean, dry microfibre towel. Avoid liquid chemical sprays, wax polishes, or acidic cleaning detergents to preserve surface colors.
              </p>
            </div>
          </div>
        </div>

        {/* RECENTLY VIEWED PRODUCTS STRIP */}
        {recentlyViewed.length > 0 && (
          <div className="border-t border-black/5 pt-16 mt-20 max-w-4xl mx-auto">
            <h3 className="font-editorial text-2xl font-bold uppercase tracking-wider border-b border-black/5 pb-2 mb-8 text-center">
              Recently Visited
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentlyViewed.map((viewedProd) => (
                <Link
                  key={viewedProd.id}
                  to={`/product/${viewedProd.id}`}
                  className="group flex flex-col gap-2 border border-solid border-black/5 p-2.5 rounded-xs hover:shadow-md transition-shadow bg-white text-left"
                >
                  <div className="aspect-square bg-bg-light overflow-hidden rounded-xs relative">
                    <img src={viewedProd.images[0]} alt={viewedProd.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  </div>
                  <h4 className="text-[0.7rem] font-bold text-text-dark truncate mt-1 leading-tight group-hover:text-accent-gold transition-colors">
                    {viewedProd.name}
                  </h4>
                  <span className="text-[0.65rem] font-bold text-accent-gold font-price-label mt-auto">
                    ${viewedProd.price}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Sizing Guide modal */}
      <Modal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        title={`${product.name} Dimensions`}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted leading-relaxed">
            Please use this guideline to identify size scales matching your residential interior spacing constraints.
          </p>
          <table className="w-full text-left text-sm border-collapse mt-2">
            <thead>
              <tr className="border-b border-black/10 font-bold uppercase text-[0.65rem] tracking-wider text-text-muted">
                <th className="py-2.5">Size Name</th>
                <th className="py-2.5">Height</th>
                <th className="py-2.5">Width / Depth</th>
                <th className="py-2.5">Weight Scale</th>
              </tr>
            </thead>
            <tbody>
              {product.sizes.map((sz) => (
                <tr key={sz} className="border-b border-black/5 text-text-dark font-price-label">
                  <td className="py-3 font-semibold">{sz}</td>
                  <td className="py-3">Standard</td>
                  <td className="py-3">Fits space bounds</td>
                  <td className="py-3">Varies by piece</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Floating Sticky Add-to-Cart Bar */}
      {showStickyBar && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-black/10 shadow-2xl py-3 animate-fade-in hidden lg:block"
          style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}
        >
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-10 h-12 object-cover bg-bg-light rounded-xs border border-black/5"
              />
              <div>
                <h4 className="text-xs font-bold text-text-dark leading-tight">{product.name}</h4>
                <p className="text-[0.65rem] text-text-muted mt-0.5 font-price-label">
                  {selectedSize && `Size: ${selectedSize}`}
                  {selectedColor && ` / Color: ${selectedColor.name}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-base font-bold text-accent-gold font-price-label">
                ${(product.price * qty).toFixed(2)}
              </span>
              <Button
                onClick={handleAddToCart}
                variant="gold"
                disabled={isSoldOut}
                className="py-2 px-6 text-xs font-bold"
              >
                Add to Bag
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default ProductPage;
