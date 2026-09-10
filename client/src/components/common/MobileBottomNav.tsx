import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, LayoutGrid, Eye, ShoppingBag } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  // Hide on admin and profile preview pages
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/p/') ||
    location.pathname.startsWith('/card/')
  ) {
    return null;
  }

  const links = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/products', label: 'Produits', icon: Sparkles },
    { to: '/packs', label: 'Packs', icon: LayoutGrid },
    { to: '/demo', label: 'Démo', icon: Eye },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] pb-safe">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px] scale-110 text-amber-600' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] mt-1 tracking-tight">{link.label}</span>
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-dot"
                  className="absolute bottom-0 w-1 h-1 rounded-full bg-amber-600"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        {/* Highlighted Order Button */}
        <Link
          to="/commander"
          className="flex flex-col items-center justify-center py-1.5 px-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md shadow-amber-500/25 active:scale-95 transition-transform"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Commander</span>
        </Link>
      </div>
    </div>
  );
};
