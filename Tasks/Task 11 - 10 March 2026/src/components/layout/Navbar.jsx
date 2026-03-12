import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { supabase } from '../../services/supabase';
import { clearAuth } from '../../store/slices/authSlice';
import { toggleTheme } from '../../store/slices/themeSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearAuth());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'Watchlist', path: '/watchlist', protected: true },
  ];

  const isHomePage = location.pathname === '/';
  const isDetailPage = location.pathname.startsWith('/movie/');
  const isOverHero = (isHomePage || isDetailPage) && !isScrolled;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center px-6 md:px-12 ${
      isScrolled
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg'
        : isOverHero
          ? 'bg-gradient-to-b from-black/50 via-black/20 to-transparent'
          : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-display font-bold text-accent tracking-tighter">
          CINEVIA
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            (!link.protected || user) && (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:text-accent ${
                  location.pathname === link.path ? 'text-accent' : isOverHero ? 'text-white' : 'text-primary'
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => dispatch(toggleTheme())}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all relative active:scale-95 ${
              isOverHero ? 'text-white hover:bg-white/10' : 'text-primary/70 hover:bg-surface'
            }`}
            title="Toggle Theme"
          >
            <AnimatePresence mode="wait">
              {mode === 'dark' ? (
                <motion.svg 
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707-.707M15.657 15.657l-.707.707" />
                </motion.svg>
              ) : (
                <motion.svg 
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
                  {user.email[0].toUpperCase()}
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors hidden md:block ${
                  isOverHero ? 'text-white/70 hover:text-white' : 'text-primary/60 hover:text-accent'
                }`}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-5 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-surface border-b border-border md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                (!link.protected || user) && (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium py-2 border-b border-border/50"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              {user && (
                <button 
                  onClick={handleLogout}
                  className="text-left py-2 text-accent font-bold"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
