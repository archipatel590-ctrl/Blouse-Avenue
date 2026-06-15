import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

export default function WatchShop() {
  const { setQuickViewProduct, toggleWishlist, isInWishlist, products } = useContext(ShopContext);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // We filter products configured to be displayed in Watch & Shop
  const watchProducts = products.filter(p => p.showInWatchShop);

  return (
    <section id="watch-shop" className="py-12 md:py-20 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-[1420px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <span className="text-xxs font-bold text-rose-400 tracking-[0.25em] uppercase font-sans">
            Editorial Lookbook
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-charcoal-900 mt-2 mb-4">
            Watch & Shop
          </h2>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mb-4" />
          <p className="text-xs md:text-sm text-charcoal-500 max-w-xl mx-auto font-sans leading-relaxed">
            Experience the drape, fabric motion, and detailed craftsmanship of our signature blouses in action.
          </p>
        </div>

        {/* 4 Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {watchProducts.map((product, idx) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                onMouseEnter={() => setHoveredCardId(product.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="w-full group flex flex-col bg-[#FAF7F0]/30 rounded-2xl overflow-hidden shadow-sm border border-cream-200/50 hover:shadow-xl hover:border-rose-100 transition-all duration-500"
              >
                {/* Visual Area */}
                <div className="relative aspect-square w-full overflow-hidden bg-cream-100">
                  <img
                    src={hoveredCardId === product.id && product.hoverImage ? product.hoverImage : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover block group-hover:scale-108 transition-transform duration-[1.5s] ease-out"
                  />
                  
                  {/* Badges */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10">
                      <span className="bg-rose-500 text-white font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded">
                        -{discount}% Off
                      </span>
                    </div>
                  )}

                  {/* Play Catwalk / Quick View Overlay */}
                  <div className="absolute inset-0 bg-charcoal-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="bg-white hover:bg-rose-500 text-charcoal-900 hover:text-white p-3 sm:p-4 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 font-sans font-bold uppercase text-[8px] sm:text-[10px] tracking-widest"
                    >
                      <FiPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Info Card Area */}
                <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-rose-400 uppercase font-sans block mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-xs sm:text-base font-bold text-charcoal-900 group-hover:text-rose-500 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[10px] sm:text-xxs font-sans text-charcoal-500 mt-1">
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
        </div>
      </div>
    </section>
  );
}
