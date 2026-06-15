import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

export default function WishlistDrawer() {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlistItems, 
    toggleWishlist,
    addToCart 
  } = useContext(ShopContext);

  const handleMoveToCart = (product) => {
    addToCart(product, 1, 'M');
    // Remove from wishlist after moving to cart
    toggleWishlist(product);
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Wishlist Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col h-full font-sans"
          >
            {/* Header */}
            <div className="p-6 border-b border-cream-200 flex justify-between items-center bg-[#FAF7F0]">
              <div className="flex items-center gap-2">
                <FiHeart className="w-5 h-5 text-rose-500 fill-current animate-pulse" />
                <span className="font-serif text-lg font-bold text-charcoal-900 tracking-wider">
                  My Wishlist
                </span>
                <span className="text-xs bg-rose-200 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                  {wishlistItems.length}
                </span>
              </div>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="text-charcoal-900 hover:text-rose-500 transition-colors p-1"
                aria-label="Close wishlist"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Content Drawer */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
                  <div className="p-4 bg-cream-100 rounded-full text-cream-500">
                    <FiHeart className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-charcoal-800 mb-1">
                      Your Wishlist is Empty
                    </h3>
                    <p className="text-xs text-charcoal-400">
                      Tap the heart icon on any design to save it here for later.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsWishlistOpen(false)}
                    className="mt-4 border border-charcoal-900 hover:bg-charcoal-900 hover:text-white transition-all duration-300 font-bold uppercase tracking-widest text-[10px] py-3 px-6 rounded-full"
                  >
                    Explore Collections
                  </button>
                </div>
              ) : (
                wishlistItems.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex gap-4 pb-6 border-b border-cream-100 last:border-0 last:pb-0"
                  >
                    <div className="w-20 h-24 bg-cream-50 rounded-lg overflow-hidden border border-cream-200 flex-shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <div>

                            <h4 className="font-serif text-sm font-semibold text-charcoal-900 line-clamp-1">
                              {product.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => toggleWishlist(product)}
                            className="text-charcoal-400 hover:text-rose-500 transition-colors p-1"
                            aria-label="Remove from wishlist"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleMoveToCart(product)}
                          className="flex-1 bg-charcoal-900 hover:bg-rose-500 text-white font-sans text-[10px] font-bold tracking-wider uppercase py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-colors duration-300"
                        >
                          <FiShoppingBag className="w-3 h-3" />
                          Move To Bag
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
