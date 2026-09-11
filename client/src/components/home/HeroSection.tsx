import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ShoppingBag, Play, CheckCircle, Zap, Smartphone, QrCode, ArrowDown } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const stats = [
  { value: 850, suffix: '+', label: 'Professionnels', color: 'text-orange-500' },
  { value: 12,  suffix: '',  label: 'Villes Maroc',   color: 'text-amber-500' },
  { value: 24,  suffix: 'h', label: 'Livraison',      color: 'text-orange-600' },
  { value: 99,  suffix: '%', label: 'Satisfaction',   color: 'text-orange-500' },
];

const trustBadges = [
  { icon: CheckCircle, text: 'Sans application' },
  { icon: Smartphone,  text: 'iPhone & Android' },
  { icon: Zap,         text: 'Livraison 24h' },
  { icon: QrCode,      text: 'QR Code inclus' },
];

export const HeroSection: React.FC = () => {
  const { openWhatsAppChat } = useSettings();
  const ref      = useRef(null);
  const statsRef = useRef(null);
  const isInView     = useInView(ref,      { once: true, margin: '-40px' });
  const statsVisible = useInView(statsRef, { once: true, margin: '-40px' });

  const c0 = useCountUp(850, 1800, statsVisible);
  const c1 = useCountUp(12,  1400, statsVisible);
  const c2 = useCountUp(24,  1200, statsVisible);
  const c3 = useCountUp(99,  2000, statsVisible);
  const counts = [c0, c1, c2, c3];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[100svh] sm:min-h-[92vh] flex flex-col justify-center pt-20 pb-6 sm:pb-12"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="blob w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] lg:w-[680px] lg:h-[680px] bg-orange-200/40 top-[-8%] right-[-8%]"
          animate={{ scale: [1, 1.12, 0.95, 1], x: [0, 20, -10, 0], y: [0, -15, 12, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="blob w-[220px] h-[220px] sm:w-[400px] sm:h-[400px] lg:w-[540px] lg:h-[540px] bg-amber-200/35 bottom-[-6%] left-[-6%]"
          animate={{ scale: [1, 0.92, 1.06, 1], x: [0, -15, 12, 0], y: [0, 15, -12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          <div className="space-y-5 sm:space-y-7 text-center lg:text-left">

            <motion.div
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-orange-200 shadow-sm shadow-orange-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-orange-800">
                  N°1 au Maroc · +850 Professionnels équipés
                </span>
              </div>
            </motion.div>

            <div className="space-y-0.5 overflow-hidden">
              {['Votre carte', 'de visite.'].map((line, li) => (
                <motion.h1
                  key={li}
                  className="text-[2.3rem] xs:text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-black text-slate-900 leading-[1.06] tracking-tight"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.75, delay: 0.18 + li * 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  {line}
                </motion.h1>
              ))}
              <motion.h1
                className="text-[2.1rem] xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight gold-gradient-text"
                initial={{ y: '100%', opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.75, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                Maintenant connectée.
              </motion.h1>
            </div>

            <motion.p
              className="text-gray-500 text-sm sm:text-base lg:text-lg max-w-[320px] mx-auto lg:mx-0 lg:max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.58 }}
            >
              Un tap suffit pour partager votre profil complet, vCard, QR code et réseaux sociaux — sans application, compatible tous smartphones.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.72 }}
            >
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/commander"
                  className="btn-gold btn-shimmer flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold w-full sm:w-auto"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  Commander — dès 130 DH
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/demo"
                  className="btn-outline flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold w-full sm:w-auto"
                >
                  <Play className="w-4 h-4 text-orange-500 fill-orange-500 flex-shrink-0" />
                  Voir la démo
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.88 }}
            >
              {trustBadges.map(({ icon: Icon, text }, i) => (
                <motion.span
                  key={text}
                  className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-sm text-gray-500 font-medium"
                  initial={{ opacity: 0, x: -8 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.92 + i * 0.07 }}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
                  {text}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="flex items-center justify-center relative mt-6 lg:mt-0"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative w-full max-w-[220px] xs:max-w-[270px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[440px] aspect-[1.586/1] mx-auto">
              <motion.div
                className="absolute inset-6 sm:inset-8 rounded-full"
                animate={{ opacity: [0.25, 0.65, 0.25] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'radial-gradient(circle, rgba(253,103,1,0.28) 0%, transparent 70%)' }}
              />
              <motion.div
                className="nfc-card w-full h-full p-3 xs:p-4 sm:p-6 flex flex-col justify-between shadow-2xl relative select-none"
                whileHover={{ scale: 1.04, rotateY: 5, rotateX: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ cursor: 'pointer', transformStyle: 'preserve-3d' }}
              >
                <div className="scan-line" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <div className="w-14 sm:w-20 h-1.5 rounded-full bg-white/30" />
                    <div className="w-10 sm:w-14 h-1 rounded-full bg-white/20" />
                  </div>
                  <div className="nfc-chip-pulse w-7 h-4 sm:w-9 sm:h-6 rounded-sm bg-amber-400/90 border border-amber-300/50 shadow-inner" />
                </div>
                <div className="relative z-10">
                  <p className="text-white/80 text-[8px] sm:text-[10px] font-extrabold tracking-widest mb-1">NFCARD MAROC</p>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                      <Zap className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 text-amber-300" />
                    </div>
                    <span className="text-white/50 text-[7px] sm:text-[9px] font-mono tracking-widest">NFC · QR · DIGITAL</span>
                  </div>
                </div>
              </motion.div>

              {[
                { label: '850+ clients',   color: 'bg-emerald-500', delay: 0.5, top: '8%',  right: '-2%' },
                { label: 'Tap instantané', color: 'bg-blue-500',    delay: 0.7, bottom: '10%', left: '-4%' },
                { label: 'QR inclus',      color: 'bg-purple-500',  delay: 0.9, top: '50%', right: '-6%' },
              ].map((pill, i) => (
                <motion.div
                  key={i}
                  className="stat-pill absolute text-gray-700 z-20 !hidden sm:!inline-flex text-[10px] sm:text-xs px-2.5 py-1.5 sm:px-3.5 sm:py-2"
                  style={{
                    top: pill.top,
                    bottom: (pill as any).bottom,
                    right: (pill as any).right,
                    left: (pill as any).left,
                    animationDelay: `${i * 1.2}s`,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: pill.delay, type: 'spring', stiffness: 300 }}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${pill.color}`} />
                  {pill.label}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          ref={statsRef}
          className="mt-8 sm:mt-12"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 1.0 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                className="card p-3 sm:p-5 text-center flex flex-col justify-center"
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={`text-2xl sm:text-3xl font-black ${s.color}`}>
                  {counts[i]}{s.suffix}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5 sm:mt-1 leading-tight">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="hidden sm:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-gray-400"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[9px] font-semibold tracking-widest uppercase">Découvrir</span>
        <ArrowDown className="w-3.5 h-3.5" />
      </motion.div>
    </section>
  );
};
