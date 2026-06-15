import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhone, FiMail,
  FiSearch, FiHeart, FiUser, FiMenu, FiX, FiDatabase
} from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    wishlistItems,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsLoginOpen,
    user,
    logout,
    activePage,
    setActivePage,
    setIsAdminStorefrontView
  } = useContext(ShopContext);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Saree Wear Blouses', targetId: 'new-arrivals', category: 'Saree Wear Blouses' },
    { label: 'Navratri Special', targetId: 'new-arrivals', category: 'Navratri Special' },
    { label: 'Party Wear Blouses', targetId: 'new-arrivals', category: 'Party Wear Blouses' },
    { label: 'Best Sellers', targetId: 'trending', category: 'Best Sellers' },
    { label: 'Contact', targetId: 'footer' }
  ];

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky navbar
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

  const handleMenuClick = (item) => {
    setIsMobileMenuOpen(false);
    if (item.category) {
      setActivePage({ type: 'category', value: item.category });
    } else if (item.targetId) {
      if (activePage.type !== 'home') {
        setActivePage({ type: 'home' });
        // Let homepage mount first before scrolling
        setTimeout(() => scrollToSection(item.targetId), 100);
      } else {
        scrollToSection(item.targetId);
      }
    }
  };


  return (
    <>
      {/* Top Banner Strip */}
      <div className="w-full bg-[#FAF7F0] text-charcoal-800 py-2 px-4 md:px-8 border-b border-cream-200 text-xs flex flex-col sm:flex-row justify-center items-center gap-2 z-50 relative">
        <div className="flex items-center gap-4 text-charcoal-800">
          <a href="tel:+14692364976" className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
            <FiPhone className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-medium">+1(469) 236-4976</span>
          </a>
          <span className="hidden sm:inline text-cream-400">|</span>
          <a href="mailto:ketalzuri@hotmail.com" className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
            <FiMail className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-medium">ketalzuri@hotmail.com</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`w-full z-40 transition-all duration-300 ${isScrolled ? 'sticky top-0 glass shadow-sm py-3 border-b border-cream-200' : 'relative py-5 bg-white'}`}>
        <div className="w-full px-4 md:px-8 grid grid-cols-[1fr_auto_1fr] lg:flex lg:justify-between lg:items-center relative">

          {/* Hamburger Menu (Mobile) */}
          <button
            className="block lg:hidden text-charcoal-900 focus:outline-none text-left z-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start z-10">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage({ type: 'home' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-serif text-lg md:text-xl lg:text-[22px] font-extrabold tracking-[0.08em] text-charcoal-900 select-none relative hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              BLOUSE AVENUE
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-200 opacity-80 blur-[2px] -z-10"></span>
            </a>
          </div>


          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-7 absolute left-1/2 -translate-x-1/2">
            {menuItems.map((item, index) => {
              const isSelected = activePage.type === 'category' && activePage.value === item.category;
              return (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item)}
                  className={`font-medium text-xs xl:text-sm tracking-widest uppercase hover:text-rose-400 transition-colors py-1 link-underline font-sans ${
                    isSelected ? 'text-rose-500 font-bold border-b border-rose-500' : 'text-charcoal-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>


          {/* User Icons Group */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-4 md:gap-5 z-10">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:block text-charcoal-900 hover:text-rose-400 transition-colors p-1"
              aria-label="Search Products"
            >
              <FiSearch className="w-5 h-5 md:w-5.5 md:h-5.5" />
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="hidden lg:block text-charcoal-900 hover:text-rose-400 transition-colors p-1 relative"
              aria-label="View Wishlist"
            >
              <FiHeart className="w-5 h-5 md:w-5.5 md:h-5.5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-400 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {user.loggedIn && user.isAdmin && (
              <button
                onClick={() => setIsAdminStorefrontView(false)}
                className="text-amber-600 hover:text-amber-500 transition-colors p-1 relative group cursor-pointer"
                aria-label="Go to Admin Panel"
              >
                <FiDatabase className="w-5 h-5 md:w-5.5 md:h-5.5" />
                <div className="absolute top-full right-0 mt-2 bg-white border border-cream-200 shadow-md py-1.5 px-3 rounded text-[11px] font-sans font-semibold text-charcoal-800 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  Admin Panel
                </div>
              </button>
            )}

            <button
              onClick={() => user.loggedIn ? logout() : setIsLoginOpen(true)}
              className="text-charcoal-900 hover:text-rose-400 transition-colors p-1 relative group"
              aria-label="User Account"
            >
              <FiUser className="w-5 h-5 md:w-5.5 md:h-5.5" />
              {user.loggedIn && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full" />
              )}
              {user.loggedIn && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-cream-200 shadow-md py-1.5 px-3 rounded text-[11px] font-sans font-semibold text-charcoal-800 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  Hello, {user.name.split(' ')[0]}
                </div>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 p-6 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-serif text-xl font-bold tracking-[0.12em] whitespace-nowrap">BLOUSE AVENUE</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-charcoal-900 p-1"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {menuItems.map((item, index) => {
                  const isSelected = activePage.type === 'category' && activePage.value === item.category;
                  return (
                    <button
                      key={index}
                      onClick={() => handleMenuClick(item)}
                      className={`text-left font-sans font-medium text-sm tracking-widest uppercase py-2 border-b border-cream-100 hover:text-rose-500 hover:pl-2 transition-all duration-300 ${
                        isSelected ? 'text-rose-500 font-semibold pl-2 font-bold' : 'text-charcoal-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}

                {/* Mobile Drawer Search and Wishlist */}
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                  className="text-left font-sans font-medium text-sm tracking-widest text-charcoal-900 uppercase py-2 border-b border-cream-100 hover:text-rose-500 transition-colors flex items-center gap-3.5"
                >
                  <FiSearch className="w-5 h-5 text-charcoal-500" />
                  Search Designs
                </button>

                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsWishlistOpen(true); }}
                  className="text-left font-sans font-medium text-sm tracking-widest text-charcoal-900 uppercase py-2 border-b border-cream-100 hover:text-rose-500 transition-colors flex items-center gap-3.5 relative"
                >
                  <FiHeart className="w-5 h-5 text-charcoal-500" />
                  Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="ml-2 bg-rose-400 text-white rounded-full text-[9px] font-bold px-2 py-0.5 animate-pulse">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>


                {user.loggedIn ? (
                  <div className="py-2 border-b border-cream-100 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-charcoal-500 font-sans">Logged in as {user.name}</span>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                      className="text-left font-sans font-medium text-sm tracking-widest text-rose-500 uppercase py-1 hover:text-rose-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsLoginOpen(true); }}
                    className="text-left font-sans font-medium text-sm tracking-widest text-charcoal-900 uppercase py-2 border-b border-cream-100 hover:text-rose-500 transition-colors"
                  >
                    Login / Register
                  </button>
                )}
              </div>

              <div className="mt-auto pt-10 flex flex-col gap-4 text-xs text-charcoal-500 border-t border-cream-100 font-sans">
                <div className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4 text-rose-300" />
                  <span>+1(469) 236-4976</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4 text-rose-300" />
                  <span>ketalzuri@hotmail.com</span>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
