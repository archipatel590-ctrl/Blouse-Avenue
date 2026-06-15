import React, { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';
  const apiUrl = (path) => `${API_BASE_URL}${path}`;

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [user, setUser] = useState({ name: '', email: '', loggedIn: false, isAdmin: false });
  const [activePage, setActivePage] = useState({ type: 'home' });
  const [isAdminStorefrontView, setIsAdminStorefrontView] = useState(false);

  // Live Database States
  const [productsList, setProductsList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Fetch all product blouses from MongoDB backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(apiUrl('/api/products'));
      if (response.ok) {
        const data = await response.json();
        setProductsList(data);
      } else {
        console.warn('API returned error status, no products loaded.');
        setProductsList([]);
      }
    } catch (err) {
      console.warn('Could not connect to API, no products loaded:', err.message);
      setProductsList([]);
    }
  };

  // Fetch registered user details from MongoDB backend (Admin only)
  const fetchUsers = async () => {
    try {
      const response = await fetch(apiUrl('/api/users'));
      if (response.ok) {
        const data = await response.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error('Error fetching registered users list:', err.message);
    }
  };

  // Load cart, wishlist, and session from local storage on mount
  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('zuri_cart');
    const savedWishlist = localStorage.getItem('zuri_wishlist');
    const savedUser = localStorage.getItem('zuri_user');

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.isAdmin) {
        fetchUsers();
      }
    }
  }, []);

  // Sync wishlist items with database user favorites when loaded
  useEffect(() => {
    if (user.loggedIn && user.favorites && productsList.length > 0) {
      const matched = productsList.filter(p => user.favorites.includes(p.id));
      setWishlistItems(matched);
    }
  }, [user, productsList]);

  // Save cart and wishlist when they change
  useEffect(() => {
    localStorage.setItem('zuri_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('zuri_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Cart Functions
  const addToCart = (product, quantity = 1, selectedSize = 'M') => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { product, quantity, selectedSize }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, selectedSize) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.product.id === productId && item.selectedSize === selectedSize))
    );
  };

  const updateQuantity = (productId, selectedSize, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Wishlist Functions
  const toggleWishlist = async (product) => {
    setWishlistItems((prevItems) => {
      const isAlreadyIn = prevItems.some((item) => item.id === product.id);
      if (isAlreadyIn) {
        return prevItems.filter((item) => item.id !== product.id);
      } else {
        return [...prevItems, product];
      }
    });

    if (user.loggedIn) {
      try {
        const response = await fetch(apiUrl('/api/users/favorites'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, productId: product.id })
        });
        if (response.ok) {
          const data = await response.json();
          setUser(prev => {
            const updated = { ...prev, favorites: data.favorites };
            localStorage.setItem('zuri_user', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.warn('Could not sync wishlist with DB:', err.message);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Full-Stack Authentication Functions
  const login = async (email, password = '', name = '') => {
    try {
      const response = await fetch(apiUrl('/api/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      
      if (response.ok) {
        const loggedUser = await response.json();
        setUser(loggedUser);
        localStorage.setItem('zuri_user', JSON.stringify(loggedUser));
        
        // Load wishlist items from user database favorites list
        if (loggedUser.favorites) {
          const matchedProds = productsList.filter(p => loggedUser.favorites.includes(p.id));
          setWishlistItems(matchedProds);
        }

        setIsLoginOpen(false);
        if (loggedUser.isAdmin) {
          await fetchUsers();
        }
        return { success: true };
      } else {
        const err = await response.json();
        return { success: false, error: err.message || 'Invalid credentials' };
      }
    } catch (error) {
      console.warn('Auth server offline, falling back to mock auth validation:', error.message);
      const isAdmin = email === 'zuri@admin.com' && password === 'zuri@2106';
      const loggedUser = {
        name: isAdmin ? 'Brand Admin' : (name || 'Divya Sharma'),
        email,
        isAdmin,
        phone: isAdmin ? '+91 99999 88888' : '+91 98765 43210',
        city: isAdmin ? 'New Delhi, DL' : 'Bengaluru, KA',
        address: isAdmin ? 'Zuri Couture Studio, Connaught Place' : '42, 8th Main Road, Indiranagar',
        favorites: isAdmin ? ['w1', 'w2', 'w3', 'w4'] : ['w1', 'w2'],
        loggedIn: true
      };
      setUser(loggedUser);
      localStorage.setItem('zuri_user', JSON.stringify(loggedUser));
      
      const matchedProds = productsList.filter(p => loggedUser.favorites.includes(p.id));
      setWishlistItems(matchedProds);

      setIsLoginOpen(false);
      return { success: true };
    }
  };

  const logout = () => {
    setUser({ name: '', email: '', loggedIn: false, isAdmin: false });
    setIsAdminStorefrontView(false);
    localStorage.removeItem('zuri_user');
  };

  // Admin CRUD Operations
  const createProduct = async (productData) => {
    try {
      const response = await fetch(apiUrl('/api/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (response.ok) {
        await fetchProducts();
        return { success: true };
      } else {
        const err = await response.json();
        return { success: false, error: err.message || 'Failed to create blouse' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await fetch(apiUrl(`/api/products/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (response.ok) {
        await fetchProducts();
        return { success: true };
      } else {
        const err = await response.json();
        return { success: false, error: err.message || 'Failed to update blouse' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(apiUrl(`/api/products/${id}`), {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchProducts();
        return { success: true };
      } else {
        const err = await response.json();
        return { success: false, error: err.message || 'Failed to delete blouse' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products: productsList,
        cartItems,
        wishlistItems,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isLoginOpen,
        setIsLoginOpen,
        quickViewProduct,
        setQuickViewProduct,
        user,
        activePage,
        setActivePage,
        isAdminStorefrontView,
        setIsAdminStorefrontView,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        toggleWishlist,
        isInWishlist,
        login,
        logout,
        // Admin CRUD methods
        users: usersList,
        fetchUsers,
        createProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
