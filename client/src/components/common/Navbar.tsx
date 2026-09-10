import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, ShoppingBag } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const navLinks = [
  { to: '/products',          label: 'Produits' },
  { to: '/packs',             label: 'Packs & Tarifs' },
  { to: '/templates',         label: 'Modèles' },
  { to: '/solutions',         label: 'Solutions' },
  { to: '/comment-ca-marche', label: 'Comment ça marche' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openWhatsAppChat }        = useSettings();
  const location                     = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
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
        <div className={`transition-all duration-300 ${scrolled
          ? 'bg-white/96 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-100'
          : 'bg-white/85 backdrop-blur-md'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">

              <Link to="/" className="flex items-center gap-2.5 group">
                <img
                  src="/logo.png"
                  alt="NFcard Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain transition-transform group-hover:scale-105 filter drop-shadow-sm"
                />
                <span className="font-black text-orange-500 text-2xl sm:text-[28px] tracking-tight flex items-center">
                  card
                  <span className="text-[10px] sm:text-xs font-black text-orange-800 ml-2 uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200">.MA</span>
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link, i) => {
                  const active = location.pathname === link.to;
                  return (
                    <motion.div key={link.to} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i + 0.2 }}>
                      <Link
                        to={link.to}
                        className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors link-underline ${active ? 'text-orange-600 font-bold' : 'text-gray-600 hover:text-gray-900'}`}
                      >
                        {active && (
                          <motion.span
                            layoutId="nav-pill"
                            className="absolute inset-0 bg-orange-50 rounded-xl -z-10"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div className="hidden md:flex items-center gap-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Link to="/demo" className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:border-orange-400 hover:text-orange-600 transition-all duration-200">
                  Demo Live
                </Link>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/commander" className="btn-primary btn-shimmer text-sm px-5 py-2.5 rounded-xl flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Commander dès 130 DH
                  </Link>
                </motion.div>
              </motion.div>

              <motion.button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors" whileTap={{ scale: 0.88 }}>
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen
                    ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="w-6 h-6" /></motion.div>
                    : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-6 h-6" /></motion.div>
                  }
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.div className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col p-6 gap-2 overflow-y-auto" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className="flex items-center gap-2.5 mb-6 pt-2">
                <img src="/logo.png" alt="NFcard Logo" className="w-12 h-12 object-contain" />
                <span className="font-black text-orange-500 text-2xl flex items-center">
                  card
                  <span className="text-[10px] font-black text-orange-800 ml-1.5 uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200">.MA</span>
                </span>
              </div>
              {navLinks.map((link, i) => (
                <motion.div key={link.to} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * i + 0.1 }}>
                  <Link to={link.to} className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${location.pathname === link.to ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700 hover:bg-orange-50/50 hover:text-orange-600'}`}>{link.label}</Link>
                </motion.div>
              ))}
              <div className="pt-6 mt-auto space-y-3">
                <Link to="/demo" className="block text-center px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700">Demo Live</Link>
                <Link to="/commander" className="btn-primary w-full justify-center text-sm btn-shimmer flex items-center gap-2 rounded-xl py-3">
                  <ShoppingBag className="w-4 h-4" />Commander dès 130 DH
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-20" />
    </>
  );
};