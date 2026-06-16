import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFolder, FiUsers, FiLayers, FiPlus, FiTrash2, FiEdit, 
  FiLogOut, FiCheck, FiAlertCircle, FiDatabase, FiSearch, 
  FiGrid, FiChevronRight, FiTrendingUp, FiDollarSign, FiPercent, FiEye, FiSettings,
  FiPhone, FiMail, FiMapPin, FiHeart, FiMenu, FiX
} from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';
import QuickViewModal from './QuickViewModal';

export default function AdminPanel() {
  const { 
    products, 
    users, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    logout,
    setIsAdminStorefrontView,
    setActivePage,
    setQuickViewProduct
  } = useContext(ShopContext);

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'blouses', 'users'
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isGlobalSearchDropdownOpen, setIsGlobalSearchDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null when adding new
  const [selectedTag, setSelectedTag] = useState('All'); // 'All', 'New', 'Best Selling', 'Featured', 'Latest'
  const [selectedUser, setSelectedUser] = useState(null); // stores user object for drawer view
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageInputMode, setImageInputMode] = useState('url'); // 'url' or 'file'

  // Form states
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formFabric, setFormFabric] = useState('');
  const [formColor, setFormColor] = useState('');
  const [formTag, setFormTag] = useState('New'); // Default tag
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('/assets/products/prod_pearl_ivory.png');
  const [formHoverImage, setFormHoverImage] = useState('');
  const [hoverImageInputMode, setHoverImageInputMode] = useState('url'); // 'url' or 'file'
  const [formCategories, setFormCategories] = useState([]);
  const [formShowInWatchShop, setFormShowInWatchShop] = useState(false);
  const [formShowOnHomepage, setFormShowOnHomepage] = useState(true);

  const resetForm = () => {
    setFormName('');
    setFormSku('');
    setFormFabric('');
    setFormColor('');
    setFormTag('New');
    setFormDesc('');
    setFormImage('/assets/products/prod_pearl_ivory.png');
    setFormHoverImage('');
    setFormCategories([]);
    setFormShowInWatchShop(false);
    setFormShowOnHomepage(true);
    setImageInputMode('url');
    setHoverImageInputMode('url');
    setError('');
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormName(product.name || '');
    setFormSku(product.sku || '');
    setFormFabric(product.fabric || '');
    setFormColor(product.color || '');
    setFormTag(product.tag || 'New');
    setFormDesc(product.description || '');
    setFormImage(product.image || '/assets/products/prod_pearl_ivory.png');
    setFormHoverImage(product.hoverImage || '');
    setFormCategories(product.categories || (product.category ? [product.category] : []));
    setFormShowInWatchShop(product.showInWatchShop || false);
    setFormShowOnHomepage(product.showOnHomepage !== false);
    if (product.image && product.image.startsWith('data:')) {
      setImageInputMode('file');
    } else {
      setImageInputMode('url');
    }
    if (product.hoverImage && product.hoverImage.startsWith('data:')) {
      setHoverImageInputMode('file');
    } else {
      setHoverImageInputMode('url');
    }
    setError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formSku || !formFabric || !formColor) {
      setError('Please fill in all required fields.');
      return;
    }

    const productData = {
      name: formName,
      sku: formSku,
      fabric: formFabric,
      color: formColor,
      tag: formTag,
      categories: formCategories,
      showInWatchShop: formShowInWatchShop,
      showOnHomepage: formShowOnHomepage,
      description: formDesc || `${formName} signature designer blouse.`,
      image: formImage,
      hoverImage: formHoverImage
    };

    let result;
    if (editingProduct) {
      const id = editingProduct._id || editingProduct.id;
      result = await updateProduct(id, productData);
    } else {
      result = await createProduct(productData);
    }

    if (result && result.success) {
      showNotification(editingProduct ? 'Blouse details updated successfully!' : 'New designer blouse seeded to database!');
      setIsFormOpen(false);
      resetForm();
    } else {
      setError(result.error || 'Failed to submit changes to database.');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This action is permanent.`)) {
      const id = product._id || product.id;
      const result = await deleteProduct(id);
      if (result && result.success) {
        showNotification('Blouse removed from database.');
      } else {
        alert(result.error || 'Failed to delete blouse.');
      }
    }
  };

  const showNotification = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Selected user's favorites from database mapped to product details
  const selectedUserFavorites = selectedUser
    ? products.filter((p) => selectedUser.favorites?.includes(p.id))
    : [];

  // Filters search queries
  const filteredProducts = products.filter(p => {
    const matchesTag = selectedTag === 'All' || p.tag === selectedTag;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  // Global search filtering for product names and SKUs
  const globalFilteredProducts = globalSearchQuery
    ? products.filter(p => 
        (p.name && p.name.toLowerCase().includes(globalSearchQuery.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(globalSearchQuery.toLowerCase()))
      )
    : [];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group stats
  const totalBlouses = products.length;
  const tagsList = ['All', 'New', 'Best Selling', 'Featured', 'Latest'];
  const totalTags = [...new Set(products.map(p => p.tag))].length;
  const totalCustomers = users.length > 0 ? users.length : 4;
  const latestBlouses = [...products].reverse().slice(0, 4);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] flex font-sans text-charcoal-900 overflow-hidden relative">
      
      {/* Sidebar Backdrop Overlay on Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-charcoal-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Decorative Glows aligned with cream/rose theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-200/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold-200/20 blur-[120px] pointer-events-none z-0" />

      {/* Sidebar Panel (Cream Theme) */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-cream-200 flex flex-col flex-shrink-0 z-40 lg:z-20 shadow-md lg:shadow-none transition-transform duration-300 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Brand Banner */}
        <div className="p-6 border-b border-cream-100 flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="font-serif text-lg font-bold tracking-[0.15em] text-[#AB6970] drop-shadow-sm">ZURI COUTURE</span>
            <span className="text-[9px] font-bold text-cream-500 tracking-[0.3em] uppercase mt-0.5 font-sans">Control Panel</span>
          </div>
          <div className="flex items-center gap-2">
            <FiDatabase className="w-5 h-5 text-[#AB6970] animate-pulse lg:block hidden" />
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-charcoal-500 hover:text-rose-500 transition-colors"
              title="Close Menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-8 flex flex-col gap-2.5">
          <button
            onClick={() => { setActiveTab('dashboard'); setSearchQuery(''); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 relative overflow-hidden group cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-rose-50 border border-rose-100/50 text-[#AB6970] font-extrabold shadow-sm' 
                : 'text-charcoal-800 hover:bg-cream-50 hover:text-[#AB6970]'
            }`}
          >
            <FiLayers className="w-4 h-4" />
            Dashboard
          </button>
          
          <button
            onClick={() => { setActiveTab('blouses'); setSearchQuery(''); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === 'blouses' 
                ? 'bg-rose-50 border border-rose-100/50 text-[#AB6970] font-extrabold shadow-sm' 
                : 'text-charcoal-800 hover:bg-cream-50 hover:text-[#AB6970]'
            }`}
          >
            <FiGrid className="w-4 h-4" />
            Manage Blouses
          </button>

          <button
            onClick={() => { setActiveTab('users'); setSearchQuery(''); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer ${
              activeTab === 'users' 
                ? 'bg-rose-50 border border-rose-100/50 text-[#AB6970] font-extrabold shadow-sm' 
                : 'text-charcoal-800 hover:bg-cream-50 hover:text-[#AB6970]'
            }`}
          >
            <FiUsers className="w-4 h-4" />
            User Details
          </button>

          <button
            onClick={() => {
              console.log("View Website button clicked - navigating to home page preview.");
              try {
                setActivePage({ type: 'home' });
                setIsAdminStorefrontView(true);
              } catch (err) {
                console.error("Failed to switch to storefront view:", err);
              }
            }}
            className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 text-rose-500 hover:bg-rose-50/70 border border-rose-200 mt-4 shadow-sm cursor-pointer"
          >
            <FiEye className="w-4 h-4" />
            View Website
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-cream-200 flex flex-col gap-4 bg-[#FCFBF9]">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-rose-100 text-[#AB6970] flex items-center justify-center font-bold text-sm shadow-sm border border-rose-200/50">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-charcoal-900 leading-none">Zuri Admin</span>
              <span className="text-[9px] text-[#AB6970] mt-1 font-semibold">zuri@admin.com</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-50 hover:bg-[#AB6970] border border-rose-200/50 text-[#AB6970] hover:text-white text-xxs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 cursor-pointer shadow-sm"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10 bg-transparent">
        
        <header className="bg-white/80 backdrop-blur-md border-b border-cream-200 px-4 md:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-charcoal-800 hover:text-[#AB6970] transition-colors cursor-pointer"
                title="Open Menu"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(171,105,112,0.4)] hidden sm:inline-block" />
              <h1 className="font-serif text-lg md:text-xl font-bold text-charcoal-900 tracking-wide capitalize">
                {activeTab} Overview
              </h1>
            </div>
          </div>

          {/* Search containers */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Global Item Finder */}
            <div className="w-full sm:w-64 md:w-80 relative flex items-center bg-[#FAF8F5] rounded-full border border-cream-200 px-4 py-1.5 focus-within:border-[#AB6970] focus-within:bg-white transition-all duration-300">
              <FiSearch className="text-[#AB6970] w-3.5 h-3.5 mr-2" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  setIsGlobalSearchDropdownOpen(true);
                }}
                onFocus={() => setIsGlobalSearchDropdownOpen(true)}
                placeholder="Find Item (Name/SKU)..."
                className="bg-transparent text-xs text-charcoal-900 outline-none w-full font-medium placeholder-charcoal-500/40"
              />
              {globalSearchQuery && (
                <button 
                  type="button"
                  onClick={() => {
                    setGlobalSearchQuery('');
                    setIsGlobalSearchDropdownOpen(false);
                  }} 
                  className="text-xxs font-bold text-[#AB6970] hover:text-rose-500 uppercase transition-colors"
                >
                  ✕
                </button>
              )}

              {/* Global Search Dropdown Results */}
              {isGlobalSearchDropdownOpen && globalSearchQuery && (
                <>
                  {/* Overlay background to handle click outside */}
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setIsGlobalSearchDropdownOpen(false)} 
                  />
                  
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-cream-200 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50 p-2 flex flex-col gap-1 text-left">
                    <div className="text-[9px] font-bold text-cream-500 px-2.5 py-1 uppercase tracking-wider border-b border-cream-100 mb-1">
                      Matching Items ({globalFilteredProducts.length})
                    </div>
                    {globalFilteredProducts.length > 0 ? (
                      globalFilteredProducts.map((p) => (
                        <div
                          key={p.id || p._id}
                          onClick={() => {
                            setQuickViewProduct(p);
                            setIsGlobalSearchDropdownOpen(false);
                            setGlobalSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-rose-50/50 rounded-lg cursor-pointer transition-colors duration-150 border border-transparent hover:border-rose-100/50"
                        >
                          <img 
                            src={p.image} 
                            alt="" 
                            className="w-8 h-10 object-cover rounded-md bg-cream-50 border border-cream-200 flex-shrink-0" 
                          />
                          <div className="flex-1 flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-charcoal-900 truncate">{p.name}</span>
                            <span className="text-[10px] text-charcoal-500 font-medium font-mono uppercase tracking-wide">
                              Code: {p.sku || 'N/A'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xxs text-cream-500 font-semibold">
                        No items found matching "{globalSearchQuery}"
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Existing Tab-specific filter */}
            {activeTab !== 'dashboard' && (
              <div className="w-full sm:w-64 md:w-80 relative flex items-center bg-cream-50 rounded-full border border-cream-200 px-4 py-1.5 focus-within:border-[#AB6970] focus-within:bg-white transition-all duration-300">
                <FiSearch className="text-[#AB6970] w-3.5 h-3.5 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={activeTab === 'blouses' ? 'Filter SKU, name, or tag...' : 'Filter customer details...'}
                  className="bg-transparent text-xs text-charcoal-900 outline-none w-full font-medium placeholder-charcoal-500/40"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-xxs font-bold text-charcoal-500 hover:text-rose-500 uppercase transition-colors">
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Body Area */}
        <div className="p-4 md:p-8 flex-1 relative max-w-7xl mx-auto w-full">
          
          {/* Toast Success Banner */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="fixed top-8 right-8 z-50 bg-white text-charcoal-900 font-sans text-xs font-semibold py-3.5 px-6 rounded-xl shadow-xl flex items-center gap-3 border border-rose-200/40 backdrop-blur-xl"
              >
                <FiCheck className="text-white w-4.5 h-4.5 bg-rose-50 rounded-full p-0.5" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab content logic switcher */}
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-10"
              >
                {/* Stats Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Blouses Widget */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white border border-cream-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-rose-300 transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveTab('blouses')}
                  >
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-bold text-cream-500 uppercase tracking-widest">Total Silhouettes</span>
                      <span className="text-2xl font-extrabold text-charcoal-900 tracking-wide">{totalBlouses}</span>
                      <span className="text-[9px] text-[#AB6970] font-semibold mt-1">Ready for storefront display</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-[#AB6970]">
                      <FiGrid className="w-5 h-5" />
                    </div>
                  </motion.div>

                  {/* Total Tags Widget */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white border border-cream-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-rose-300 transition-all duration-300 cursor-pointer"
                    onClick={() => { setActiveTab('blouses'); setSelectedTag('All'); }}
                  >
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-bold text-cream-500 uppercase tracking-widest">Active Tags</span>
                      <span className="text-2xl font-extrabold text-charcoal-900 tracking-wide">{totalTags}</span>
                      <span className="text-[9px] text-gold-700 font-semibold mt-1">Active collection filters</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gold-100/50 flex items-center justify-center text-gold-600">
                      <FiFolder className="w-5 h-5" />
                    </div>
                  </motion.div>

                  {/* Customers Stats Widget */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white border border-cream-200 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:border-rose-300 transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveTab('users')}
                  >
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-[10px] font-bold text-cream-500 uppercase tracking-widest">Registered Clients</span>
                      <span className="text-2xl font-extrabold text-charcoal-900 tracking-wide">{totalCustomers}</span>
                      <span className="text-[9px] text-emerald-600 font-semibold mt-1">Active customer bases</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <FiUsers className="w-5 h-5" />
                    </div>
                  </motion.div>
                </div>

                {/* Analytical Chart & Showcase Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Weekly Sales Analytics in light theme */}
                  <div className="lg:col-span-2 bg-white border border-cream-200 rounded-2xl p-6 shadow-sm text-left">
                    <h3 className="font-serif text-sm font-bold text-charcoal-900 mb-6 uppercase tracking-wider">
                      Weekly Sales Analytics
                    </h3>
                    <div className="h-64 w-full relative">
                      <svg viewBox="0 0 500 200" className="w-full h-full">
                        <defs>
                          <linearGradient id="chartGradientLight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#AB6970" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#AB6970" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(215,199,182,0.15)" strokeWidth="1" />
                        <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(215,199,182,0.15)" strokeWidth="1" />
                        <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(215,199,182,0.15)" strokeWidth="1" />
                        
                        <path 
                          d="M0 200 L0 120 C 50 100, 100 150, 150 110 C 200 70, 250 80, 300 50 C 350 20, 400 90, 450 60 L 500 40 L 500 200 Z" 
                          fill="url(#chartGradientLight)" 
                        />
                        <path 
                          d="M0 120 C 50 100, 100 150, 150 110 C 200 70, 250 80, 300 50 C 350 20, 400 90, 450 60 L 500 40" 
                          fill="none" 
                          stroke="#AB6970" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                          className="drop-shadow-sm"
                        />
                        <circle cx="150" cy="110" r="5" fill="#fff" stroke="#AB6970" strokeWidth="2.5" />
                        <circle cx="300" cy="50" r="5" fill="#fff" stroke="#AB6970" strokeWidth="2.5" />
                        <circle cx="500" cy="40" r="5" fill="#fff" stroke="#AB6970" strokeWidth="2.5" />
                      </svg>
                      <div className="flex justify-between text-[9px] font-bold text-cream-500 mt-2 uppercase tracking-widest px-2">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>

                  {/* Share Ring */}
                  <div className="bg-white border border-cream-200 rounded-2xl p-6 shadow-sm text-left flex flex-col justify-between">
                    <h3 className="font-serif text-sm font-bold text-charcoal-900 mb-2 uppercase tracking-wider">
                      Collection Tags
                    </h3>
                    <div className="flex justify-center py-4">
                      <svg width="140" height="140" viewBox="0 0 36 36" className="transform -rotate-90">
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke="#FAF7F0" strokeWidth="3" />
                        
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke="#AB6970" strokeWidth="3.5" strokeDasharray="30 70" strokeDashoffset="0" />
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke="#D4AF37" strokeWidth="3.5" strokeDasharray="30 70" strokeDashoffset="-30" />
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke="#E8C5C8" strokeWidth="3.5" strokeDasharray="20 80" strokeDashoffset="-60" />
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke="#2A2A2A" strokeWidth="3.5" strokeDasharray="20 80" strokeDashoffset="-80" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2.5 mt-2 text-xxs font-bold">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-charcoal-600"><span className="w-2.5 h-2.5 rounded bg-[#AB6970]" /> Featured</span>
                        <span className="text-charcoal-900">{products.filter(p => p.tag === 'Featured').length} items</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-charcoal-600"><span className="w-2.5 h-2.5 rounded bg-[#D4AF37]" /> Best Selling</span>
                        <span className="text-charcoal-900">{products.filter(p => p.tag === 'Best Selling').length} items</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-charcoal-600"><span className="w-2.5 h-2.5 rounded bg-[#E8C5C8]" /> New</span>
                        <span className="text-charcoal-900">{products.filter(p => p.tag === 'New').length} items</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-charcoal-600"><span className="w-2.5 h-2.5 rounded bg-[#2A2A2A]" /> Latest</span>
                        <span className="text-charcoal-900">{products.filter(p => p.tag === 'Latest').length} items</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Latest Added Blouses Showcase */}
                <div className="bg-white border border-cream-200 rounded-2xl p-6 shadow-sm text-left">
                  <h3 className="font-serif text-sm font-bold text-charcoal-900 mb-6 uppercase tracking-wider flex items-center justify-between border-b border-cream-100 pb-3">
                    Latest Silhouette Additions
                    <button onClick={() => { setActiveTab('blouses'); setSelectedTag('All'); }} className="text-xxs font-bold text-[#AB6970] hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer">
                      Manage All <FiChevronRight />
                    </button>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestBlouses.map((p) => (
                      <motion.div
                        key={p.id || p._id}
                        whileHover={{ y: -5 }}
                        className="bg-[#FCFBF9] border border-cream-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                      >
                        <div className="h-56 relative overflow-hidden bg-cream-100">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-2.5 left-2.5 text-[8px] font-extrabold uppercase tracking-wider text-rose-500 bg-white px-2 py-0.5 rounded shadow-sm border border-rose-100">
                            {p.tag}
                          </span>
                        </div>
                        <div className="p-4 flex flex-col text-left">
                          <span className="text-[8px] font-bold text-cream-500 tracking-wider uppercase leading-none mb-1">DESIGNER COUTURE</span>
                          <span className="text-xs font-bold text-charcoal-900 truncate" title={p.name}>{p.name}</span>
                          <span className="text-[10px] text-charcoal-500 mt-1 font-semibold">{p.fabric} • {p.color}</span>
                          <div className="mt-3 flex justify-between items-center pt-2 border-t border-cream-100">
                            <button
                              onClick={() => setQuickViewProduct(p)}
                              className="text-[9px] font-bold text-[#AB6970] hover:text-rose-400 uppercase flex items-center gap-0.5 cursor-pointer"
                            >
                              View <FiEye className="w-2.5 h-2.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="text-[9px] font-bold text-[#AB6970] hover:text-rose-400 uppercase flex items-center gap-0.5 cursor-pointer"
                            >
                              Edit <FiEdit className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Catalog editor blouses tab view */}
            {activeTab === 'blouses' && (
              <motion.div
                key="blouses-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                {/* Category Filtering Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-cream-200 pb-4">
                  {tagsList.map((tag) => {
                    const count = tag === 'All' 
                      ? products.length 
                      : products.filter(p => p.tag === tag).length;
                    const isActive = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => { setSelectedTag(tag); setSearchQuery(''); }}
                        className={`px-4 py-2 text-xxs font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? 'bg-rose-50 text-[#AB6970] border border-rose-200 shadow-sm font-extrabold' 
                            : 'bg-white text-charcoal-800 border border-cream-200 hover:bg-cream-100 hover:text-charcoal-950'
                        }`}
                      >
                        {tag === 'All' ? 'All Blouses' : tag} <span className="ml-1 opacity-60">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Header Action Row */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold tracking-wider text-cream-500 uppercase">
                    Showing {filteredProducts.length} of {totalBlouses} Blouses
                  </span>
                  
                  <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#AB6970] to-[#C48A90] text-white font-bold uppercase tracking-widest text-xxs py-3 px-6 rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Silhouette
                  </button>
                </div>

                {/* Catalog Table Card - Desktop only */}
                <div className="hidden lg:block bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-cream-50 border-b border-cream-200 text-[9px] font-extrabold uppercase tracking-widest text-cream-500 font-sans">
                          <th className="py-4.5 px-6">Blouse Details</th>
                          <th className="py-4.5 px-6">Product Code</th>
                          <th className="py-4.5 px-6">Fabric / Color</th>
                          <th className="py-4.5 px-6">Tag / Category</th>
                          <th className="py-4.5 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-100 text-xs text-charcoal-800 font-medium">
                        {filteredProducts.map((p) => (
                          <tr key={p.id || p._id} className="hover:bg-cream-50/50 transition-colors duration-200">
                            {/* Name and Thumbnail */}
                            <td className="py-4.5 px-6 flex items-center gap-4.5 min-w-[280px]">
                              <img src={p.image} alt="" className="w-9 h-11 object-cover rounded-lg bg-cream-50 border border-cream-200 flex-shrink-0" />
                              <div className="flex flex-col text-left">
                                <span className="font-bold text-charcoal-900 text-xs hover:text-[#AB6970] transition-colors">{p.name}</span>
                              </div>
                            </td>

                            {/* Product Code */}
                            <td className="py-4.5 px-6 font-mono font-bold text-charcoal-500 uppercase tracking-wide">
                              {p.sku || 'N/A'}
                            </td>

                            {/* Fabric and Color */}
                            <td className="py-4.5 px-6">
                              <div className="flex flex-col gap-1 text-left">
                                <span className="font-semibold text-charcoal-600">{p.fabric}</span>
                                <span className="text-[10px] text-charcoal-400">{p.color}</span>
                              </div>
                            </td>

                            {/* Tag / Category */}
                            <td className="py-4.5 px-6">
                              <div className="flex flex-col gap-1.5 text-left">
                                <div className="flex gap-1.5 flex-wrap">
                                  <span className="text-[8px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded w-max">
                                    {p.tag}
                                  </span>
                                  {p.showOnHomepage !== false && (
                                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#AB6970] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded w-max">
                                      Home Page
                                    </span>
                                  )}
                                  {p.showInWatchShop && (
                                    <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded w-max">
                                      Watch & Shop
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] font-semibold text-charcoal-400 font-sans leading-tight">
                                  {p.categories && p.categories.length > 0 
                                    ? p.categories.join(', ') 
                                    : (p.category || 'Saree Wear Blouses')}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-4.5 px-6 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => setQuickViewProduct(p)}
                                  className="p-2 bg-cream-50 text-charcoal-600 hover:bg-rose-50 hover:text-[#AB6970] border border-cream-200 hover:border-rose-100 rounded-lg transition-all cursor-pointer"
                                  title="View Product Details"
                                >
                                  <FiEye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEdit(p)}
                                  className="p-2 bg-cream-50 text-charcoal-600 hover:bg-rose-50 hover:text-[#AB6970] border border-cream-200 hover:border-rose-100 rounded-lg transition-all cursor-pointer"
                                  title="Edit Blouse Details"
                                >
                                  <FiEdit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(p)}
                                  className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-100 rounded-lg transition-all cursor-pointer"
                                  title="Delete Blouse"
                                >
                                  <FiTrash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {filteredProducts.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-16 text-cream-500 font-semibold bg-cream-50/20">
                              No silhouettes found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Catalog Card List - Mobile only */}
                <div className="lg:hidden flex flex-col gap-4">
                  {filteredProducts.map((p) => (
                    <div 
                      key={p.id || p._id} 
                      className="bg-white border border-cream-200 rounded-2xl p-4 flex flex-col gap-3 shadow-xs hover:border-rose-300 transition-all duration-300"
                    >
                      {/* Top section: Thumbnail + Title + SKU */}
                      <div className="flex gap-4">
                        <img 
                          src={p.image} 
                          alt="" 
                          className="w-16 h-20 object-cover rounded-lg bg-cream-50 border border-cream-200 flex-shrink-0" 
                        />
                        <div className="flex flex-col justify-between text-left flex-1 min-w-0">
                          <div>
                            <h4 className="font-bold text-charcoal-900 text-xs truncate">
                              {p.name}
                            </h4>
                            <span className="text-[10px] font-mono font-bold text-charcoal-500 uppercase tracking-wide block mt-1">
                              SKU: {p.sku || 'N/A'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            <span className="text-[7.5px] font-extrabold uppercase tracking-wider text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                              {p.tag}
                            </span>
                            {p.showOnHomepage !== false && (
                              <span className="text-[7.5px] font-extrabold uppercase tracking-wider text-[#AB6970] bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                                Home
                              </span>
                            )}
                            {p.showInWatchShop && (
                              <span className="text-[7.5px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                                Watch&Shop
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle section: Specs (Fabric/Color) and Categories */}
                      <div className="border-t border-cream-100 pt-2.5 flex justify-between text-xxs text-charcoal-800">
                        <div className="flex flex-col text-left">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-cream-500">Fabric & Color</span>
                          <span className="font-bold text-charcoal-700 mt-0.5">{p.fabric}</span>
                          <span className="text-charcoal-400 mt-0.5">{p.color}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-cream-500">Section / Category</span>
                          <span className="font-semibold text-charcoal-600 mt-0.5">
                            {p.categories && p.categories.length > 0 
                              ? p.categories.join(', ') 
                              : (p.category || 'Saree Wear Blouses')}
                          </span>
                        </div>
                      </div>

                      {/* Bottom section: Actions */}
                      <div className="border-t border-cream-100 pt-2.5 flex justify-end gap-2.5">
                        <button
                          onClick={() => setQuickViewProduct(p)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-cream-50 hover:bg-rose-50 hover:text-[#AB6970] text-charcoal-800 border border-cream-200 hover:border-rose-100 rounded-xl text-xxs font-bold transition-all cursor-pointer"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-cream-50 hover:bg-rose-50 hover:text-[#AB6970] text-charcoal-800 border border-cream-200 hover:border-rose-100 rounded-xl text-xxs font-bold transition-all cursor-pointer"
                        >
                          <FiEdit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 border border-rose-100 rounded-xl text-xxs font-bold transition-all cursor-pointer"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-16 text-cream-500 font-semibold bg-white border border-cream-200 rounded-2xl">
                      No silhouettes found matching your criteria.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Users listing tab view */}
            {activeTab === 'users' && (
              <motion.div
                key="users-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <div className="mb-6 flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-cream-500 uppercase">
                      Listing {filteredUsers.length} Registered User Accounts
                    </span>
                    <p className="text-[10px] text-charcoal-400 mt-1 font-semibold">Click on any customer row to show details, contact profile, and favorite items.</p>
                  </div>
                </div>

                {/* Desktop Table view - hidden on mobile */}
                <div className="hidden lg:block bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans">
                      <thead>
                        <tr className="bg-cream-50 border-b border-cream-200 text-[9px] font-extrabold uppercase tracking-widest text-cream-500">
                          <th className="py-4.5 px-6">Avatar</th>
                          <th className="py-4.5 px-6">Customer Name</th>
                          <th className="py-4.5 px-6">Email Address</th>
                          <th className="py-4.5 px-6">Account Role</th>
                          <th className="py-4.5 px-6">Registration Date</th>
                          <th className="py-4.5 px-6 text-center">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-100 text-xs text-charcoal-800 font-medium">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((u) => {
                            const dateJoined = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            }) : 'Fallback Joined';

                            return (
                              <tr 
                                key={u._id || u.email} 
                                onClick={() => setSelectedUser(u)}
                                className="hover:bg-rose-50/20 cursor-pointer transition-colors duration-200"
                              >
                                <td className="py-4.5 px-6">
                                  <div className="w-9 h-9 rounded-full bg-rose-50 text-[#AB6970] border border-rose-100 flex items-center justify-center font-bold text-xs shadow-inner">
                                    {u.name.split(' ').map(n=>n[0]).join('')}
                                  </div>
                                </td>
                                <td className="py-4.5 px-6 font-bold text-charcoal-900">
                                  {u.name}
                                </td>
                                <td className="py-4.5 px-6 text-charcoal-600 font-semibold font-sans">
                                  {u.email}
                                </td>
                                <td className="py-4.5 px-6">
                                  <span className={`text-[8.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                    u.isAdmin ? 'bg-rose-50 text-[#AB6970] border-rose-100' : 'bg-cream-100 text-charcoal-600 border-cream-200'
                                  }`}>
                                    {u.isAdmin ? 'Admin' : 'Customer'}
                                  </span>
                                </td>
                                <td className="py-4.5 px-6 text-charcoal-500">
                                  {dateJoined}
                                </td>
                                <td className="py-4.5 px-6 text-center">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }}
                                    className="px-3 py-1 bg-cream-50 hover:bg-[#AB6970] text-charcoal-800 hover:text-white border border-cream-200 hover:border-[#AB6970] rounded-full text-[10px] font-bold transition-all cursor-pointer"
                                  >
                                    View Profile
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center py-16 text-cream-500 font-semibold bg-cream-50/20">
                              No customer accounts found matching search criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card view - hidden on desktop */}
                <div className="lg:hidden flex flex-col gap-4">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => {
                      const dateJoined = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      }) : 'Fallback Joined';

                      return (
                        <div 
                          key={u._id || u.email}
                          onClick={() => setSelectedUser(u)}
                          className="bg-white border border-cream-200 rounded-2xl p-4 flex flex-col gap-4 shadow-xs hover:border-rose-300 transition-all duration-300 cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-full bg-rose-50 text-[#AB6970] border border-rose-100 flex items-center justify-center font-bold text-sm shadow-inner flex-shrink-0">
                              {u.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col">
                              <span className="font-bold text-charcoal-900 text-sm truncate">{u.name}</span>
                              <span className="text-xxs text-[#AB6970] font-bold uppercase tracking-wider mt-0.5">
                                {u.isAdmin ? 'Admin' : 'Customer'}
                              </span>
                            </div>
                          </div>

                          <div className="border-t border-cream-100 pt-3 flex flex-col gap-2 text-xxs font-medium text-charcoal-700">
                            <div className="flex justify-between">
                              <span className="text-cream-500 font-bold uppercase tracking-wider">Email</span>
                              <span className="font-semibold text-charcoal-800 break-all">{u.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-cream-500 font-bold uppercase tracking-wider">Joined Date</span>
                              <span className="text-charcoal-600">{dateJoined}</span>
                            </div>
                          </div>

                          <div className="border-t border-cream-100 pt-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }}
                              className="w-full py-2.5 bg-cream-50 hover:bg-[#AB6970] text-[#AB6970] hover:text-white border border-rose-200 hover:border-[#AB6970] rounded-xl text-xxs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-xxs"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-16 text-cream-500 font-semibold bg-white border border-cream-200 rounded-2xl">
                      No customer accounts found matching search criteria.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Dynamic Slide-over Form Overlay for Adding/Editing Blouse (Light Theme) */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-charcoal-900/30 backdrop-blur-xs"
            />

            {/* Panel Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-[#FCFBF9] border-l border-cream-200 h-full shadow-2xl flex flex-col z-10 font-sans text-charcoal-900"
            >
              {/* Form Header */}
              <div className="p-6 border-b border-cream-200 flex items-center justify-between bg-white shadow-xs">
                <div className="flex flex-col text-left">
                  <h3 className="font-serif text-base font-bold text-charcoal-900 tracking-wide">
                    {editingProduct ? 'Edit Couture Blouse' : 'Add New Silhouette'}
                  </h3>
                  <span className="text-[10px] text-[#AB6970] font-bold uppercase tracking-wider mt-0.5">
                    {editingProduct ? `SKU: ${editingProduct.sku}` : 'Seed details into database'}
                  </span>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-full border border-cream-200 hover:border-rose-300 text-charcoal-500 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Inputs Container */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-left bg-transparent select-none">
                
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-xxs font-semibold text-rose-500">
                    <FiAlertCircle className="w-4.5 h-4.5 flex-shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Blouse Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sabyasachi Kundan Velvet Blouse"
                    className="w-full p-3 bg-white hover:bg-cream-50 focus:bg-white border border-cream-200 focus:border-[#AB6970] rounded-lg outline-none text-xs font-semibold text-charcoal-900 transition-all duration-200"
                  />
                </div>

                {/* SKU Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Product Code (SKU) *</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="e.g. ZR-BL-017"
                    className="w-full p-3 bg-white hover:bg-cream-50 focus:bg-white border border-cream-200 focus:border-[#AB6970] rounded-lg outline-none text-xs font-semibold text-charcoal-900 transition-all duration-200 uppercase font-mono tracking-wider"
                  />
                </div>

                {/* Fabric and Color */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Fabric Type *</label>
                    <input
                      type="text"
                      required
                      value={formFabric}
                      onChange={(e) => setFormFabric(e.target.value)}
                      placeholder="e.g. Raw Silk"
                      className="w-full p-3 bg-white hover:bg-cream-50 focus:bg-white border border-cream-200 focus:border-[#AB6970] rounded-lg outline-none text-xs font-semibold text-charcoal-900 transition-all duration-200"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Dominant Color *</label>
                    <input
                      type="text"
                      required
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      placeholder="e.g. Crimson Red"
                      className="w-full p-3 bg-white hover:bg-cream-50 focus:bg-white border border-cream-200 focus:border-[#AB6970] rounded-lg outline-none text-xs font-semibold text-charcoal-900 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Product Tag Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Product Tag *</label>
                  <select
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full p-3 bg-white hover:bg-cream-50 focus:bg-white border border-cream-200 focus:border-[#AB6970] rounded-lg outline-none text-xs font-semibold text-charcoal-800 transition-all duration-200 cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Best Selling">Best Selling</option>
                    <option value="Featured">Featured (For Home Page)</option>
                    <option value="Latest">Latest</option>
                  </select>
                </div>

                {/* Blouse Sections / Categories Checkboxes */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Blouse Sections / Categories *</label>
                  <div className="flex flex-col gap-2.5 p-3 bg-white border border-cream-200 rounded-lg">
                    {[
                      'Saree Wear Blouses',
                      'Navratri Special',
                      'Party Wear Blouses',
                      'Best Sellers'
                    ].map((catName) => {
                      const isChecked = formCategories.includes(catName);
                      return (
                        <label key={catName} className="flex items-center gap-2.5 text-xs text-charcoal-800 font-semibold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setFormCategories(formCategories.filter((c) => c !== catName));
                              } else {
                                setFormCategories([...formCategories, catName]);
                              }
                            }}
                            className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 border-cream-300"
                          />
                          {catName}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Watch & Shop Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Watch & Shop Display</label>
                  <div className="flex items-center p-3 bg-white border border-cream-200 rounded-lg">
                    <label className="flex items-center gap-2.5 text-xs text-charcoal-800 font-semibold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formShowInWatchShop}
                        onChange={(e) => setFormShowInWatchShop(e.target.checked)}
                        className="w-4 h-4 rounded text-[#AB6970] focus:ring-rose-400 border-cream-300"
                      />
                      Show this blouse in "Watch & Shop" section
                    </label>
                  </div>
                </div>

                {/* Homepage Display Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Homepage Category Grid Display</label>
                  <div className="flex items-center p-3 bg-white border border-cream-200 rounded-lg">
                    <label className="flex items-center gap-2.5 text-xs text-charcoal-800 font-semibold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formShowOnHomepage}
                        onChange={(e) => setFormShowOnHomepage(e.target.checked)}
                        className="w-4 h-4 rounded text-[#AB6970] focus:ring-rose-400 border-cream-300"
                      />
                      Show this blouse in Homepage Category sections
                    </label>
                  </div>
                </div>

                {/* Image Assets */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Blouse Image *</label>
                    <div className="flex bg-cream-50 border border-cream-200 rounded-lg p-0.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${imageInputMode === 'url' ? 'bg-white text-[#AB6970] shadow-xs' : 'text-charcoal-600'}`}
                      >
                        Paste URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('file')}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${imageInputMode === 'file' ? 'bg-white text-[#AB6970] shadow-xs' : 'text-charcoal-600'}`}
                      >
                        Upload File
                      </button>
                    </div>
                  </div>

                  {imageInputMode === 'url' ? (
                    <input
                      type="text"
                      required
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="e.g. https://images.unsplash.com/photo-... or local path"
                      className="w-full p-3 bg-white hover:bg-cream-50 focus:bg-white border border-cream-200 focus:border-[#AB6970] rounded-lg outline-none text-xs font-semibold text-charcoal-900 transition-all duration-200"
                    />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="relative border-2 border-dashed border-cream-300 hover:border-rose-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white transition-all cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormImage(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FiEye className="w-6 h-6 text-cream-500 mb-2" />
                        <span className="text-[10px] font-bold text-charcoal-800">
                          {formImage && formImage.startsWith('data:') ? 'Change Local Image' : 'Select Local Image File'}
                        </span>
                        <span className="text-[9px] text-cream-500 font-semibold mt-1">Supports PNG, JPG, WEBP (Max 2MB)</span>
                      </div>
                    </div>
                  )}

                  {/* Image Preview Window */}
                  {formImage && (
                    <div className="mt-2 flex items-center gap-3.5 p-2 bg-white border border-cream-200 rounded-xl shadow-xxs">
                      <img src={formImage} alt="Preview" className="w-12 h-14 object-cover rounded-lg bg-cream-50 border border-cream-100 flex-shrink-0" />
                      <div className="flex-1 flex flex-col text-left overflow-hidden">
                        <span className="text-[8px] font-bold text-rose-500 tracking-wider uppercase leading-none mb-1">Image Preview</span>
                        <span className="text-xxs font-mono text-charcoal-600 truncate">{formImage}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormImage('')}
                        className="text-xxs text-rose-500 hover:text-rose-700 font-bold uppercase cursor-pointer mr-1"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Backside Image Assets */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Backside Blouse Image (Hover)</label>
                    <div className="flex bg-cream-50 border border-cream-200 rounded-lg p-0.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setHoverImageInputMode('url')}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${hoverImageInputMode === 'url' ? 'bg-white text-[#AB6970] shadow-xs' : 'text-charcoal-600'}`}
                      >
                        Paste URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setHoverImageInputMode('file')}
                        className={`px-3 py-1 rounded-md transition-all cursor-pointer ${hoverImageInputMode === 'file' ? 'bg-white text-[#AB6970] shadow-xs' : 'text-charcoal-600'}`}
                      >
                        Upload File
                      </button>
                    </div>
                  </div>

                  {hoverImageInputMode === 'url' ? (
                    <input
                      type="text"
                      value={formHoverImage}
                      onChange={(e) => setFormHoverImage(e.target.value)}
                      placeholder="e.g. https://images.unsplash.com/photo-... or local path for backside view"
                      className="w-full p-3 bg-white hover:bg-cream-50 focus:bg-white border border-cream-200 focus:border-[#AB6970] rounded-lg outline-none text-xs font-semibold text-charcoal-900 transition-all duration-200"
                    />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="relative border-2 border-dashed border-cream-300 hover:border-rose-300 rounded-xl p-4 flex flex-col items-center justify-center bg-white transition-all cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormHoverImage(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FiEye className="w-6 h-6 text-cream-500 mb-2" />
                        <span className="text-[10px] font-bold text-charcoal-800">
                          {formHoverImage && formHoverImage.startsWith('data:') ? 'Change Local Image' : 'Select Local Image File'}
                        </span>
                        <span className="text-[9px] text-cream-500 font-semibold mt-1">Supports PNG, JPG, WEBP (Max 2MB)</span>
                      </div>
                    </div>
                  )}

                  {/* Image Preview Window */}
                  {formHoverImage && (
                    <div className="mt-2 flex items-center gap-3.5 p-2 bg-white border border-cream-200 rounded-xl shadow-xxs">
                      <img src={formHoverImage} alt="Preview" className="w-12 h-14 object-cover rounded-lg bg-cream-50 border border-cream-100 flex-shrink-0" />
                      <div className="flex-1 flex flex-col text-left overflow-hidden">
                        <span className="text-[8px] font-bold text-rose-500 tracking-wider uppercase leading-none mb-1">Backside Preview</span>
                        <span className="text-xxs font-mono text-charcoal-600 truncate">{formHoverImage}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormHoverImage('')}
                        className="text-xxs text-rose-500 hover:text-rose-700 font-bold uppercase cursor-pointer mr-1"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-cream-500">Description</label>
                  <textarea
                    rows="4"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Provide details about fit, padding, back cuts, and custom tie-ups..."
                    className="w-full p-3 bg-white hover:bg-cream-50 focus:bg-white border border-cream-200 focus:border-[#AB6970] rounded-lg outline-none text-xs font-semibold text-charcoal-900 transition-all duration-200 resize-none leading-relaxed"
                  />
                </div>

                {/* Submit button bar */}
                <div className="flex gap-4 mt-6 pt-6 border-t border-cream-200">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 bg-white hover:bg-cream-50 text-charcoal-700 text-xxs font-bold uppercase tracking-widest py-4 rounded-xl border border-cream-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#AB6970] to-[#C48A90] text-white text-xxs font-bold uppercase tracking-widest py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    {editingProduct ? 'Save Changes' : 'Add Blouse'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slide-over User Profile Details & Favorite Items Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-charcoal-900/30 backdrop-blur-xs"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-[#FCFBF9] border-l border-cream-200 h-full shadow-2xl flex flex-col z-10 font-sans text-charcoal-900"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-cream-200 flex items-center justify-between bg-white shadow-xs">
                <div className="flex flex-col text-left">
                  <h3 className="font-serif text-base font-bold text-charcoal-900 tracking-wide">
                    Customer Profile
                  </h3>
                  <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider mt-0.5">
                    Personal Details & Wishlist
                  </span>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 rounded-full border border-cream-200 hover:border-rose-300 text-charcoal-500 hover:text-rose-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Content Area */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-left select-none">
                
                {/* Header Avatar and Basic Info */}
                <div className="bg-white p-5 border border-cream-200 rounded-xl flex items-center gap-4 shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-rose-50 text-[#AB6970] border border-rose-100 flex items-center justify-center font-serif font-bold text-lg shadow-inner">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-charcoal-900 leading-tight">{selectedUser.name}</span>
                    <span className="text-xs text-charcoal-500 font-semibold mt-0.5">{selectedUser.email}</span>
                    <span className={`text-[8.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border mt-2 w-max ${
                      selectedUser.isAdmin ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-cream-100 text-charcoal-600 border-cream-200'
                    }`}>
                      {selectedUser.isAdmin ? 'Admin Role' : 'Registered Client'}
                    </span>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white p-5 border border-cream-200 rounded-xl shadow-xs flex flex-col gap-4">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-charcoal-500 border-b border-cream-100 pb-2">
                    Personal Details
                  </h4>
                  
                  <div className="flex flex-col gap-3.5 text-xs font-medium">
                    <div className="flex items-center gap-3">
                      <FiPhone className="text-[#AB6970] w-4 h-4 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-cream-500 uppercase leading-none mb-1">Phone Number</span>
                        <span className="text-charcoal-800 font-semibold">{selectedUser.phone || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiMail className="text-[#AB6970] w-4 h-4 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-cream-500 uppercase leading-none mb-1">Email Address</span>
                        <span className="text-charcoal-800 font-semibold">{selectedUser.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiMapPin className="text-[#AB6970] w-4 h-4 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-cream-500 uppercase leading-none mb-1">Shipping Address</span>
                        <span className="text-charcoal-800 font-semibold">{[selectedUser.address, selectedUser.city].filter(Boolean).join(', ') || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiLayers className="text-[#AB6970] w-4 h-4 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-cream-500 uppercase leading-none mb-1">Registration Date</span>
                        <span className="text-charcoal-800 font-semibold">
                          {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          }) : 'Fallback Joined'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Favorite Items (Wishlist Grid) */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-charcoal-500 border-b border-cream-100 pb-2 flex items-center gap-1.5">
                    <FiHeart className="text-rose-500 w-4 h-4 fill-rose-50" />
                    Favorite items ({selectedUserFavorites.length})
                  </h4>

                  <div className="flex flex-col gap-3">
                    {selectedUserFavorites.map((prod) => (
                      <div key={prod.id || prod._id} className="bg-white border border-cream-200 rounded-xl p-3 flex items-center gap-3.5 hover:border-rose-200 transition-all duration-200 shadow-xxs">
                        <img src={prod.image} alt={prod.name} className="w-10 h-12 object-cover rounded-lg bg-cream-50 border border-cream-100" />
                        <div className="flex-1 flex flex-col text-left overflow-hidden">
                          <span className="text-[8px] font-bold text-rose-500 tracking-wider uppercase leading-none mb-1">{prod.tag} COLLECTION</span>
                          <span className="text-xs font-bold text-charcoal-900 truncate max-w-[220px]" title={prod.name}>{prod.name}</span>
                          <span className="text-[9px] font-semibold text-charcoal-500 mt-0.5">{prod.fabric} • {prod.color}</span>
                        </div>
                      </div>
                    ))}
                    {selectedUserFavorites.length === 0 && (
                      <div className="text-center py-8 text-xs text-charcoal-400 bg-white border border-dashed border-cream-200 rounded-xl">
                        This customer hasn't added any favorites yet.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <QuickViewModal />
    </div>
  );
}
