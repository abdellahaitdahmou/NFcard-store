import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
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
  { value: 850, suffix: '+', label: 'Professionnels', color: 'text-emerald-600' },
  { value: 12, suffix: '', label: 'Villes au Maroc', color: 'text-amber-600' },
  { value: 24, suffix: 'h', label: 'Livraison Express', color: 'text-blue-600' },
  { value: 99, suffix: '%', label: 'Satisfaction Client', color: 'text-purple-600' },
];

const trustBadges = [
  { icon: CheckCircle, text: 'Sans application' },
  { icon: Smartphone,  text: 'iPhone & Android' },
  { icon: Zap,         text: 'Livraison 24h' },
  { icon: QrCode,      text: 'QR Code inclus' },
];

export const HeroSection: React.FC = () => {
  const { openWhatsAppChat } = useSettings();
  const ref       = useRef(null);
  const statsRef  = useRef(null);
  const isInView  = useInView(ref, { once: true, margin: '-80px' });
  const statsVisible = useInView(statsRef, { once: true, margin: '-50px' });

  const c0 = useCountUp(850, 1800, statsVisible);
  const c1 = useCountUp(12,  1400, statsVisible);
  const c2 = useCountUp(24,  1200, statsVisible);
  const c3 = useCountUp(99,  2000, statsVisible);
  const counts = [c0, c1, c2, c3];

  const headline = ['Votre carte', 'de visite.'];
  const headlineGold = 'Maintenant connectee.';

  return (
    <section ref={ref} className="relative overflow-hidden min-h-[92vh] flex flex-col justify-center">

      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="blob w-[600px] h-[600px] bg-emerald-200/50 top-[-10%] right-[-5%]"
          animate={{ scale: [1, 1.1, 0.95, 1], x: [0, 30, -10, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="blob w-[500px] h-[500px] bg-amber-200/40 bottom-[-10%] left-[-8%]"
          animate={{ scale: [1, 0.9, 1.05, 1], x: [0, -20, 15, 0], y: [0, 20, -15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <motion.div
          className="blob w-[350px] h-[350px] bg-blue-200/30 top-[40%] left-[35%]"
          animate={{ scale: [1, 1.15, 0.9, 1], x: [0, 20, -25, 0], y: [0, -30, 10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT: Copy ── */}
        <div className="space-y-8">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-emerald-200 shadow-sm shadow-emerald-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-emerald-800">N°1 au Maroc · +850 Professionnels equipés</span>
            </div>
          </motion.div>

          {/* Headline */}
          <div className="space-y-1 overflow-hidden">
            {headline.map((line, li) => (
              <motion.h1
                key={li}
                className="text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.08] tracking-tight"
                initial={{ y: '100%', opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + li * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                {line}
              </motion.h1>
            ))}
            <motion.h1
              className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none gold-gradient-text"
              initial={{ y: '100%', opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
            >
              {headlineGold}
            </motion.h1>
          </div>

          {/* Sub */}
          <motion.p
            className="text-gray-500 text-lg sm:text-xl max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            Un tap suffit pour partager votre profil complet, vCard, QR code et reseaux sociaux — sans application, compatible tous smartphones.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/commander" className="btn-gold btn-shimmer flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold">
                <ShoppingBag className="w-5 h-5" />
                Commander — dès 130 DH
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/demo" className="btn-outline flex items-center gap-2 rounded-2xl px-8 py-4 text-base">
                <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                Voir la demo
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {trustBadges.map(({ icon: Icon, text }, i) => (
              <motion.span
                key={text}
                className="flex items-center gap-1.5 text-sm text-gray-500 font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.95 + i * 0.08 }}
              >
                <Icon className="w-4 h-4 text-emerald-500" />
                {text}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: NFC Card Visual ── */}
        <motion.div
          className="flex items-center justify-center relative"
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-full max-w-[290px] xs:max-w-[340px] sm:max-w-[400px] md:max-w-[440px] aspect-[1.586/1] mx-auto flex items-center justify-center">

            {/* Glow ring */}
            <motion.div
              className="absolute inset-8 rounded-full"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.25) 0%, transparent 70%)' }}
            />

            {/* The NFC card */}
            <motion.div
              className="nfc-card w-full h-full p-4 xs:p-5 sm:p-6 flex flex-col justify-between shadow-2xl relative select-none"
              whileHover={{ scale: 1.06, rotateY: 5, rotateX: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ cursor: 'pointer', transformStyle: 'preserve-3d' }}
            >
              {/* Scan animation line */}
              <div className="scan-line" />

              <div className="flex items-center justify-between relative z-10">
                <div className="space-y-1">
                  <div className="w-20 h-1.5 rounded-full bg-white/30" />
                  <div className="w-14 h-1 rounded-full bg-white/20" />
                </div>
                <div className="nfc-chip-pulse w-9 h-6 rounded-sm bg-amber-400/90 border border-amber-300/50 shadow-inner" />
              </div>

              <div className="relative z-10">
                <p className="text-white/80 text-[10px] font-extrabold tracking-widest mb-1.5">NFCARD MAROC</p>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-amber-300" />
                  </div>
                  <span className="text-white/50 text-[9px] font-mono tracking-widest">NFC · QR · DIGITAL</span>
                </div>
              </div>
            </motion.div>

            {/* Floating stat pills */}
            {[
              { label: '850+ clients', color: 'bg-emerald-500', delay: 0.4, top: '8%', right: '-2%' },
              { label: 'Tap instantane', color: 'bg-blue-500', delay: 0.6, bottom: '12%', left: '-4%' },
              { label: 'QR inclus', color: 'bg-purple-500', delay: 0.8, top: '50%', right: '-6%' },
            ].map((pill, i) => (
              <motion.div
                key={i}
                className="stat-pill absolute text-gray-700 z-20"
                style={{ top: pill.top, bottom: (pill as any).bottom, right: (pill as any).right, left: (pill as any).left, animationDelay: `${i * 1.2}s` }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: pill.delay, type: 'spring', stiffness: 300 }}
              >
                <span className={`w-2 h-2 rounded-full ${pill.color}`} />
                {pill.label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div
        ref={statsRef}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 1.1 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="card p-3.5 sm:p-5 text-center flex flex-col justify-center"
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className={`text-3xl font-black ${s.color}`}>
                {counts[i]}{s.suffix}
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase">Decouvrir</span>
        <ArrowDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
};