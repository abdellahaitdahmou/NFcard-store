const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'client', 'src');

// ── 1. PortfolioExemple.tsx ──────────────────────────────────────────────────
const portfolioExemplePath = path.join(root, 'pages', 'PortfolioExemple.tsx');
let portfolioContent = fs.readFileSync(portfolioExemplePath, 'utf8');

// Replace hero banner from dark to light white/gray/gold
portfolioContent = portfolioContent.replace(
  'className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 relative overflow-hidden"',
  'className="bg-gradient-to-b from-amber-50/80 via-white to-slate-50 text-slate-900 py-20 relative overflow-hidden border-b border-amber-200/50"'
);

portfolioContent = portfolioContent.replace(
  'className="text-gray-400 text-lg max-w-2xl mx-auto"',
  'className="text-slate-600 text-lg max-w-2xl mx-auto font-medium"'
);

// Replace phone mockup frame from dark slate-900 to sleek pearl-silver/gold luxury frame
portfolioContent = portfolioContent.replace(
  'className="bg-slate-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-950/20"',
  'className="bg-slate-100 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-300 ring-1 ring-slate-200 shadow-amber-500/10"'
);

portfolioContent = portfolioContent.replace(
  'className="mx-auto w-28 h-6 bg-slate-950 rounded-full mb-2 flex items-center justify-end pr-3"',
  'className="mx-auto w-28 h-6 bg-slate-300 rounded-full mb-2 flex items-center justify-end pr-3"'
);

fs.writeFileSync(portfolioExemplePath, portfolioContent, 'utf8');
console.log('PortfolioExemple.tsx updated to White, Gray & Gold');

// ── 2. Home.tsx ─────────────────────────────────────────────────────────────
const homePath = path.join(root, 'pages', 'Home.tsx');
let homeContent = fs.readFileSync(homePath, 'utf8');

homeContent = homeContent.replace(
  'className="py-28 bg-slate-950 text-white relative overflow-hidden"',
  'className="py-28 bg-gradient-to-b from-slate-50 via-amber-50/40 to-white text-slate-900 relative overflow-hidden border-t border-amber-200/60"'
);
homeContent = homeContent.replace(
  'className="blob w-[500px] h-[500px] bg-emerald-900/50',
  'className="blob w-[500px] h-[500px] bg-emerald-200/40'
);
homeContent = homeContent.replace(
  'className="blob w-[400px] h-[400px] bg-amber-900/30',
  'className="blob w-[400px] h-[400px] bg-amber-200/50'
);
homeContent = homeContent.replace(
  'className="text-gray-400 text-lg max-w-xl mx-auto"',
  'className="text-slate-600 text-lg max-w-xl mx-auto"'
);
homeContent = homeContent.replace(
  'className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300',
  'className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800'
);

fs.writeFileSync(homePath, homeContent, 'utf8');
console.log('Home.tsx CTA section updated to light mode');

