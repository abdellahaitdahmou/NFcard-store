import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Smartphone, Zap, QrCode, User, BarChart3, RefreshCw, Globe, Shield } from 'lucide-react';

const services = [
  { icon: User,       color: 'icon-box-orange',  bg: 'hover:border-orange-200', title: 'Profil Digital Interactif',    desc: 'Page mobile ultra-rapide avec coordonnees, photos, services et liens partageables.' },
  { icon: Zap,        color: 'icon-box-amber',   bg: 'hover:border-amber-200',  title: 'Puce NFC Haute Sensibilite',   desc: 'Compatible tous iPhone depuis 2018 et Android sans aucune application a installer.' },
  { icon: QrCode,     color: 'icon-box-blue',    bg: 'hover:border-blue-200',   title: 'QR Code HD Integre',           desc: 'Meme profil accessible via QR code pour les smartphones sans NFC.' },
  { icon: Smartphone, color: 'icon-box-orange',  bg: 'hover:border-orange-200', title: 'vCard - 1 Tap Save',           desc: 'Contact enregistre dans le repertoire de votre interlocuteur en un seul geste.' },
  { icon: BarChart3,  color: 'icon-box-amber',   bg: 'hover:border-amber-200',  title: 'Analytics Temps Reel',         desc: 'Taps NFC, scans QR, clics WhatsApp et telechargements de contact en live.' },
  { icon: RefreshCw,  color: 'icon-box-orange',  bg: 'hover:border-orange-200', title: 'Mises a Jour Illimitees',      desc: 'Changez votre telephone ou email a tout moment. La carte reste la meme.' },
  { icon: Globe,      color: 'icon-box-blue',    bg: 'hover:border-blue-200',   title: 'Multilingue FR / AR / EN',     desc: 'Profil disponible en francais, arabe (RTL) et anglais.' },
  { icon: Shield,     color: 'icon-box-orange',  bg: 'hover:border-orange-200', title: 'Securise & RGPD',              desc: 'Conforme loi 09-08 Maroc et RGPD. Hebergement securise SSL.' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

export const ServicesSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section-white py-16 sm:py-20 lg:py-28 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="text-center mb-10 sm:mb-14 lg:mb-16"
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="badge badge-slate mx-auto mb-4 block w-fit">Ce qui est inclus</div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 sm:mb-4">
            Tout ce que vous obtenez<br className="hidden sm:block" />
            <span className="emerald-gradient-text"> avec votre carte NFcard.</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-lg max-w-xs sm:max-w-xl mx-auto leading-relaxed">
            Bien plus qu une simple carte NFC - une plateforme digitale complete pour votre activite.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={item}
              className={`card p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 cursor-default border transition-colors duration-300 ${s.bg}`}
              whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(0,0,0,0.10)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <motion.div
                className={`icon-box ${s.color}`}
                whileHover={{ scale: 1.15, rotate: -8 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <s.icon className="w-5 h-5" />
              </motion.div>
              <div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};