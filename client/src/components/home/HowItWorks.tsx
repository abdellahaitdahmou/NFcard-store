import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Package, Camera, Sparkles, Zap } from 'lucide-react';

const steps = [
  { n: '01', icon: Package,   color: 'icon-box-orange', title: 'Commandez en ligne',  desc: 'Choisissez votre carte NFC et votre pack metier en quelques clics. Paiement a la livraison.' },
  { n: '02', icon: Camera,    color: 'icon-box-amber',   title: 'Envoyez vos infos',   desc: 'Photo de votre ancienne carte papier ou formulaire simple — nos graphistes font tout.' },
  { n: '03', icon: Sparkles,  color: 'icon-box-orange',  title: 'On cree votre profil', desc: 'Profil digital premium concu en 24h avec votre logo, liens et services.' },
  { n: '04', icon: Zap,       color: 'icon-box-amber',   title: 'Tapez et partagez',   desc: 'Un tap sur n importe quel smartphone ouvre instantanement votre profil.' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } } };

export const HowItWorks: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section-gray py-16 sm:py-20 lg:py-28 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          ref={ref}
        >
          <motion.div className="badge badge-orange mx-auto mb-4 block w-fit" initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ type: 'spring', delay: 0.2 }}>
            Comment ca marche
          </motion.div>
          <h2 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-5">
            Aussi simple que<br className="hidden sm:block" />
            <span className="gold-gradient-text"> d'appuyer sur un bouton.</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-lg max-w-xs sm:max-w-xl mx-auto leading-relaxed">
            De la commande a la livraison, tout est pris en charge par notre equipe au Maroc.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[36px] left-[14%] right-[14%] h-px bg-gradient-to-r from-orange-200 via-amber-200 to-orange-200 z-0" />

          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={item}
              className="relative z-10 flex flex-col items-center text-center gap-5"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={`icon-box ${s.color} w-16 h-16 rounded-2xl shadow-md`}>
                  <s.icon className="w-7 h-7" />
                </div>
                <motion.span
                  className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-gray-900 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={inView ? { scale: 1, rotate: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 400 }}
                >
                  {i + 1}
                </motion.span>
              </motion.div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};