// ── 3. Footer.tsx ────────────────────────────────────────────────────────────
const footerPath = path.join(root, 'components', 'common', 'Footer.tsx');
const newFooter = `import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Zap, Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck, CreditCard, Star } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

const trustItems = [
  { icon: Truck,        color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', title: 'Livraison Express', sub: '24h à 48h dans tout le Maroc' },
  { icon: CreditCard,   color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200',     title: 'Paiement à Livraison', sub: 'Réglez en espèces à réception' },
  { icon: ShieldCheck,  color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200',       title: 'Garantie 2 Ans',      sub: 'Puce NFC haute sensibilité' },
  { icon: MessageCircle,color: 'text-purple-600',  bg: 'bg-purple-50 border-purple-200',   title: 'Support 7j/7',        sub: 'Assistance WhatsApp continue' },
];

export const Footer: React.FC = () => {
  const { settings, openWhatsAppChat } = useSettings();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200/80 overflow-hidden" ref={ref}>

      {/* Top trust banner */}
      <div className="border-b border-slate-100 py-10 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustItems.map((t, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i + 0.1, duration: 0.6 }}
              >
                <motion.div
                  className={\`w-12 h-12 rounded-2xl flex items-center justify-center border \${t.bg} \${t.color} flex-shrink-0 shadow-sm\`}
                  whileHover={{ scale: 1.08, rotate: -4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <t.icon className="w-6 h-6" />
                </motion.div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                  <p className="text-xs text-slate-500">{t.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand col */}
          <motion.div
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <Zap className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-extrabold text-slate-900 text-xl tracking-tight">
                Tek<span className="text-emerald-600">tap</span>
                <span className="text-xs text-amber-600 font-bold ml-2 uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">Maroc</span>
              </span>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              La solution de référence au Royaume du Maroc pour créer, gérer et partager vos cartes de visite NFC intelligentes et profils professionnels sans contact.
            </p>

            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              <span className="text-xs text-slate-600 font-semibold ml-1.5">4.9/5 · +850 avis clients vérifiés</span>
            </div>

            <motion.button
              onClick={() => openWhatsAppChat()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp - {settings.whatsappDisplay}
            </motion.button>
          </motion.div>

          {/* Nav col */}
          {[
            {
              title: 'Navigation',
              links: [
                { to: '/products', l: 'Nos Cartes NFC' },
                { to: '/packs', l: 'Packs Métiers' },
                { to: '/portfolio-exemple', l: 'Exemples de Profils' },
                { to: '/solutions', l: 'Solutions par Secteur' },
                { to: '/templates', l: 'Galerie Modèles' },
                { to: '/comment-ca-marche', l: 'Comment ça marche' },
              ]
            },
            {
              title: 'Packs Métiers',
              links: [
                { to: '/packs', l: 'Pack Restaurant & Café' },
                { to: '/packs', l: 'Pack Agent Immobilier' },
                { to: '/packs', l: 'Pack Beauté & Salons' },
                { to: '/packs', l: 'Pack Freelance & Tech' },
                { to: '/packs', l: 'Pack Flotte Entreprise' },
                { to: '/commander', l: 'Commander ma carte' },
              ]
            },
            {
              title: 'Contact & Support',
              content: (
                <div className="space-y-2.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-600" /> {settings.supportPhone}</p>
                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-amber-600" /> {settings.supportEmail}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-600" /> Casablanca & Marrakech</p>
                  <p className="text-[11px] text-slate-500 pt-1 font-medium">🇲🇦 Expédition dans tout le Royaume</p>
                </div>
              )
            }
          ].map((col, i) => (
            <motion.div
              key={i}
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i + 0.3 }}
            >
              <h4 className="font-bold text-slate-900 text-sm">{col.title}</h4>
              {col.content ? col.content : (
                <ul className="space-y-2">
                  {col.links?.map((lk) => (
                    <li key={lk.l}>
                      <Link to={lk.to} className="text-xs text-slate-500 hover:text-amber-600 transition-colors link-underline">{lk.l}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <p>© 2026 Tektap NFC Maroc. Tous droits réservés. Conforme CNDP loi 09-08.</p>
          <div className="flex gap-6">
            <Link to="/politique-confidentialite" className="hover:text-amber-600 transition-colors">Confidentialité</Link>
            <Link to="/conditions-generales" className="hover:text-amber-600 transition-colors">Conditions Générales</Link>
            <Link to="/admin/login" className="hover:text-emerald-600 transition-colors">Accès Admin</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
`;
fs.writeFileSync(footerPath, newFooter, 'utf8');
console.log('Footer.tsx updated to White, Gray & Gold');

// ── 4. InteractiveNfcDemo.tsx ────────────────────────────────────────────────
const demoPath = path.join(root, 'components', 'home', 'InteractiveNfcDemo.tsx');
let demoContent = fs.readFileSync(demoPath, 'utf8');

demoContent = demoContent.replace(
  'className="w-[320px] sm:w-[360px] bg-slate-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800 relative ring-1 ring-slate-950/20"',
  'className="w-[320px] sm:w-[360px] bg-slate-100 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-300 relative ring-1 ring-slate-200"'
);
demoContent = demoContent.replace(
  'className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-950 rounded-full z-30 flex items-center justify-end px-2"',
  'className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-300 rounded-full z-30 flex items-center justify-end px-2"'
);

fs.writeFileSync(demoPath, demoContent, 'utf8');
console.log('InteractiveNfcDemo.tsx updated');

console.log('All light mode conversions completed successfully!');
