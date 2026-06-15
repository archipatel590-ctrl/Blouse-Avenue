import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { heroSlides } from '../data/products';

const TornEdgeLeft = () => (
  <svg
    viewBox="0 0 40 1000"
    preserveAspectRatio="none"
    className="h-full w-full text-[#FAF7F0] fill-current"
  >
    <path d="M 40,0 L 40,1000 L 25,1000 L 22,980 L 27,960 L 18,940 L 24,920 L 20,900 L 28,880 L 16,860 L 24,840 L 19,820 L 21,800 L 15,780 L 26,760 L 18,740 L 23,720 L 17,700 L 25,680 L 14,660 L 22,640 L 20,620 L 27,600 L 16,580 L 24,560 L 18,540 L 22,520 L 15,500 L 25,480 L 19,460 L 21,440 L 16,420 L 24,400 L 18,380 L 23,360 L 15,340 L 26,320 L 17,300 L 22,280 L 19,260 L 24,240 L 15,220 L 23,200 L 18,180 L 21,160 L 16,140 L 25,120 L 17,100 L 23,80 L 15,60 L 22,40 L 19,20 L 24,0 L 40,0 Z" />
  </svg>
);

const TornEdgeRight = () => (
  <svg
    viewBox="0 0 40 1000"
    preserveAspectRatio="none"
    className="h-full w-full text-[#FAF7F0] fill-current"
  >
    <path d="M 0,0 L 0,1000 L 15,1000 L 18,980 L 13,960 L 22,940 L 16,920 L 20,900 L 12,880 L 24,860 L 16,840 L 21,820 L 19,800 L 25,780 L 14,760 L 22,740 L 17,720 L 23,700 L 15,680 L 26,660 L 18,640 L 20,620 L 13,600 L 24,580 L 16,560 L 22,540 L 18,520 L 25,500 L 15,480 L 21,460 L 19,440 L 24,420 L 16,400 L 22,380 L 17,360 L 25,340 L 14,320 L 23,300 L 18,280 L 21,260 L 16,240 L 25,220 L 17,200 L 22,180 L 19,160 L 24,140 L 15,120 L 23,100 L 18,80 L 25,60 L 16,40 L 21,20 L 16,0 L 0,0 Z" />
  </svg>
);

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const length = heroSlides.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 2500);
    return () => clearInterval(timer);
  }, [current, isHovered, length]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 140 } }
  };

  return (
    <div
      id="hero"
      className="relative h-[48vh] sm:h-[60vh] md:h-[90vh] w-full overflow-hidden bg-charcoal-900 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Slides */}
      <AnimatePresence>
        {heroSlides.map((slide, index) => {
          if (index !== current) return null;

          // Format slide badge replacing ♦ with elegant ❖ or ✦
          const formattedBadge = slide.badge ? slide.badge.replace(/♦/g, '❖') : '';

          return (
            <div key={slide.id} className="absolute inset-0 w-full h-full flex flex-row items-center justify-between overflow-hidden">
 
              {/* Left Column (Image) - Visible on all viewports */}
              <div className="w-[25%] lg:w-[32%] h-full relative overflow-hidden flex-shrink-0 bg-charcoal-950">
                <motion.div
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -60, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full h-full"
                >
                  <motion.img
                    src={slide.imageLeft}
                    alt={`${slide.collection} Left`}
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.08 }}
                    transition={{ duration: 2.5, ease: 'easeOut' }}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Subtle overlay for dark integration */}
                  <div className="absolute inset-0 bg-black/10" />
                </motion.div>
              </div>
 
              {/* Center Column (Text Panel with Torn Edges) - Responsive side-by-side layout */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="w-[50%] lg:w-[36%] h-full relative flex flex-col justify-between items-center py-4 sm:py-8 md:py-14 px-1.5 sm:px-3 md:px-8 z-10 flex-shrink-0"
                style={{
                  backgroundColor: '#FAF7F0',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.045'/%3E%3C/svg%3E")`
                }}
              >
                {/* Left Torn Edge (Overlays Left Image) */}
                <div className="absolute top-0 right-full h-full w-2 sm:w-4 md:w-8 z-20 pointer-events-none drop-shadow-[-3px_0_3px_rgba(0,0,0,0.12)]">
                  <TornEdgeLeft />
                </div>
 
                {/* Right Torn Edge (Overlays Right Image) */}
                <div className="absolute top-0 left-full h-full w-2 sm:w-4 md:w-8 z-20 pointer-events-none drop-shadow-[3px_0_3px_rgba(0,0,0,0.12)]">
                  <TornEdgeRight />
                </div>
 
                {/* Content Container */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full max-w-sm mx-auto flex flex-col items-center justify-center my-auto text-center relative z-10"
                >
                  {/* Top Badge */}
                  {formattedBadge && (
                    <motion.span
                      variants={itemVariants}
                      className="text-charcoal-900/50 text-[7px] sm:text-[9px] md:text-[11px] font-bold font-sans tracking-[0.22em] uppercase mb-2 sm:mb-4"
                    >
                      {formattedBadge}
                    </motion.span>
                  )}
 
                  {/* Main Title (Scaled elegantly if multi-word) */}
                  <motion.h1
                    variants={itemVariants}
                    className="text-xs xs:text-sm sm:text-2xl md:text-4xl lg:text-6xl font-bold font-serif text-charcoal-900 tracking-[0.05em] uppercase leading-[1.15] mb-1.5 sm:mb-4 max-w-xs md:max-w-md drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
                  >
                    {slide.title.split(' ').map((word, wIdx) => (
                      <span key={wIdx} className="block">
                        {word}
                      </span>
                    ))}
                  </motion.h1>
 
                  {/* Tagline */}
                  {slide.tagline && (
                    <motion.span
                      variants={itemVariants}
                      className="text-rose-500 font-sans text-[6px] xs:text-[8px] sm:text-[10px] md:text-xs tracking-[0.18em] font-semibold uppercase mt-0.5 mb-1 sm:mb-2"
                    >
                      ✦ {slide.tagline} ✦
                    </motion.span>
                  )}
 
                  {/* Description / Subtitle */}
                  {slide.subtitle && (
                    <motion.p
                      variants={itemVariants}
                      className="text-[10px] md:text-[13px] text-charcoal-800/70 font-sans font-light leading-relaxed max-w-[90%] mt-3 hidden sm:block"
                    >
                      {slide.subtitle}
                    </motion.p>
                  )}
 
                  {/* Shop Now CTA (with custom lines above and below) */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center mt-3 sm:mt-6 md:mt-8 w-full"
                  >
                    <div className="w-10 sm:w-16 md:w-24 h-[1px] bg-charcoal-900/20" />
                    <button
                      onClick={() => scrollToSection('trending')}
                      className="py-1.5 sm:py-3.5 text-[8px] sm:text-xs font-serif font-bold tracking-[0.28em] text-charcoal-900 hover:text-rose-600 uppercase transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      SHOP NOW
                    </button>
                    <div className="w-10 sm:w-16 md:w-24 h-[1px] bg-charcoal-900/20" />
                  </motion.div>
                </motion.div>
 
                {/* Pagination Dots inside Center Card */}
                <div className="flex gap-2.5 mt-auto pt-3 sm:pt-6 relative z-10">
                  {heroSlides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrent(dotIdx)}
                      className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${current === dotIdx ? 'w-6 bg-charcoal-900' : 'w-1.5 bg-charcoal-900/30'
                        }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
 
              {/* Right Column (Image) - Visible on all viewports */}
              <div className="w-[25%] lg:w-[32%] h-full relative overflow-hidden flex-shrink-0 bg-charcoal-950">
                <motion.div
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 60, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full h-full"
                >
                  <motion.img
                    src={slide.imageRight}
                    alt={`${slide.collection} Right`}
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.08 }}
                    transition={{ duration: 2.5, ease: 'easeOut' }}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Subtle overlay for dark integration */}
                  <div className="absolute inset-0 bg-black/10" />
                </motion.div>
              </div>
 
            </div>
          );
        })}
      </AnimatePresence>

      {/* Navigation Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 md:left-6 -translate-y-1/2 bg-charcoal-900/25 hover:bg-white text-white hover:text-charcoal-900 p-2 md:p-3 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 transition-all duration-300 z-30 backdrop-blur-sm shadow-md"
        style={{ pointerEvents: 'auto' }}
        aria-label="Previous Slide"
      >
        <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Navigation Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 bg-charcoal-900/25 hover:bg-white text-white hover:text-charcoal-900 p-2 md:p-3 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 transition-all duration-300 z-30 backdrop-blur-sm shadow-md"
        style={{ pointerEvents: 'auto' }}
        aria-label="Next Slide"
      >
        <FiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
}
