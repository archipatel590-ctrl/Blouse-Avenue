import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

export default function SearchOverlay() {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct, products } = useContext(ShopContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Handle live search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.tag && product.tag.toLowerCase().includes(query)) ||
        product.fabric.toLowerCase().includes(query) ||
        product.color.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  const handleResultClick = (product) => {
    setQuickViewProduct(product);
    setIsSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 glass flex flex-col font-sans"
        >
          {/* Header Close Bar */}
          <div className="flex justify-end p-6 md:p-8">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-3 bg-white text-charcoal-900 rounded-full shadow-md hover:bg-rose-50 hover:text-rose-500 transition-colors"
              aria-label="Close search"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Search Box Panel */}
          <div className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 max-w-3xl mx-auto w-full pt-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-900 mb-2 text-center">
              What are you looking for?
            </h2>
            <p className="text-xs text-charcoal-400 mb-8 tracking-widest uppercase text-center">
              Search Bridal, Saree Wear, Navratri, Party wear collections
            </p>

            {/* Input Bar */}
            <div className="w-full relative flex items-center border-b-2 border-charcoal-800 pb-3 mb-10">
              <FiSearch className="w-6 h-6 text-charcoal-400 absolute left-1" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blouses by fabric, pattern, or collection..."
                className="w-full pl-10 pr-4 bg-transparent outline-none text-lg md:text-2xl font-serif text-charcoal-950 placeholder-cream-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-charcoal-400 hover:text-charcoal-900 font-bold uppercase text-[10px] tracking-widest font-sans"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Search Results */}
            <div className="w-full overflow-y-auto max-h-[55vh] pr-2 flex flex-col gap-4">
              {searchQuery.trim() === '' ? (
                // Quick Search Suggestion Tags
                <div className="flex flex-col items-center">
                  <span className="text-xxs font-bold text-charcoal-400 tracking-widest uppercase mb-3.5">
                    Popular Searches
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Velvet', 'Banarasi', 'Mirror Work', 'Bridal', 'Sequin', 'Pink', 'Halter'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="text-xs font-semibold px-4.5 py-2 rounded-full border border-cream-300 bg-white/50 text-charcoal-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300 font-sans"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                // No Results
                <div className="text-center py-10">
                  <p className="text-charcoal-500 font-serif text-base">
                    No results found for <span className="font-semibold text-charcoal-800">"{searchQuery}"</span>
                  </p>
                  <p className="text-xs text-charcoal-400 font-sans mt-1">
                    Try checking spelling or exploring other keywords like 'silk' or 'red'.
                  </p>
                </div>
              ) : (
                // Results List
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleResultClick(product)}
                      className="flex gap-4 p-3 bg-white hover:bg-cream-100/50 rounded-xl border border-cream-200 hover:border-rose-200 transition-all duration-300 cursor-pointer shadow-sm group"
                    >
                      <div className="w-16 h-20 bg-cream-50 rounded-lg overflow-hidden border border-cream-200 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">

                        <h4 className="font-serif text-sm font-bold text-charcoal-900 group-hover:text-rose-500 transition-colors line-clamp-1">
                          {product.name}
                        </h4>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
