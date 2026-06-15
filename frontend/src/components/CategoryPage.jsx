import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiFilter, FiChevronDown, FiStar, FiGrid, FiList } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

// Framer Motion Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 16 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
    transition: { duration: 0.25 }
  }
};

const headerTextVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 }
  }
};

export default function CategoryPage() {
  const {
    activePage,
    setActivePage,
    setQuickViewProduct,
    toggleWishlist,
    isInWishlist,
    products
  } = useContext(ShopContext);

  const [sortBy, setSortBy] = useState('featured');
  const [selectedFabric, setSelectedFabric] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredTab, setHoveredTab] = useState(null);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Determine current category
  const categoryName = activePage?.value || 'Saree Wear Blouses';

  // Filter products by category (with fallback to tag for mock data)
  const categoryProducts = products.filter((product) => {
    if (product.categories && product.categories.length > 0) {
      return product.categories.includes(categoryName);
    }
    if (product.category) {
      return product.category === categoryName;
    }

    // Fallback tag mapping for mock data
    if (categoryName === 'Best Sellers') {
      return product.tag === 'Best Selling';
    }
    if (categoryName === 'Navratri Special') {
      return product.tag === 'New';
    }
    if (categoryName === 'Party Wear Blouses') {
      return product.tag === 'Latest';
    }
    return product.tag === 'Latest' || product.tag === 'New';
  });

  // Get all unique fabrics for filter options
  const fabrics = ['all', ...new Set(categoryProducts.map(p => p.fabric ? p.fabric.split(' ')[0] : ''))];
  const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  // Apply filters and sorting
  const filteredAndSortedProducts = [...categoryProducts]
    .filter(p => {
      if (selectedFabric !== 'all' && p.fabric && !p.fabric.toLowerCase().includes(selectedFabric.toLowerCase())) return false;
      const productSizes = p.sizes || ['S', 'M', 'L'];
      if (selectedSize !== 'all' && !productSizes.includes(selectedSize)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0; // featured / default
    });

  // Category Banner styling matching details
  const bannerDetails = {
    'Saree Wear Blouses': {
      title: 'Saree Wear Blouses',
      subtitle: 'Classic Heritage & Zari',
      desc: 'Elegant Banarasi brocades and handloom silk blouses designed to complement your finest drapes with absolute grace.',
      bgGradient: 'from-charcoal-950 via-[#221c10] to-charcoal-950',
      bgImage: 'https://cdn.jumpshare.com/preview/uH4lLMMc0r42YuL5OUkb8WNam1xiUfJ6Euw9QEIj2whbKyqTUTgfQk5x56hPadEMCg50fK94jsjSSjayr4CkeaTkP47lCqHj_oiBaeLXr_yDeASiWMaHGlkxfqBs6clF',
      accentColor: 'text-gold-500',
      tagColor: 'bg-gold-50 text-gold-700 border-gold-200',
      overlayClass: 'bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)]'
    },
    'Navratri Special': {
      title: 'Navratri Special',
      subtitle: 'Festive Colors & Mirrors',
      desc: 'Vibrant mirror-work, Kutchi handloom cottons, and colorful patchwork blouses to light up festive dance nights.',
      bgGradient: 'from-charcoal-950 via-[#321c1f] to-charcoal-950',
      bgImage: 'https://cdn.jumpshare.com/preview/Vc7tZWlbbBmzRjIi7Y68LtqJIRigFoHBDLdwifZINuZ-9DdqNkHIgeV_IipSKI33Cg50fK94jsjSSjayr4CkeR9EZvPbvIIYDRRsM6IrXsaDeASiWMaHGlkxfqBs6clF',
      accentColor: 'text-rose-400',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
      overlayClass: 'bg-[radial-gradient(#ab6970_1.5px,transparent_1.5px)]'
    },
    'Party Wear Blouses': {
      title: 'Party Wear Blouses',
      subtitle: 'Modern Glitz & Glamour',
      desc: 'Sleek sequins, daring halter backs, and modern plunge necklines crafted for contemporary evening events.',
      bgGradient: 'from-charcoal-950 via-[#181214] to-black',
      bgImage: 'https://cdn.jumpshare.com/preview/oVps4ZRmPVQIu1P1KZf1Vuy9yZPwZXk7cgxABDBWr3GxN5mifzf5YHxaNaWl4tE1Cg50fK94jsjSSjayr4CkeRtjLTD1cIBByb04e4T3NOWDeASiWMaHGlkxfqBs6clF',
      accentColor: 'text-rose-400',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
      overlayClass: 'bg-[radial-gradient(#ab6970_1.5px,transparent_1.5px)]'
    },

    'Best Sellers': {
      title: 'Best Sellers',
      subtitle: 'Highly Coveted Designs',
      desc: 'The most popular, highly-rated designs that are defining ethnic luxury couture this season.',
      bgGradient: 'from-charcoal-950 via-charcoal-900 to-[#1f1a10]',
      bgImage: 'https://cdn.jumpshare.com/preview/i798cbLnKphNF2J6IkXvLY_CdynztU2hwCynjYXNSHvmiAJFoLjxAPGKdx5HE0uzCg50fK94jsjSSjayr4CkeT5EJjArL4tau69Sc7pfYy6DeASiWMaHGlkxfqBs6clF',
      accentColor: 'text-gold-500',
      tagColor: 'bg-gold-50 text-gold-700 border-gold-200',
      overlayClass: 'bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)]'
    }
  };

  const details = bannerDetails[categoryName] || {
    title: categoryName,
    subtitle: 'Luxury Collection',
    desc: 'Exquisite custom tailored designer blouses made to pair with your favorite ensembles.',
    bgGradient: 'from-charcoal-950 via-charcoal-900/60 to-black',
    bgImage: 'https://cdn.jumpshare.com/preview/i798cbLnKphNF2J6IkXvLY_CdynztU2hwCynjYXNSHvmiAJFoLjxAPGKdx5HE0uzCg50fK94jsjSSjayr4CkeT5EJjArL4tau69Sc7pfYy6DeASiWMaHGlkxfqBs6clF',
    accentColor: 'text-rose-500',
    tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
    overlayClass: 'bg-[radial-gradient(#ab6970_1.5px,transparent_1.5px)]'
  };

  const categoriesList = [
    { label: 'Saree Wear', value: 'Saree Wear Blouses' },
    { label: 'Navratri Special', value: 'Navratri Special' },
    { label: 'Party Wear', value: 'Party Wear Blouses' },
    { label: 'Best Sellers', value: 'Best Sellers' }
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-charcoal-900 pb-24 font-sans overflow-hidden">
      {/* Category Hero Banner */}
      <div className="relative w-full h-[360px] md:h-[420px] bg-charcoal-950 overflow-hidden shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={categoryName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {/* Background Image */}
            {details.bgImage && (
              <img
                src={details.bgImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center opacity-55 pointer-events-none select-none"
              />
            )}

            {/* Dynamic Dot Pattern Background Decor */}
            <div className={`absolute inset-0 opacity-15 ${details.overlayClass} [background-size:20px_20px]`} />

            {/* Color Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${details.bgGradient} mix-blend-multiply opacity-75`} />

            {/* Abstract Glowing Aura Circles */}
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-rose-500/15 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[120px] animate-pulse" />

            <div className="max-w-[1420px] mx-auto w-full px-4 md:px-8 relative z-10 text-white flex flex-col items-center text-center">
              {/* Back to home floating link */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePage({ type: 'home' })}
                className="flex items-center gap-2 mb-8 text-xxs uppercase tracking-[0.25em] text-cream-200 hover:text-white transition-colors py-2 px-4 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm shadow-sm"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                Home Layout
              </motion.button>

              {/* Staggered animated header texts */}
              <motion.span
                variants={headerTextVariants}
                initial="hidden"
                animate="show"
                className="text-[10px] font-bold text-gold-300 tracking-[0.35em] uppercase mb-3"
              >
                {details.subtitle}
              </motion.span>
              <motion.h1
                variants={headerTextVariants}
                initial="hidden"
                animate="show"
                className="text-4xl md:text-6xl font-extrabold font-serif tracking-wide mb-5 leading-tight text-white drop-shadow-md"
              >
                {details.title}
              </motion.h1>
              <motion.p
                variants={headerTextVariants}
                initial="hidden"
                animate="show"
                className="text-xs md:text-sm text-cream-100 max-w-2xl font-sans leading-relaxed font-light drop-shadow"
              >
                {details.desc}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Categories Horizontal Navigation Slider */}
      <div className="w-full bg-white border-b border-cream-200 sticky top-[80px] z-30 shadow-sm">
        <div className="max-w-[1420px] mx-auto px-4 md:px-8 py-4 flex items-center justify-start md:justify-center overflow-x-auto scroll-smooth">
          <div className="flex items-center gap-2 md:gap-4 whitespace-nowrap bg-cream-50/60 p-1.5 rounded-full border border-cream-200">
            {categoriesList.map((cat) => {
              const isActive = categoryName === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActivePage({ type: 'category', value: cat.value })}
                  onMouseEnter={() => setHoveredTab(cat.value)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`relative px-5 py-2 text-xxs md:text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 rounded-full ${isActive ? 'text-white' : 'text-charcoal-800 hover:text-rose-500'
                    }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-charcoal-900 rounded-full -z-10 shadow-md"
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    />
                  )}
                  {hoveredTab === cat.value && !isActive && (
                    <motion.span
                      layoutId="hoverTabBackground"
                      className="absolute inset-0 bg-rose-50/70 border border-rose-100/50 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    />
                  )}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1420px] mx-auto px-4 md:px-8 mt-12 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={categoryName}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full relative"
          >
            {/* Glowing Backdrop Auras */}
            <motion.div
              animate={{
                x: [0, 40, -20, 0],
                y: [0, -30, 40, 0],
                scale: [1, 1.1, 0.95, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 left-10 w-[300px] h-[300px] bg-rose-200/20 rounded-full blur-[90px] -z-10 pointer-events-none"
            />
            <motion.div
              animate={{
                x: [0, -50, 30, 0],
                y: [0, 40, -30, 0],
                scale: [1, 0.9, 1.1, 1],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-1/4 right-10 w-[350px] h-[350px] bg-gold-200/15 rounded-full blur-[100px] -z-10 pointer-events-none"
            />
            {/* Products Grid Section */}
            <div className="mt-10">
              <AnimatePresence mode="wait">
                {filteredAndSortedProducts.length > 0 ? (
                  <motion.div
                    key={categoryName + '-' + sortBy + '-' + selectedFabric + '-' + selectedSize}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                  >
                    {filteredAndSortedProducts.map((product, idx) => {
                      const isFavorite = isInWishlist(product.id);

                      return (
                        <motion.div
                          key={product.id}
                          variants={cardVariants}
                          layout
                          whileHover={{
                            y: -10,
                            transition: { type: 'spring', stiffness: 260, damping: 20 }
                          }}
                          onMouseEnter={() => setHoveredCardId(product.id)}
                          onMouseLeave={() => setHoveredCardId(null)}
                          className="w-full group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-cream-200/80 hover:shadow-2xl hover:border-rose-200/90 transition-shadow transition-colors duration-300 relative"
                        >
                          {/* Product Visual Area */}
                          <div
                            onClick={() => setQuickViewProduct(product)}
                            className="relative aspect-square w-full overflow-hidden bg-[#FAF8F5] cursor-pointer"
                          >
                            {/* Elegant overlay shadow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                            {/* Image Switcher on Hover */}
                            <img
                              src={hoveredCardId === product.id && product.hoverImage ? product.hoverImage : product.image}
                              alt={product.name}
                              className="w-full h-full object-cover block scale-100 group-hover:scale-106 transition-transform duration-[1.5s] ease-out"
                            />



                          </div>

                          {/* Details Area */}
                          <div className="p-3.5 sm:p-6 flex flex-col justify-between flex-1 relative bg-white">
                            <div>


                              {/* Product Title */}
                              <h3 className="font-serif text-xs sm:text-base font-bold text-charcoal-950 group-hover:text-rose-500 transition-colors line-clamp-1 mb-1.5">
                                {product.name}
                              </h3>

                              {/* Specs */}
                              <div className="flex items-center gap-3 text-[9px] sm:text-[10px] text-charcoal-400 font-sans font-light">
                                <span>Fabric: <strong className="font-semibold text-charcoal-600">{product.fabric}</strong></span>
                              </div>
                            </div>

                            {/* Details footer */}
                            <div className="flex justify-end items-center mt-3.5 pt-3 sm:mt-5 sm:pt-4 border-t border-cream-100">
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
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 bg-white border border-cream-200 rounded-[32px] shadow-sm max-w-lg mx-auto"
                  >
                    <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-cream-100">
                      <FiFilter className="w-6 h-6 text-charcoal-400 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold font-serif text-charcoal-900 mb-2">No Matches Found</h3>
                    <p className="text-xs text-charcoal-500 max-w-sm mx-auto leading-relaxed mb-8">
                      We couldn't find any premium designs matching your selected combination of sizes or fabrics in this category.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedFabric('all');
                        setSelectedSize('all');
                      }}
                      className="bg-charcoal-950 hover:bg-rose-500 text-white font-bold uppercase tracking-widest text-xxs py-3 px-8 rounded-full shadow-md transition-colors"
                    >
                      Reset Filtering
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
