import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Zap, Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck, CreditCard, Star } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const trustItems = [
  { icon: Truck,        color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', title: 'Livraison Express', sub: '24h à 48h au Maroc' },
  { icon: CreditCard,   color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200',     title: 'Paiement à Livraison', sub: 'Réglez à réception' },
  { icon: ShieldCheck,  color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200',       title: 'Garantie 2 Ans',      sub: 'Puce NFC haute qualité' },
  { icon: MessageCircle,color: 'text-purple-600',  bg: 'bg-purple-50 border-purple-200',   title: 'Support 7j/7',        sub: 'Assistance WhatsApp' },
];

export const Footer: React.FC = () => {
  const { settings, openWhatsAppChat } = useSettings();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200/80 overflow-hidden text-center" ref={ref}>

      {/* Top trust banner - Centered 2x2 grid on mobile, 4 columns on desktop */}
      <div className="border-b border-slate-100 py-8 sm:py-10 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {trustItems.map((t, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center text-center justify-center gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-slate-200/60 shadow-sm"
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 * i + 0.05, duration: 0.5 }}
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border ${t.bg} ${t.color} flex-shrink-0 shadow-sm`}
                >
                  <t.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">{t.title}</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{t.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main links - All centered */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col items-center space-y-12">

          {/* Brand section centered */}
          <motion.div
            className="space-y-4 max-w-xl mx-auto flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
          >
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-extrabold text-slate-900 text-2xl tracking-tight">
                Tek<span className="text-emerald-600">tap</span>
                <span className="text-xs text-amber-600 font-bold ml-2 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200">Maroc</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto text-center">
              La solution de référence au Royaume du Maroc pour créer, gérer et partager vos cartes de visite NFC connectées et profils digitaux sans contact.
            </p>

            <div className="flex items-center justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              <span className="text-xs text-slate-600 font-semibold ml-1.5">4.9/5 · +850 avis clients vérifiés</span>
            </div>

            <div className="pt-1">
              <button
                onClick={() => openWhatsAppChat()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Assistance WhatsApp - {settings.whatsappDisplay}</span>
              </button>
            </div>
          </motion.div>

          {/* Nav columns (Centered 3 columns on desktop, 2 on mobile) */}
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 max-w-4xl mx-auto pt-4 border-t border-slate-100">
            
            {/* Col 1: Navigation */}
            <div className="space-y-3 flex flex-col items-center">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider text-amber-700">Navigation</h4>
              <ul className="space-y-2 text-center">
                {[
                  { to: '/products', l: 'Nos Produits' },
                  { to: '/packs', l: 'Packs & Tarifs' },
                  { to: '/templates', l: 'Modèles & Thèmes' },
                  { to: '/solutions', l: 'Solutions Métiers' },
                  { to: '/comment-ca-marche', l: 'Comment ça marche' },
                  { to: '/demo', l: 'Démo Interactive' },
                ].map((lk) => (
                  <li key={lk.l}>
                    <Link to={lk.to} className="text-xs text-slate-500 hover:text-amber-600 transition-colors link-underline font-medium">
                      {lk.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2: Packs Métiers */}
            <div className="space-y-3 flex flex-col items-center">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider text-amber-700">Packs Métiers</h4>
              <ul className="space-y-2 text-center">
                {[
                  { to: '/packs', l: 'Restaurant & Café' },
                  { to: '/packs', l: 'Agent Immobilier' },
                  { to: '/packs', l: 'Beauté & Salons' },
                  { to: '/packs', l: 'Freelance & Tech' },
                  { to: '/packs', l: 'Flotte Entreprise' },
                  { to: '/commander', l: 'Commander ma carte' },
                ].map((lk) => (
                  <li key={lk.l}>
                    <Link to={lk.to} className="text-xs text-slate-500 hover:text-amber-600 transition-colors link-underline font-medium">
                      {lk.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contact & Support */}
            <div className="space-y-3 flex flex-col items-center col-span-2 md:col-span-1">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider text-amber-700">Contact</h4>
              <div className="space-y-2.5 text-xs text-slate-600 flex flex-col items-center text-center">
                <p className="flex items-center gap-2 justify-center"><Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> {settings.supportPhone}</p>
                <p className="flex items-center gap-2 justify-center"><Mail className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" /> {settings.supportEmail}</p>
                <p className="flex items-center gap-2 justify-center"><MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /> Casablanca & Marrakech</p>
                <p className="text-[11px] text-slate-500 pt-1 font-medium text-center">🇲🇦 Expédition dans tout le Maroc</p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom bar centered */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-200 flex flex-col items-center justify-center gap-3 text-xs text-slate-500 text-center pb-16 md:pb-0">
          <p>© 2026 Tektap NFC Maroc. Tous droits réservés. Conforme CNDP loi 09-08.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-1">
            <Link to="/politique-confidentialite" className="hover:text-amber-600 transition-colors">Confidentialité</Link>
            <Link to="/conditions-generales" className="hover:text-amber-600 transition-colors">Conditions Générales</Link>
            <Link to="/admin/login" className="hover:text-emerald-600 transition-colors">Accès Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
