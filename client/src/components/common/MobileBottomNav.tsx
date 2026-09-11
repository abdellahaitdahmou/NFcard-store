import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, LayoutGrid, Eye, ShoppingBag } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/p/') ||
    location.pathname.startsWith('/card/')
  ) {
    return null;
  }

  const links = [
    { to: '/',          label: 'Accueil',  icon: Home },
    { to: '/products',  label: 'Produits', icon: Sparkles },
    { to: '/packs',     label: 'Packs',    icon: LayoutGrid },
    { to: '/demo',      label: 'Démo',     icon: Eye },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/97 backdrop-blur-xl border-t border-slate-200/80 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
      <div className="flex items-stretch justify-around px-1 py-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`relative flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-xl transition-all min-h-[52px] ${
                isActive
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-bg"
                  className="absolute inset-0 bg-orange-50 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 ${isActive ? 'stroke-[2.5px] text-orange-600' : 'stroke-[1.75px]'}`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight relative z-10 leading-none">{link.label}</span>
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-dot"
                  className="absolute top-1 w-1 h-1 rounded-full bg-orange-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}

        {/* Commander CTA */}
        <Link
          to="/commander"
          className="flex flex-col items-center justify-center flex-1 py-2 px-2 mx-1 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/30 active:scale-95 transition-transform min-h-[52px]"
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap leading-none">Commander</span>
        </Link>
      </div>
    </div>
  );
};
