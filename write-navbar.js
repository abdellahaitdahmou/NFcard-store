const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'client', 'src');

// ── NAVBAR ──────────────────────────────────────────────────────────────────
fs.writeFileSync(path.join(src, 'components', 'common', 'Navbar.tsx'), 
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const navLinks = [
  { to: '/products',           label: 'Produits' },
  { to: '/solutions',          label: 'Solutions' },
  { to: '/comment-ca-marche',  label: 'Comment ça marche' },
  { to: '/templates',          label: 'Modèles' },
  { to: '/packs',              label: 'Tarifs' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const { openWhatsAppChat }          = useSettings();
  const location                       = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className={
          'transition-all duration-300 ' +
          (scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-100'
            : 'bg-white/70 backdrop-blur-md')
        }>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <motion.div
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/30"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-4.5 h-4.5 text-white" />
                </motion.div>
                <span className="font-extrabold text-gray-900 text-lg tracking-tight">
                  Tek<span className="text-emerald-600">tap</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i + 0.2 }}
                    >
                      <Link
                        to={link.to}
                        className={'relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors link-underline ' +
                          (isActive ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600 hover:text-gray-900')}
                      >
                        {link.label}
                        {isActive && (
                          <motion.div
                            layoutId="navbar-pill"
                            className="absolute inset-0 bg-emerald-50 rounded-xl -z-10"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Desktop CTAs */}
              <motion.div
                className="hidden md:flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/demo"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:border-emerald-400 hover:text-emerald-600 transition-all duration-200 hover:shadow-sm"
                >
                  Démo Live
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/commander"
                    className="btn-primary btn-shimmer text-sm px-5 py-2.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Commander — dès 199 DH
                  </Link>
                </motion.div>
              </motion.div>

              {/* Burger */}
              <motion.button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen
                    ? <motion.div key="x"   initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-5 h-5" /></motion.div>
                    : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="w-5 h-5" /></motion.div>
                  }
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col p-6 gap-2"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center gap-2 mb-6 pt-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-lg">Tek<span className="text-emerald-600">tap</span></span>
              </div>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    to={link.to}
                    className={'block px-4 py-3 rounded-xl text-sm font-semibold transition-all ' +
                      (location.pathname === link.to
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600')}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 space-y-3 mt-auto">
                <Link to="/demo" className="btn-outline w-full justify-center text-sm">Démo Live</Link>
                <Link to="/commander" className="btn-primary w-full justify-center text-sm btn-shimmer">
                  <ShoppingBag className="w-4 h-4" />Commander — dès 199 DH
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
};
, 'utf8');

console.log('Navbar.tsx ✓');
