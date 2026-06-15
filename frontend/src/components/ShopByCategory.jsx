import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { categories } from '../data/products';
import { ShopContext } from '../context/ShopContext';

export default function ShopByCategory() {
  const { setActivePage } = useContext(ShopContext);

  const handleCategoryClick = (categoryName) => {
    setActivePage({ type: 'category', value: categoryName });
  };

  return (
    <section id="categories" className="py-12 md:py-20 px-4 md:px-8 bg-[#FAF7F0] overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <span className="text-xxs font-bold text-rose-400 tracking-[0.25em] uppercase font-sans">
            Curated Styles
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-charcoal-900 mt-2 mb-4">
            Shop By Category
          </h2>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mb-4" />
          <p className="text-xs md:text-sm text-charcoal-500 max-w-xl mx-auto font-sans leading-relaxed">
            Discover tailored silhouettes and designs suited for weddings, cocktail hours, and cultural celebrations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative group h-[250px] sm:h-[400px] rounded-3xl overflow-hidden shadow-md cursor-pointer border border-cream-200"
            >
              {/* Background Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-[1.5s] ease-out"
              />

              {/* Black Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/25 to-transparent group-hover:from-charcoal-950/90 transition-all duration-300" />

              {/* Text Content Overlay */}
              <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-end items-center text-center">


                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold font-serif text-white tracking-wide mb-2 sm:mb-4">
                  {category.name}
                </h3>

                <span className="inline-block text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-white border border-white/40 group-hover:border-white group-hover:bg-white group-hover:text-charcoal-900 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                  Explore Designs
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
