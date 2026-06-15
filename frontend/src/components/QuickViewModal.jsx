import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

const WhatsAppIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 448 512"
    className="w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useContext(ShopContext);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImage(quickViewProduct.image);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleClose = () => {
    setQuickViewProduct(null);
  };

  const whatsappNumber = '919558821758';
  const skuNumber = (quickViewProduct.sku || '001').match(/\d+/)?.[0] || '001';
  const imageUrl = quickViewProduct.image.startsWith('data:')
    ? ''
    : (quickViewProduct.image.startsWith('http')
        ? quickViewProduct.image
        : `${window.location.origin}${quickViewProduct.image}`);

  const sparkles = String.fromCodePoint(0x2728);
  const dress = String.fromCodePoint(0x1F457);
  const blossom = String.fromCodePoint(0x1F338);
  const camera = String.fromCodePoint(0x1F4F8);

  const imageSection = imageUrl ? `\n${camera} *Product Image:*\n${imageUrl}\n` : '';

  const whatsappMessageText = `${sparkles} *BLOUSE AVENUE | Couture Inquiry* ${sparkles}

Hello Blouse Avenue, I am absolutely in love with this premium designer creation! I would like to inquire about purchasing:

${dress} *Product Details:*
• *Name:* ${quickViewProduct.name}
• *Code / SKU:* #${skuNumber}
• *Fabric:* ${quickViewProduct.fabric || 'N/A'}
• *Color:* ${quickViewProduct.color || 'N/A'}${imageSection}
Please guide me through the custom fitting and purchase process. Thank you! ${blossom}`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessageText)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-charcoal-950/45 backdrop-blur-md"
        />

        {/* Modal content box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative bg-white w-full max-w-5xl rounded-3xl shadow-[0_25px_60px_-15px_rgba(171,105,112,0.18)] overflow-hidden z-10 flex flex-col md:flex-row max-h-[95vh] md:max-h-[85vh] border border-[#AB6970]/10"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 sm:p-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-md text-charcoal-900 border border-cream-200/50 hover:bg-[#AB6970] hover:text-white hover:rotate-90 hover:scale-105 transition-all duration-300 z-30 cursor-pointer"
            aria-label="Close modal"
          >
            <FiX className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Left: Product Images */}
          <div className="w-full md:w-[52%] flex flex-col bg-gradient-to-tr from-[#FAF7F0] via-white to-[#F3EDE2]/50 p-4 sm:p-6 md:p-8 justify-between items-center relative overflow-hidden group">
            {/* Subtle decorative color glow */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-rose-200/20 blur-[60px] pointer-events-none" />
            
            <div className="relative w-full flex-1 flex items-center justify-center min-h-[160px] sm:min-h-[220px] md:min-h-[400px] overflow-hidden rounded-2xl bg-white/60 border border-cream-200/60 p-2 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)] z-10">
              <motion.img
                key={activeImage || quickViewProduct.image}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={activeImage || quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-contain max-h-[140px] sm:max-h-[200px] md:max-h-[380px] hover:scale-103 transition-transform duration-700 ease-out"
              />
            </div>
            
            {quickViewProduct.hoverImage && (
              <div className="flex gap-3 mt-3 sm:mt-5 justify-center z-10">
                <button
                  type="button"
                  onClick={() => setActiveImage(quickViewProduct.image)}
                  className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-sm ${
                    (activeImage === quickViewProduct.image || !activeImage) 
                      ? 'border-[#AB6970] scale-105 shadow-md bg-white' 
                      : 'border-cream-200/60 opacity-60 hover:opacity-100 bg-white hover:scale-102'
                  }`}
                >
                  <img src={quickViewProduct.image} alt="Front view" className="w-full h-full object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage(quickViewProduct.hoverImage)}
                  className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-sm ${
                    activeImage === quickViewProduct.hoverImage 
                      ? 'border-[#AB6970] scale-105 shadow-md bg-white' 
                      : 'border-cream-200/60 opacity-60 hover:opacity-100 bg-white hover:scale-102'
                  }`}
                >
                  <img src={quickViewProduct.hoverImage} alt="Back view" className="w-full h-full object-cover" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Product details */}
          <div className="w-full md:w-[48%] p-4 sm:p-6 md:p-10 flex flex-col justify-between bg-[#FCFBF9] overflow-hidden md:overflow-y-auto max-h-none md:max-h-[85vh]">
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Brand label & Badge */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] tracking-[0.25em] font-sans font-bold text-[#AB6970] uppercase">
                    Zuri Couture
                  </span>
                </div>
                
                {/* Title */}
                <h2 className="text-base sm:text-xl md:text-2xl font-bold font-serif text-charcoal-900 leading-snug">
                  {quickViewProduct.name}
                </h2>

                <div className="flex items-center gap-2 mt-1.5 mb-2.5 sm:mb-3">
                  <span className="text-[7px] sm:text-[8px] tracking-wider font-sans font-bold text-[#AB6970] bg-rose-50 border border-rose-100/50 px-2 py-0.5 rounded-md uppercase">
                    Designer Original
                  </span>
                  {quickViewProduct.isBestseller && (
                    <span className="bg-amber-50 text-amber-600 text-[7px] sm:text-[8px] font-bold tracking-wider px-2 py-0.5 rounded-md border border-amber-100 uppercase">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-cream-200/60 my-2.5 sm:my-3.5" />

                {/* Description */}
                <p className="text-[11px] sm:text-xs md:text-sm text-charcoal-600 font-sans leading-relaxed mb-4 sm:mb-5 line-clamp-3 md:line-clamp-none font-light">
                  {quickViewProduct.description}
                </p>

                {/* Specifications mini cards - premium design */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-4 sm:mb-6 font-sans">
                  <div className="bg-white border border-cream-200/80 rounded-xl p-2.5 flex flex-col text-left transition-all hover:border-[#AB6970]/30 hover:shadow-xxs">
                    <span className="text-cream-500 font-bold text-[8px] sm:text-[9px] uppercase tracking-wider mb-0.5">Fabric</span>
                    <span className="font-bold text-charcoal-800 text-xxs sm:text-xs truncate">{quickViewProduct.fabric || 'Premium Silk'}</span>
                  </div>
                  <div className="bg-white border border-cream-200/80 rounded-xl p-2.5 flex flex-col text-left transition-all hover:border-[#AB6970]/30 hover:shadow-xxs">
                    <span className="text-cream-500 font-bold text-[8px] sm:text-[9px] uppercase tracking-wider mb-0.5">Embroidery</span>
                    <span className="font-bold text-charcoal-800 text-xxs sm:text-xs truncate">{quickViewProduct.embroidery || 'Handwork'}</span>
                  </div>
                  <div className="bg-white border border-cream-200/80 rounded-xl p-2.5 flex flex-col text-left transition-all hover:border-[#AB6970]/30 hover:shadow-xxs">
                    <span className="text-cream-500 font-bold text-[8px] sm:text-[9px] uppercase tracking-wider mb-0.5">Color</span>
                    <span className="font-bold text-charcoal-800 text-xxs sm:text-xs truncate">{quickViewProduct.color || 'Ivory'}</span>
                  </div>
                  <div className="bg-white border border-cream-200/80 rounded-xl p-2.5 flex flex-col text-left transition-all hover:border-[#AB6970]/30 hover:shadow-xxs">
                    <span className="text-cream-500 font-bold text-[8px] sm:text-[9px] uppercase tracking-wider mb-0.5">Product SKU</span>
                    <span className="font-bold text-charcoal-700 text-xxs sm:text-xs tracking-wider uppercase truncate">{quickViewProduct.sku || 'ZR-001'}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Purchase CTA */}
              <div className="mt-2.5 sm:mt-4 mb-3 sm:mb-5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-[#25D366] to-[#1ebd50] hover:from-[#20ba59] hover:to-[#1a9d47] text-white font-sans font-bold uppercase tracking-widest text-[9px] sm:text-[10px] md:text-xs py-3 sm:py-3.5 px-6 rounded-xl shadow-[0_4px_14px_rgba(37,211,102,0.25)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2.5 w-full cursor-pointer animate-pulse"
                >
                  <WhatsAppIcon />
                  Inquire on WhatsApp
                </a>
              </div>

              {/* Luxury Brand Signature */}
              <div className="mt-auto pt-3 sm:pt-4 border-t border-cream-100 text-center">
                <span className="font-serif text-[8px] sm:text-[10px] font-bold tracking-[0.25em] text-charcoal-400">BLOUSE AVENUE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
