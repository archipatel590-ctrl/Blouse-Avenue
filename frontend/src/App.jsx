import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import WatchShop from './components/WatchShop';
import ShopByCategory from './components/ShopByCategory';
import HomeCollections from './components/HomeCollections';
import Footer from './components/Footer';

// Drawers & Overlays
import QuickViewModal from './components/QuickViewModal';
import WishlistDrawer from './components/WishlistDrawer';
import SearchOverlay from './components/SearchOverlay';
import LoginModal from './components/LoginModal';

import { ShopContext, ShopContextProvider } from './context/ShopContext';
import { FiArrowUp, FiDatabase } from 'react-icons/fi';
import { useContext } from 'react';
import CategoryPage from './components/CategoryPage';
import AdminPanel from './components/AdminPanel';

function AppContent() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { activePage, user, isAdminStorefrontView, setIsAdminStorefrontView } = useContext(ShopContext);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminMode = user && user.loggedIn && user.isAdmin;

  if (isAdminMode && !isAdminStorefrontView) {
    return <AdminPanel />;
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const isHome = !activePage || activePage.type === 'home';

  return (
    <div className="min-h-screen bg-cream-50 text-charcoal-900 flex flex-col font-sans">
      {isAdminMode && isAdminStorefrontView && (
        <div className="bg-[#0b0c13] text-[#d4af37] border-b border-[#d4af37]/25 py-2.5 px-4 md:px-8 text-xs flex justify-between items-center z-50 sticky top-0 shadow-lg select-none">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
            </span>
            <span className="font-sans font-bold uppercase tracking-wider text-[#d4af37] text-[10px]">
              Admin Preview Mode
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline text-white/60 text-[10px] font-sans">
              Viewing website as customer
            </span>
          </div>
          <button
            onClick={() => setIsAdminStorefrontView(false)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-amber-500 text-charcoal-950 px-4.5 py-1.5 rounded-full font-bold uppercase tracking-widest text-[9px] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 transform active:scale-95 cursor-pointer font-sans"
          >
            <FiDatabase className="w-3 h-3" />
            Return to Admin Panel
          </button>
        </div>
      )}
      {/* Navigation & Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-1">
        {isHome ? (
          <>
            {/* Hero Carousel */}
            <HeroSlider />

            {/* Watch & Shop Collection Showcase */}
            <WatchShop />

            {/* Shop By Category */}
            <ShopByCategory />

            {/* Dynamic Product Collections grouped by category */}
            <HomeCollections />
          </>
        ) : (
          <CategoryPage />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlay Modals & Drawers */}
      <QuickViewModal />
      <WishlistDrawer />
      <SearchOverlay />
      <LoginModal />

      {/* Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-charcoal-900 text-white hover:bg-rose-500 rounded-full shadow-lg z-30 transition-all duration-300 transform active:scale-95 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ShopContextProvider>
      <AppContent />
    </ShopContextProvider>
  );
}
