import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { HeroSection } from "../components/home/HeroSection";
import { InteractiveNfcDemo } from "../components/home/InteractiveNfcDemo";
import { OldCardSection } from "../components/home/OldCardSection";
import { HowItWorks } from "../components/home/HowItWorks";
import { ServicesSection } from "../components/home/ServicesSection";
import { BusinessSolutionsGrid } from "../components/home/BusinessSolutionsGrid";
import { FeaturedProductsSection } from "../components/home/FeaturedProductsSection";
import { useSettings } from "../contexts/SettingsContext";
import { motion, useInView } from "framer-motion";
import { Star, ShoppingBag, MessageCircle, CheckCircle, Zap } from "lucide-react";

const reviews = [
  { name: "Youssef El Amrani", role: "Directeur Agence Immobiliere", city: "Marrakech", rating: 5, text: "Nos agents utilisent Tektap depuis 3 mois. Les clients adorent scanner la carte en visite et retrouver tous nos biens directement sur leur telephone." },
  { name: "Chef Nabil Bennani", role: "Proprietaire de Restaurant",   city: "Casablanca", rating: 5, text: "Menu numerique, reservations WhatsApp, avis Google — tout en un seul tap. Le pack Restaurant a change la facon dont nos clients interagissent avec nous." },
  { name: "Kenza Tazi",         role: "Architecte d Interieur",       city: "Rabat",      rating: 5, text: "J avais une ancienne carte papier. Tektap a tout cree en 24h a partir d une simple photo. Le resultat est ultra professionnel." },
];

function ReviewCard({ r, i }: { r: typeof reviews[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className="card p-5 sm:p-7 md:p-8 flex flex-col gap-4"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.12 * i, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(0,0,0,0.10)' }}
    >
      <div className="flex gap-1">
        {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed flex-1">"{r.text}"</p>
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-900 text-sm">{r.name}</p>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">{r.role}</p>
        </div>
        <span className="text-xs text-gray-400">{r.city}</span>
      </div>
    </motion.div>
  );
}

export const Home: React.FC = () => {
  const { openWhatsAppChat } = useSettings();
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' });
  const reviewsRef = useRef(null);
  const reviewsInView = useInView(reviewsRef, { once: true, margin: '-80px' });

  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <InteractiveNfcDemo />
      <OldCardSection />
      <FeaturedProductsSection />
      <BusinessSolutionsGrid />
      <ServicesSection />

      {/* Reviews */}
      <section className="section-white py-28 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={reviewsRef}
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="badge badge-amber mx-auto mb-4 block w-fit">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Avis clients verifies
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Ils font confiance a <span className="emerald-gradient-text">Tektap</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Plus de 850 professionnels equipees dans tout le Maroc.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {reviews.map((r, i) => <ReviewCard key={i} r={r} i={i} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="py-28 bg-gradient-to-b from-slate-50 via-amber-50/40 to-white text-slate-900 relative overflow-hidden border-t border-amber-200/60">
        {/* bg orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="blob w-[500px] h-[500px] bg-emerald-200/40 top-[-20%] left-[-10%]" animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity }} />
          <motion.div className="blob w-[400px] h-[400px] bg-amber-200/50 bottom-[-20%] right-[-5%]" animate={{ scale: [1, 0.9, 1], x: [0, -15, 0] }} transition={{ duration: 14, repeat: Infinity, delay: 3 }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-8">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold"
            initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Offre de lancement - Livraison gratuite
          </motion.div>

          <motion.h2
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 30 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Pret a transformer<br />
            <span className="gold-gradient-text">votre image pro ?</span>
          </motion.h2>

          <motion.p
            className="text-slate-600 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }} animate={ctaInView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
          >
            Commandez ou envoyez une photo de votre ancienne carte. Nous creeons tout en 24h.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/commander" className="btn-gold btn-shimmer flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold">
                <ShoppingBag className="w-5 h-5" />
                Commander dès 130 DH
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <button onClick={() => openWhatsAppChat("Bonjour, je souhaite commander une carte NFC Tektap.")} className="btn-whatsapp btn-shimmer flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold">
                <MessageCircle className="w-5 h-5" />
                Commander via WhatsApp
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6 pt-2 text-sm text-gray-500"
            initial={{ opacity: 0 }} animate={ctaInView ? { opacity: 1 } : {}} transition={{ delay: 0.65 }}
          >
            {['Sans application','Paiement a la livraison','Livraison 24h/48h','Profil offert'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};