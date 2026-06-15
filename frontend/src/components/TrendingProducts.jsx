import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { ShopContext } from '../context/ShopContext';

export default function TrendingProducts() {
  const { setQuickViewProduct, toggleWishlist, isInWishlist, products } = useContext(ShopContext);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Filter products by tag to map dynamically with fallback to prefixed ID
  const trendingProducts = products.filter((p) => p.tag === 'Best Selling' || p.tag === 'Featured' || p.id.startsWith('t'));
  
  // Extra products to load when 'Load More' is clicked
  const extraProducts = products.filter((p) => p.tag === 'Latest' || p.tag === 'New' || p.id.startsWith('w') || p.id.startsWith('n')).slice(0, 4);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    setDisplayedProducts(products.filter((p) => p.tag === 'Best Selling' || p.tag === 'Featured' || p.id.startsWith('t')));
  }, [products]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      // Append extra products
      const newItems = extraProducts.map((p) => ({
        ...p,
        id: `extra-${p.id}`, // change id to prevent key collisons
        name: p.name.replace('Blouse', 'Couture Blouse')
      }));
      setDisplayedProducts([...displayedProducts, ...newItems]);
      setIsLoadingMore(false);
      setVisibleCount((prev) => prev + 4);
    }, 1500); // 1.5s delay to show shimmer loaders
  };

  return (
    <section id="trending" className="py-20 px-4 md:px-8 bg-[#FAF7F0]/40 border-y border-cream-200 overflow-hidden">
      <div className="max-w-[1420px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xxs font-bold text-rose-400 tracking-[0.25em] uppercase font-sans">
            Must-Have Pieces
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-charcoal-900 mt-2 mb-4">
            Trending Products
          </h2>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mb-4" />
          <p className="text-xs md:text-sm text-charcoal-500 max-w-xl mx-auto font-sans leading-relaxed">
            Shop the styles making waves this wedding season, handpicked for their unique embellishments and royal silhouettes.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.slice(0, visibleCount).map((product, idx) => {
            const isFavorite = isInWishlist(product.id);
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
                onMouseEnter={() => setHoveredCardId(product.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="w-full group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200/60 hover:shadow-xl hover:border-rose-200 hover:-translate-y-1.5 transition-all duration-500"
              >
                {/* Image Area with hover widgets */}
                <div className="relative aspect-square w-full overflow-hidden bg-cream-50">
                  <img
                    src={hoveredCardId === product.id && product.hoverImage ? product.hoverImage : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover block group-hover:scale-108 transition-transform duration-[1.2s] ease-out"
                  />





                  
                  <div className="absolute inset-0 bg-charcoal-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <h3 className="font-serif text-sm md:text-base font-bold text-charcoal-900 group-hover:text-rose-500 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-charcoal-500 font-sans mt-0.5">
                      Fabric: {product.fabric}
                    </p>
                  </div>

                  <div className="flex justify-end items-center mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-cream-200">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#AB6970] hover:text-rose-500 border-b border-[#AB6970] hover:border-rose-500 pb-0.5 transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Shimmer skeleton loaders during load more state */}
          {isLoadingMore && (
            [...Array(4)].map((_, i) => (
              <div 
                key={`shimmer-${i}`} 
                className="w-full flex flex-col bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-sm"
              >
                <div className="relative aspect-square shimmer" />
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="h-2 w-16 bg-cream-300 rounded animate-pulse" />
                    <div className="h-4 w-full bg-cream-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-cream-300 rounded animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-cream-200">
                    <div className="h-4 w-20 bg-cream-200 rounded animate-pulse" />
                    <div className="h-3 w-12 bg-cream-300 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {visibleCount < displayedProducts.length + extraProducts.length && (
          <div className="text-center mt-16">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={`bg-charcoal-900 hover:bg-rose-500 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform active:scale-95 ${
                isLoadingMore ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoadingMore ? 'Loading Designs...' : 'Load More Designs'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
