import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';

import { ShopContext } from '../context/ShopContext';

export default function NewArrivals() {
  const { setQuickViewProduct, toggleWishlist, isInWishlist, products } = useContext(ShopContext);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Filter products by tag to map dynamically with fallback to prefixed ID
  const newProducts = products.filter((p) => p.tag === 'Latest' || p.tag === 'New' || p.tag === 'Featured' || p.id.startsWith('n'));

  return (
    <section id="new-arrivals" className="py-20 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-[1420px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xxs font-bold text-rose-400 tracking-[0.25em] uppercase font-sans">
            Fresh Off The Runway
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-charcoal-900 mt-2 mb-4">
            New Arrivals
          </h2>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mb-4" />
          <p className="text-xs md:text-sm text-charcoal-500 max-w-xl mx-auto font-sans leading-relaxed">
            Be the first to wear our latest handcrafted creations, combining vintage heritage and modern cuts.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product, idx) => {
            const isFavorite = isInWishlist(product.id);
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredCardId(product.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="w-full group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200 hover:shadow-xl hover:border-rose-100 transition-all duration-500"
              >
                {/* Image Area with hover widgets */}
                <div className="relative aspect-square w-full overflow-hidden bg-cream-50">
                  <img
                    src={hoveredCardId === product.id && product.hoverImage ? product.hoverImage : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover block group-hover:scale-108 transition-transform duration-[1.2s] ease-out"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    <span className="bg-rose-400 text-white font-sans text-[8px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full shadow-sm">
                      NEW
                    </span>
                    {product.isSale && (
                      <span className="bg-rose-500 text-white font-sans text-[8px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full shadow-sm">
                        -{discount}%
                      </span>
                    )}
                  </div>



                  
                  {/* Subtle Shading on Hover */}
                  <div className="absolute inset-0 bg-charcoal-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Details Area */}
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
        </div>
      </div>
    </section>
  );
}
