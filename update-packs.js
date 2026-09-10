const fs = require('fs');
const path = require('path');

// 1. BusinessSolutionsGrid.tsx
const businessSolutionsGrid = `import React from "react";
import { Link } from "react-router-dom";
import {
  Utensils,
  Building2,
  Scissors,
  Briefcase,
  Building,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from "lucide-react";

export const BusinessSolutionsGrid: React.FC = () => {
  const packs = [
    {
      id: "restaurant",
      name: "Pack Restaurant & Café",
      badge: "Indispensable Tables",
      badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
      icon: Utensils,
      iconBg: "bg-orange-100 text-orange-600",
      tagline: "Menu digital sans contact & réservations WhatsApp",
      price: 490,
      period: "carte + chevalet inclus",
      features: [
        "Menu digital complet avec photos & prix",
        "Bouton commande & réservation WhatsApp directe",
        "Lien vers avis Google Maps 5 étoiles",
        "Chevalet de table NFC / QR code offert",
        "Mises à jour des plats et prix en temps réel"
      ],
      link: "/commander?pack=restaurant-cafe",
      popular: false
    },
    {
      id: "immo",
      name: "Pack Immobilier & Promotion",
      badge: "Le Plus Vendu",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: Building2,
      iconBg: "bg-emerald-100 text-emerald-600",
      tagline: "Carte prestige pour agents & promoteurs d'élite",
      price: 690,
      period: "carte NFC Métal Gravée",
      features: [
        "Finition Métal Brossé Noir / Or Prestige",
        "Catalogue immersif de vos biens disponibles",
        "Enregistrement vCard 1-tap immédiat",
        "Bouton visite & contact WhatsApp prioritaire",
        "Statistiques de consultation en temps réel"
      ],
      link: "/commander?pack=agent-immobilier",
      popular: true
    },
    {
      id: "salon",
      name: "Pack Beauté, Spa & Salons",
      badge: "Tendance Salons",
      badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
      icon: Scissors,
      iconBg: "bg-pink-100 text-pink-600",
      tagline: "Carte de soins interactive & prise de rendez-vous",
      price: 450,
      period: "carte NFC Soft-Touch",
      features: [
        "Carte des soins détaillée avec tarifs",
        "Lien Instagram & Galerie de réalisations",
        "Bouton prise de rendez-vous express",
        "Chevalet de caisse NFC pour booster les avis",
        "Partage facile entre clientes"
      ],
      link: "/commander?pack=salon-beaute",
      popular: false
    },
    {
      id: "freelance",
      name: "Pack Freelance & Consultant",
      badge: "Idéal Créatifs",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Briefcase,
      iconBg: "bg-blue-100 text-blue-600",
      tagline: "Portfolio digital et demande de devis express",
      price: 390,
      period: "carte NFC PVC Premium",
      features: [
        "Portfolio de projets interactif",
        "Liens LinkedIn, GitHub, Behance & Site web",
        "Formulaire de demande de devis direct",
        "QR Code haute définition personnalisé",
        "Mises à jour du profil illimitées"
      ],
      link: "/commander?pack=freelance-consultant",
      popular: false
    },
    {
      id: "corporate",
      name: "Pack Flotte Entreprise & PME",
      badge: "Sur-Mesure Équipes",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      icon: Building,
      iconBg: "bg-purple-100 text-purple-600",
      tagline: "Pour équipes commerciales et collaborateurs",
      price: 1200,
      period: "à partir de 5 cartes",
      features: [
        "Chartes graphiques et logos d'entreprise personnalisés",
        "Espace de gestion centralisé de vos collaborateurs",
        "Mises à jour synchronisées des coordonnées",
        "Support prioritaire dédié au Maroc",
        "Facturation entreprise avec TVA récupérable"
      ],
      link: "/commander?pack=flotte-entreprise",
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-slate-50/70 border-t border-slate-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Solutions Métiers Complètes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Des packs conçus pour <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">votre secteur d'activité.</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Chaque pack inclut la carte physique sans contact, votre profil digital personnalisé et l'accompagnement de nos designers au Maroc.
          </p>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {packs.map((pack) => {
            const Icon = pack.icon;
            return (
              <div
                key={pack.id}
                className={\`bg-white rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between relative \${
                  pack.popular
                    ? "border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20 md:-translate-y-2"
                    : "border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md"
                }\`}
              >
                {pack.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-md">
                    Recommandé
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center \${pack.iconBg} shadow-sm\`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={\`text-xs font-bold px-3 py-1 rounded-full border \${pack.badgeColor}\`}>
                      {pack.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">{pack.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{pack.tagline}</p>

                  {/* Price */}
                  <div className="py-4 px-5 rounded-2xl bg-slate-50 border border-slate-100 mb-6 flex items-baseline justify-between">
                    <span className="text-xs font-medium text-slate-500">Tarif Pack complet</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-slate-900">{pack.price}</span>
                      <span className="text-sm font-bold text-emerald-600 ml-1">DH</span>
                      <p className="text-[11px] text-slate-400 font-medium">{pack.period}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {pack.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={pack.link}
                    className={\`w-full py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all \${
                      pack.popular
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }\`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Commander ce pack</span>
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
`;

fs.writeFileSync(path.join(__dirname, 'client', 'src', 'components', 'home', 'BusinessSolutionsGrid.tsx'), businessSolutionsGrid, 'utf8');
console.log('BusinessSolutionsGrid.tsx updated successfully');
