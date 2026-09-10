import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Palette,
  Eye,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Zap,
  ArrowRight
} from "lucide-react";

export const TemplatesGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Tous les Modèles" },
    { id: "immo", label: "Immobilier & Luxe" },
    { id: "resto", label: "Restauration & Cafés" },
    { id: "beaute", label: "Beauté & Salons" },
    { id: "tech", label: "Freelance & Tech" },
    { id: "sante", label: "Médical & Santé" }
  ];

  const templates = [
    {
      id: "tpl-lux-gold",
      name: "Luxury Gold Prestige",
      category: "immo",
      categoryLabel: "Immobilier & Luxe",
      theme: "luxury_gold",
      tagline: "Finitions or brossé, typographie statutaire & portfolio de biens",
      desc: "Idéal pour consultants immobiliers de luxe, architectes, directeurs généraux et promoteurs.",
      previewImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
      colors: ["#D4AF37", "#FFFFFF", "#F8FAFC"],
      popular: true
    },
    {
      id: "tpl-resto-warm",
      name: "Riad & Gastronomie Marocaine",
      category: "resto",
      categoryLabel: "Restauration & Cafés",
      theme: "warm_restaurant",
      tagline: "Mise en avant des photos de plats, menu digital & avis Google 5★",
      desc: "Conçu pour restaurants gastronomiques, riads, cafés branchés et traiteurs au Maroc.",
      previewImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
      colors: ["#EA580C", "#FFFFFF", "#FFF7ED"],
      popular: false
    },
    {
      id: "tpl-beauty-purple",
      name: "Maison Beauté & Glamour",
      category: "beaute",
      categoryLabel: "Beauté & Salons",
      theme: "purple_beauty",
      tagline: "Harmonie rose & or, carte des soins avec tarifs & prise de RDV",
      desc: "Spécialement créé pour salons de coiffure de prestige, spas, centres d'esthétique et maquilleuses.",
      previewImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
      colors: ["#DB2777", "#FFFFFF", "#FDF2F8"],
      popular: false
    },
    {
      id: "tpl-tech-dark",
      name: "Studio Digital & Tech",
      category: "tech",
      categoryLabel: "Freelance & Tech",
      theme: "modern_dark",
      tagline: "Style épuré haute performance, projets interactifs & GitHub",
      desc: "Pour développeurs web/mobile, designers UI/UX, consultants digitaux et agences de communication.",
      previewImg: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&auto=format&fit=crop&q=80",
      colors: ["#2563EB", "#FFFFFF", "#EFF6FF"],
      popular: false
    },
    {
      id: "tpl-corp-emerald",
      name: "Corporate Émeraude Maroc",
      category: "immo",
      categoryLabel: "Entreprises & PME",
      theme: "emerald_corporate",
      tagline: "Vert émeraude royal, élégance sobre et coordonnées complètes",
      desc: "Pour entreprises commerciales, cabinets de conseil, experts-comptables et collaborateurs nomades.",
      previewImg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
      colors: ["#059669", "#FFFFFF", "#ECFDF5"],
      popular: false
    },
    {
      id: "tpl-med-clean",
      name: "Cabinet Médical & Santé Pro",
      category: "sante",
      categoryLabel: "Médical & Santé",
      theme: "medical_clean",
      tagline: "Design médical rassurant, horaires précis & localisation GPS",
      desc: "Pour médecins spécialistes, dentistes, cliniques privées, kinésithérapeutes et laboratoires d'analyse.",
      previewImg: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80",
      colors: ["#E11D48", "#FFFFFF", "#FFF1F2"],
      popular: false
    }
  ];

  const filtered = selectedCategory === "all"
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="bg-slate-50/60 min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-sm">
            <Palette className="w-3.5 h-3.5 text-brand-500" />
            <span>Galerie de Thèmes & Modèles Professionnels</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Des designs haut de gamme <br />
            <span className="gold-gradient-text">adaptés à votre univers.</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Tous nos modèles sont entièrement personnalisables avec votre logo, vos couleurs d'entreprise, vos photos et vos liens sociaux.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((tpl, idx) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className={`bg-white rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                tpl.popular
                  ? "border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/20"
                  : "border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Image Preview Banner */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={tpl.previewImg}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-sm">
                  {tpl.categoryLabel}
                </span>

                {tpl.popular && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    Populaire
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <h4 className="font-bold text-base">{tpl.name}</h4>
                  <div className="flex items-center gap-1">
                    {tpl.colors.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-amber-700 font-semibold">{tpl.tagline}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{tpl.desc}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <Link
                    to="/portfolio-exemple"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tester ce modèle en direct</span>
                  </Link>

                  <Link
                    to={`/commander?template=${tpl.theme}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Commander avec ce modèle</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Design Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Service Graphique Sur-Mesure Inclus</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Vous avez votre propre charte graphique ?
          </h3>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Nos graphistes adaptent votre profil NFC sur-mesure selon vos codes couleurs, votre typographie et vos logos de marque sans frais additionnels.
          </p>
          <div className="pt-2">
            <Link
              to="/commander"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
            >
              <span>Créer mon profil personnalisé</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
