import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartTotal,
    clearCart
  } = useContext(ShopContext);

  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, success

  const handleCheckout = () => {
    setCheckoutStep('success');
    setTimeout(() => {
      clearCart();
      setIsCartOpen(false);
      setCheckoutStep('cart');
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-50"
          />

          {/* Cart Panel */}
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
                <FiShoppingBag className="w-5 h-5 text-rose-500" />
                <span className="font-serif text-lg font-bold text-charcoal-900 tracking-wider">
                  Shopping Bag
                </span>
                <span className="text-xs bg-rose-200 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-charcoal-900 hover:text-rose-500 transition-colors p-1"
                aria-label="Close cart"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Content Drawer */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {checkoutStep === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-10">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-200">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-xs text-charcoal-500 max-w-[280px]">
                    Thank you for shopping with Blouse Avenue. We have sent a confirmation email to you.
                  </p>
                  <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mt-4">
                    Preparing shipment...
                  </span>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
                  <div className="p-4 bg-cream-100 rounded-full text-cream-500">
                    <FiShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-charcoal-800 mb-1">
                      Your Shopping Bag is Empty
                    </h3>
                    <p className="text-xs text-charcoal-400">
                      Explore our premium blouse collections and add items to your cart.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 border border-charcoal-900 hover:bg-charcoal-900 hover:text-white transition-all duration-300 font-bold uppercase tracking-widest text-[10px] py-3 px-6 rounded-full"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}`} 
                    className="flex gap-4 pb-6 border-b border-cream-100 last:border-0 last:pb-0"
                  >
                    <div className="w-20 h-24 bg-cream-50 rounded-lg overflow-hidden border border-cream-200 flex-shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-serif text-sm font-semibold text-charcoal-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="text-charcoal-400 hover:text-rose-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1.5 text-xxs font-semibold text-charcoal-500">
                          <span className="bg-cream-100 px-2 py-0.5 rounded border border-cream-200">
                            Size: {item.selectedSize}
                          </span>
                          <span>•</span>
                          <span>Fabric: {item.product.fabric.split(' ')[0]}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2.5">
                        <div className="flex items-center border border-cream-300 rounded-full bg-cream-50 px-1.5 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            className="p-1 hover:text-rose-500 text-charcoal-500 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-charcoal-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            className="p-1 hover:text-rose-500 text-charcoal-500 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-sm font-bold text-rose-500">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-charcoal-400">
                              (₹{item.product.price.toLocaleString('en-IN')} each)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && checkoutStep === 'cart' && (
              <div className="p-6 border-t border-cream-200 bg-[#FCFBF9] flex flex-col gap-4">
                <div className="flex flex-col gap-2.5 text-xs text-charcoal-600">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-charcoal-900">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">
                      FREE
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & GST (Included)</span>
                    <span className="font-semibold text-charcoal-900">₹0</span>
                  </div>
                  <div className="h-px bg-cream-200 my-1.5" />
                  <div className="flex justify-between text-base font-bold text-charcoal-950">
                    <span className="font-serif">Estimated Total</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-charcoal-900 hover:bg-rose-500 text-white font-semibold uppercase tracking-widest text-xs py-4 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-98 mt-2"
                >
                  Proceed To Secure Checkout
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
