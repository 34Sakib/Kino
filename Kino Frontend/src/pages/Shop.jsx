import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { ProductGrid } from '../components/product/ProductGrid';
import { StarRating } from '../components/shared/StarRating';
import { SlidersHorizontal, X } from 'lucide-react';

export const Shop = () => {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const searchNameQuery = searchParams.get('search') || '';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(1200); // Max product price is $1100
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [visibleCount, setVisibleCount] = useState(6);

  // Sync category state with route slug
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    } else {
      setSelectedCategory('all');
    }
  }, [categorySlug]);

  // Reset pagination on filter update
  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory, priceRange, selectedColors, selectedSizes, minRating, sortBy, searchNameQuery]);

  // Extract all unique colors and sizes from mock product lists for filter options
  const allColors = Array.from(
    new Set(products.flatMap((p) => p.colors || []).map((c) => JSON.stringify(c)))
  ).map((str) => JSON.parse(str));

  const allSizes = Array.from(
    new Set(products.flatMap((p) => p.sizes || []))
  );

  // Toggle handlers for multi-selects
  const handleColorToggle = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName)
        ? prev.filter((c) => c !== colorName)
        : [...prev, colorName]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setMinRating(0);
    setPriceRange(1200);
    if (categorySlug) {
      navigate('/shop');
    }
  };

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    // 2. Search Query Filter
    if (
      searchNameQuery &&
      !product.name.toLowerCase().includes(searchNameQuery.toLowerCase()) &&
      !product.tagline.toLowerCase().includes(searchNameQuery.toLowerCase())
    ) {
      return false;
    }
    // 3. Price Filter
    if (product.price > priceRange) {
      return false;
    }
    // 4. Rating Filter
    if (product.rating < minRating) {
      return false;
    }
    // 5. Colors Filter (match any selected color)
    if (selectedColors.length > 0) {
      const hasMatchingColor = product.colors?.some((color) =>
        selectedColors.includes(color.name)
      );
      if (!hasMatchingColor) return false;
    }
    // 6. Sizes Filter (match any selected size)
    if (selectedSizes.length > 0) {
      const hasMatchingSize = product.sizes?.some((size) =>
        selectedSizes.includes(size)
      );
      if (!hasMatchingSize) return false;
    }
    return true;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // default (Curator's Choice)
  });

  // Paginated list
  const paginatedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen">
      <div className="container">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left flex flex-col gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Atelier Gallery
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl font-medium">
            {categorySlug 
              ? categories.find(c => c.slug === categorySlug)?.name || 'Category'
              : 'Browse All Pieces'
            }
          </h1>
          {searchNameQuery && (
            <p className="text-xs text-text-muted mt-1">
              Search results for: <span className="font-bold text-text-dark font-price-label">"{searchNameQuery}"</span>
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Sidebar Filter Section */}
          <aside className="w-full lg:w-1/4 flex flex-col gap-6 lg:sticky lg:top-24 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
            
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <span className="font-editorial text-lg font-bold flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </span>
              {(selectedColors.length > 0 || selectedSizes.length > 0 || minRating > 0 || priceRange < 1200 || categorySlug) && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-wider font-price-label"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter List (when browsing all) */}
            {!categorySlug && (
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-text-dark">Sanctuary Type</h4>
                <ul className="flex flex-col gap-1.5 text-sm">
                  <li>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`text-left w-full hover:text-accent-gold transition-colors ${
                        selectedCategory === 'all' ? 'text-accent-gold font-bold' : 'text-text-muted'
                      }`}
                    >
                      All Collections ({products.length})
                    </button>
                  </li>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat.id).length;
                    return (
                      <li key={cat.id}>
                        <button
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={`text-left w-full hover:text-accent-gold transition-colors ${
                            selectedCategory === cat.slug ? 'text-accent-gold font-bold' : 'text-text-muted'
                          }`}
                        >
                          {cat.name} ({count})
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Price Filter (Range Slider) */}
            <div className="flex flex-col gap-2.5 border-t border-black/5 pt-4">
              <div className="flex justify-between text-xs uppercase tracking-wider font-semibold">
                <span className="text-text-dark">Max Price</span>
                <span className="text-accent-gold font-bold font-price-label">${priceRange}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-accent-gold h-1 bg-black/5 rounded-full"
              />
            </div>

            {/* Color Swatch Selectors */}
            <div className="flex flex-col gap-2.5 border-t border-black/5 pt-4">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-text-dark">Texture Palette</h4>
              <div className="flex flex-wrap gap-2">
                {allColors.map((color) => {
                  const isSelected = selectedColors.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() => handleColorToggle(color.name)}
                      className={`w-6 h-6 rounded-full border border-solid transition-all duration-300 relative ${
                        isSelected 
                          ? 'ring-2 ring-accent-gold ring-offset-2 scale-105 border-transparent' 
                          : 'border-black/10 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selector Box Filters */}
            <div className="flex flex-col gap-2.5 border-t border-black/5 pt-4">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-text-dark">Scale Size</h4>
              <div className="flex flex-wrap gap-1.5">
                {allSizes.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider border rounded-xs transition-colors duration-300 ${
                        isSelected
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-text-muted border-black/10 hover:border-black/30'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating Star Selectors */}
            <div className="flex flex-col gap-2.5 border-t border-black/5 pt-4">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-text-dark">Minimum Review</h4>
              <div className="flex flex-col gap-1.5">
                {[5, 4, 3].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars === minRating ? 0 : stars)}
                    className={`flex items-center gap-2 hover:text-accent-gold transition-colors text-left text-sm ${
                      minRating === stars ? 'text-accent-gold font-bold' : 'text-text-muted'
                    }`}
                  >
                    <StarRating rating={stars} size={14} />
                    <span>{stars}.0 & Up</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Right Main Grid Panel */}
          <main className="w-full lg:w-3/4 flex flex-col gap-6">
            
            {/* Top Sort and Info Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-black/5 pb-4 gap-4">
              <span className="text-xs text-text-muted font-price-label">
                Showing {sortedProducts.length} unique pieces
              </span>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="py-1 px-3 text-xs bg-white border border-black/10 rounded-sm font-semibold text-text-dark"
                  style={{ width: 'auto' }}
                >
                  <option value="default">Curator's Choice</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Active Chips Row */}
            {(selectedColors.length > 0 || selectedSizes.length > 0 || minRating > 0 || priceRange < 1200) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted mr-1">Active:</span>
                
                {priceRange < 1200 && (
                  <span className="text-[0.65rem] bg-bg-light px-2.5 py-1 rounded-full flex items-center gap-1 font-bold font-price-label text-text-dark">
                    Under ${priceRange}
                    <X size={10} className="cursor-pointer" onClick={() => setPriceRange(1200)} />
                  </span>
                )}

                {selectedColors.map((color) => (
                  <span key={color} className="text-[0.65rem] bg-bg-light px-2.5 py-1 rounded-full flex items-center gap-1 font-bold text-text-dark">
                    Color: {color}
                    <X size={10} className="cursor-pointer" onClick={() => handleColorToggle(color)} />
                  </span>
                ))}

                {selectedSizes.map((size) => (
                  <span key={size} className="text-[0.65rem] bg-bg-light px-2.5 py-1 rounded-full flex items-center gap-1 font-bold text-text-dark">
                    Size: {size}
                    <X size={10} className="cursor-pointer" onClick={() => handleSizeToggle(size)} />
                  </span>
                ))}

                {minRating > 0 && (
                  <span className="text-[0.65rem] bg-bg-light px-2.5 py-1 rounded-full flex items-center gap-1 font-bold text-text-dark">
                    Rating: {minRating}.0+
                    <X size={10} className="cursor-pointer" onClick={() => setMinRating(0)} />
                  </span>
                )}
              </div>
            )}

            {/* Product Card Grid */}
            <div className="mt-2">
              <ProductGrid products={paginatedProducts} columns={3} />
            </div>

            {/* Simulated Load More Pagination */}
            {sortedProducts.length > visibleCount && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="btn-outline px-8 py-2.5 font-bold tracking-widest text-xs"
                >
                  Load More Pieces
                </button>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
};
export default Shop;
