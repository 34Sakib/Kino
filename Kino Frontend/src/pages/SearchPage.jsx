import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductGrid } from '../components/product/ProductGrid';
import { Search as SearchIcon, Trash2, ArrowRight } from 'lucide-react';

const TRENDING_SEARCHES = ['Travertine', 'Lounge Chair', 'Ceramic set', 'Pendant', 'Bedding'];

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(queryParam);
  const [history, setHistory] = useState([]);

  // Sync inputs with URL queries
  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kino-search-history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  const executeSearch = (term) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    // Update query params
    setSearchParams({ q: cleanTerm });

    // Save to history
    setHistory((prev) => {
      const updated = [cleanTerm, ...prev.filter((h) => h !== cleanTerm)].slice(0, 5); // Limit 5
      localStorage.setItem('kino-search-history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('kino-search-history');
  };

  // Filter products
  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(queryParam.toLowerCase()) ||
      p.tagline.toLowerCase().includes(queryParam.toLowerCase()) ||
      p.category.toLowerCase().includes(queryParam.toLowerCase())
  );

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none animate-fade-in">
      <div className="container max-w-5xl">
        
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto mb-10 flex items-center">
          <input
            type="text"
            placeholder="Search our silent designs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pr-12 pl-5 py-3 text-base rounded-full border border-black/10 focus:border-accent-gold"
          />
          <button
            type="submit"
            className="absolute right-4 text-text-dark hover:text-accent-gold p-1"
          >
            <SearchIcon size={20} />
          </button>
        </form>

        {queryParam ? (
          /* Search Results */
          <div>
            <div className="border-b border-black/5 pb-4 mb-8 flex items-center justify-between">
              <h2 className="font-editorial text-2xl font-bold text-text-dark">
                Results for "{queryParam}"
              </h2>
              <span className="text-xs text-text-muted font-price-label">
                Found {results.length} pieces
              </span>
            </div>

            {results.length === 0 ? (
              /* No Results State */
              <div className="text-center py-16 flex flex-col items-center gap-4 max-w-md mx-auto">
                <p className="font-editorial text-2xl italic text-text-muted leading-relaxed">
                  No pieces found matching your current query.
                </p>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Our collections are inspired by quiet textures. Try typing "Oak", "Vessel", or browse categories directly.
                </p>
                
                {/* Category Links suggestions */}
                <div className="flex flex-col gap-2 mt-4 w-full">
                  <Link to="/shop/living-room" className="btn-outline justify-between py-2 text-xs font-bold w-full uppercase tracking-wider">
                    Browse Living Room <ArrowRight size={12} />
                  </Link>
                  <Link to="/shop/lighting" className="btn-outline justify-between py-2 text-xs font-bold w-full uppercase tracking-wider">
                    Browse Lighting <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ) : (
              <ProductGrid products={results} columns={3} />
            )}
          </div>
        ) : (
          /* Empty focused search dashboard */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 max-w-3xl mx-auto">
            
            {/* Trending Section */}
            <div className="flex flex-col gap-4">
              <h3 className="font-editorial text-lg font-bold border-b border-black/5 pb-2">
                Trending Searches
              </h3>
              <div className="flex flex-wrap gap-2.5 mt-2">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => executeSearch(term)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-solid border-black/5 bg-bg-light/35 rounded-full hover:border-accent-gold hover:text-accent-gold transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* History Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-black/5 pb-2">
                <h3 className="font-editorial text-lg font-bold">Recent History</h3>
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-[0.65rem] text-red-500 hover:text-red-700 uppercase tracking-widest font-bold flex items-center gap-1"
                  >
                    <Trash2 size={10} /> Clear
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="text-xs text-text-muted mt-2 italic">Your search history is empty.</p>
              ) : (
                <ul className="flex flex-col gap-2.5 mt-2">
                  {history.map((term, idx) => (
                    <li key={idx} className="border-b border-black/5 pb-2.5">
                      <button
                        onClick={() => executeSearch(term)}
                        className="text-sm font-semibold text-text-muted hover:text-accent-gold transition-colors text-left flex items-center gap-2"
                      >
                        <SearchIcon size={12} /> {term}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
export default SearchPage;
