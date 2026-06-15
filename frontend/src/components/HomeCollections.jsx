import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';

import { ShopContext } from '../context/ShopContext';

export default function HomeCollections() {
  const { setQuickViewProduct, toggleWishlist, isInWishlist, products } = useContext(ShopContext);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const categories = [
    {
      name: 'Saree Wear Blouses',
      tagline: 'Classic Heritage & Zari',
      desc: 'Elegant Banarasi brocades and handloom silk blouses designed to complement your finest drapes with absolute grace.'
    },
    {
      name: 'Navratri Special',
      tagline: 'Festive Colors & Mirrors',
      desc: 'Vibrant mirror-work, Kutchi handloom cottons, and colorful patchwork blouses to light up festive dance nights.'
    },
    {
      name: 'Party Wear Blouses',
      tagline: 'Modern Glitz & Glamour',
      desc: 'Sleek sequins, daring halter backs, and modern plunge necklines crafted for contemporary evening events.'
    },
    {
      name: 'Best Sellers',
      tagline: 'Highly Coveted Designs',
      desc: 'The most popular, highly-rated designs that are defining ethnic luxury couture this season.'
    }
  ];

  return (
    <div className="flex flex-col gap-12 md:gap-24 py-6 md:py-10">
      {categories.map((cat, catIdx) => {
        const catProducts = products.filter((p) => {
          if (p.showOnHomepage === false) return false;

          if (p.categories && p.categories.length > 0) {
            return p.categories.includes(cat.name);
          }
          if (p.category) {
            return p.category === cat.name;
          }
          // Fallback tag mapping for mock data compatibility
          if (cat.name === 'Best Sellers') return p.tag === 'Best Selling';
          if (cat.name === 'Bridal Collection') return p.tag === 'Featured';
          if (cat.name === 'Navratri Special') return p.tag === 'New';
          if (cat.name === 'Party Wear Blouses') return p.tag === 'Latest';
          return false;
        });

        // Hide section if empty
        if (catProducts.length === 0) return null;

        return (
          <section 
            key={cat.name} 
            className={`py-10 md:py-16 px-4 md:px-8 border-b border-cream-200/50 last:border-0 overflow-hidden ${
              catIdx % 2 === 0 ? 'bg-[#FAF7F0]/30' : 'bg-white'
            }`}
          >
            <div className="max-w-[1420px] mx-auto">
              {/* Section Header */}
              <div className="text-center mb-8 md:mb-16">
                <span className="text-xxs font-bold text-[#AB6970] tracking-[0.25em] uppercase font-sans">
                  {cat.tagline}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold font-serif text-charcoal-900 mt-2 mb-4">
                  {cat.name}
                </h2>
                <div className="w-16 h-0.5 bg-rose-200/80 mx-auto mb-4" />
                <p className="text-xs md:text-sm text-charcoal-500 max-w-xl mx-auto font-sans leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {catProducts.slice(0, 4).map((product, idx) => {
                  const isFavorite = isInWishlist(product.id);
                  const discount = product.originalPrice
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
                      onMouseEnter={() => setHoveredCardId(product.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                      className="w-full group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200/60 hover:shadow-xl hover:border-rose-200 hover:-translate-y-1.5 transition-all duration-500"
                    >
                      {/* Image Area with hover widgets */}
                      <div 
                        onClick={() => setQuickViewProduct(product)}
                        className="relative aspect-square w-full overflow-hidden bg-cream-50 cursor-pointer"
                      >
                        <img
                          src={hoveredCardId === product.id && product.hoverImage ? product.hoverImage : product.image}
                          alt={product.name}
                          className="w-full h-full object-cover block group-hover:scale-108 transition-transform duration-[1.2s] ease-out"
                        />



                        
                        <div className="absolute inset-0 bg-charcoal-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Details */}
                      <div className="p-3.5 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                        <div>
                          <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-[#AB6970] uppercase font-sans block mb-1">
                            {product.category || cat.name}
                          </span>
                          <h3 className="font-serif text-xs sm:text-base font-bold text-charcoal-900 group-hover:text-rose-500 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-[9px] sm:text-[10px] text-charcoal-500 font-sans mt-0.5">
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
      })}
    </div>
  );
}
