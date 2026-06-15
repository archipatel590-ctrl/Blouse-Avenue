import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

export default function LoginModal() {
  const { isLoginOpen, setIsLoginOpen, login } = useContext(ShopContext);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isLoginOpen) return null;

  const handleClose = () => {
    setIsLoginOpen(false);
    setError('');
    setEmail('');
    setName('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setError('Please fill in all details.');
      return;
    }
    
    setError('');
    const res = await login(email, password, isRegister ? name : '');
    if (res && res.success) {
      handleClose();
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    const res = await login('divya@blouseavenue.in', 'Demo1234', 'Divya Sharma');
    if (res && res.success) {
      handleClose();
    } else {
      setError(res.error || 'Demo login failed');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-charcoal-950"
        />

        {/* Form Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10 p-8 font-sans"
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-1.5">
              {isRegister ? 'Create Account' : 'Welcome to Blouse Avenue'}
            </h2>
            <p className="text-xxs font-bold tracking-widest text-charcoal-400 uppercase">
              {isRegister ? 'Join our luxury fashion boutique' : 'Access your premium orders & wishlist'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="text-xxs font-semibold text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            {isRegister && (
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-cream-50 hover:bg-cream-100/50 focus:bg-white border border-cream-200 focus:border-charcoal-800 rounded-lg outline-none text-xs font-semibold font-sans text-charcoal-800 transition-colors"
                  required
                />
              </div>
            )}

            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-cream-50 hover:bg-cream-100/50 focus:bg-white border border-cream-200 focus:border-charcoal-800 rounded-lg outline-none text-xs font-semibold font-sans text-charcoal-800 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-cream-50 hover:bg-cream-100/50 focus:bg-white border border-cream-200 focus:border-charcoal-800 rounded-lg outline-none text-xs font-semibold font-sans text-charcoal-800 transition-colors"
                required
              />
            </div>

            {!isRegister && (
              <div className="text-right">
                <a href="#" className="text-xxs font-bold text-rose-500 hover:underline">
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-charcoal-900 hover:bg-rose-500 text-white font-bold uppercase tracking-widest text-xs py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-98 mt-2"
            >
              {isRegister ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {/* Social login / demo spacer */}
          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 h-px bg-cream-200 -z-10" />
            <span className="bg-white px-3 text-[10px] text-charcoal-400 font-bold uppercase tracking-wider">
              Or
            </span>
          </div>

          {/* Demo account click */}
          <button
            onClick={handleDemoLogin}
            className="w-full bg-[#FAF7F0] hover:bg-rose-50 border border-cream-200 hover:border-rose-200 text-charcoal-800 hover:text-rose-600 font-bold uppercase tracking-widest text-[10px] py-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            🔑 Log In With Demo Account
          </button>

          {/* Switch Link */}
          <div className="text-center mt-6 text-xs text-charcoal-500">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="font-bold text-rose-500 hover:underline"
            >
              {isRegister ? 'Sign In' : 'Register Now'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
