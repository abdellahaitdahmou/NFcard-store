import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QuickOrderModal } from "../common/QuickOrderModal";
import {
  Utensils,
  Scissors,
  Briefcase,
  Shield,
  Sparkles,
  CheckCircle2,
  ShoppingBag,
  Flame,
  ArrowRight,
  MessageCircle
} from "lucide-react";

export const BusinessSolutionsGrid: React.FC = () => {
  const [selectedPack, setSelectedPack] = useState<any | null>(null);

  const packs = [
    {
      id: "pack-restaurant-booster",
      name: "Pack Restaurant & Café Booster",
      badge: "Pack N°1 Restauration",
      badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
      icon: Utensils,
      iconBg: "bg-orange-100 text-orange-600",
      tagline: "Avis Google + Menu Digital + 5 Chevalets Numérotés",
      price: 690,
      comparePrice: 930,
      period: "Matériel complet + configuration",
      features: [
        "1x Chevalet Acrylique Luxe Avis Google 5★ (Caisse)",
        "5x Chevalets de Table Numérotés NFC & QR (Table 01-05)",
        "1x Carte NFC Noir Mat Luxe pour le Gérant",
        "Menu Digital Interactif avec photos & tarifs",
        "Bouton réservation WhatsApp direct",
        "Zéro abonnement mensuel (Actif à vie)"
      ],
      link: "/commander?pack=pack-restaurant-booster",
      popular: true
    },
    {
      id: "pack-commerce-beaute",
      name: "Pack Commerce, Beauté & Salons",
      badge: "Idéal Salons & Boutiques",
      badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
      icon: Scissors,
      iconBg: "bg-pink-100 text-pink-600",
      tagline: "Boostez vos avis Google et abonnés Instagram en caisse",
      price: 490,
      comparePrice: 670,
      period: "Chevalet + Plaque + Carte",
      features: [
        "1x Chevalet Acrylique Avis Google 5★ de caisse",
        "1x Plaque Ronde Réseaux Sociaux (Instagram/TikTok)",
        "1x Carte NFC Pure Personnalisée",
        "Profil Digital avec catalogue des soins & tarifs",
        "Bouton prise de RDV direct WhatsApp",
        "Configuration offerte par nos designers"
      ],
      link: "/commander?pack=pack-commerce-beaute",
      popular: true
    },
    {
      id: "pack-syndic-rfid",
      name: "Pack Syndic, Résidence & Sécurité RFID",
      badge: "Autonomie Totale",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Shield,
      iconBg: "bg-blue-100 text-blue-600",
      tagline: "Dupliquez les badges d'immeuble et parking en 1 seconde",
      price: 590,
      comparePrice: 810,
      period: "Appareil copieur + 21 badges",
      features: [
        "1x Copieur / Duplicateur RFID 125Khz Portatif Vocal",
        "15x Badges Porte-clés RFID 125Khz Universels",
        "6x Porte-clés Réinscriptibles réutilisables",
        "Clonage 1-seconde sans ordinateur",
        "Compatible interphones et parkings au Maroc",
        "Piles + notice d'utilisation en français"
      ],
      link: "/commander?pack=pack-syndic-rfid",
      popular: false
    },
    {
      id: "pack-pro-elite",
      name: "Pack Dirigeant & Professionnel Élite",
      badge: "Prestige",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      icon: Briefcase,
      iconBg: "bg-amber-100 text-amber-700",
      tagline: "Carte prestige + Plaque bureau + Stickers NTAG215",
      price: 390,
      comparePrice: 540,
      period: "Carte Noir Mat + Plaque + Stickers",
      features: [
        "1x Carte NFC Noir Mat Satiné Prestige NTAG215",
        "1x Plaque Ronde Contact / Instagram pour bureau",
        "3x Stickers NFC NTAG215 pour ordinateur / voiture",
        "Mini-Site Portfolio Pro avec QR Code dynamique",
        "Téléchargement de contact vCard 1-tap",
        "Statistiques de visites en temps réel"
      ],
      link: "/commander?pack=pack-pro-elite",
      popular: false
    },
    {
      id: "pack-evenement-vip",
      name: "Pack Événements & Accès VIP",
      badge: "Événementiel & Club",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      icon: Sparkles,
      iconBg: "bg-purple-100 text-purple-600",
      tagline: "Bracelets et stickers connectés pour soirées et festivals",
      price: 350,
      comparePrice: 480,
      period: "4 Bracelets + 5 Stickers",
      features: [
        "4x Bracelets NFC Tissés avec puce étanche",
        "5x Stickers NFC NTAG215 pour affiches & badges",
        "Redirection instantanée vers programme ou billetterie",
        "Bague de serrage sécurisée",
        "Livraison express 24h au Maroc"
      ],
      link: "/commander?pack=pack-evenement-vip",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-slate-50/70 border-t border-slate-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Stratégie Marketing & Packs Clé-en-Main</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Packs Complets & Bundles <br />
            <span className="gold-gradient-text">Prêts pour votre Activité.</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Économisez jusqu'à 30% en choisissant un pack associant matériel physique (chevalets, plaques, copieurs, cartes) et profil digital.
          </p>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {packs.map((pack) => {
            const Icon = pack.icon;
            return (
              <div
                key={pack.id}
                className={`bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 border transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1 ${
                  pack.popular
                    ? "border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/20"
                    : "border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Recommandé</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pack.iconBg} shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${pack.badgeColor}`}>
                      {pack.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1.5">{pack.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">{pack.tagline}</p>

                  {/* Price */}
                  <div className="py-3.5 px-4 sm:py-4 sm:px-5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 mb-5 flex items-baseline justify-between">
                    <span className="text-xs font-medium text-slate-500">Tarif Pack Promo</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-slate-900">{pack.price}</span>
                      <span className="text-sm font-bold text-amber-600 ml-1">DH</span>
                      {pack.comparePrice && (
                        <span className="text-xs text-slate-400 line-through ml-2">
                          {pack.comparePrice} DH
                        </span>
                      )}
                      <p className="text-[11px] text-slate-400 font-medium">{pack.period}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6">
                    {pack.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      pack.popular
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Commander ce pack ({pack.price} DH)</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Quick Order Modal for Packs */}
        <QuickOrderModal
          isOpen={!!selectedPack}
          onClose={() => setSelectedPack(null)}
          item={selectedPack}
          itemType="package"
        />

      </div>
    </section>
  );
};
