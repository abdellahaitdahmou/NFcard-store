import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Utensils,
  Building2,
  Scissors,
  Briefcase,
  Stethoscope,
  Scale,
  Car,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  Eye,
  ShieldCheck,
  Smartphone
} from "lucide-react";

export const Solutions: React.FC = () => {
  const sectors = [
    {
      id: "immo",
      name: "Immobilier & Promotion",
      badge: "Le Plus Vendu",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: Building2,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-200",
      tagline: "Pour agents, promoteurs et courtiers d'élite",
      desc: "Partagez votre catalogue de villas, riads et appartements en 1 tap lors de vos visites clients.",
      features: [
        "Fiche bien interactive & galerie photos HD",
        "Enregistrement vCard instantané sur iPhone & Android",
        "Lien WhatsApp direct pour fixer une contre-visite",
        "Carte NFC Métal Gravée prestige disponible"
      ],
      link: "/portfolio-exemple",
      orderLink: "/commander?pack=agent-immobilier"
    },
    {
      id: "resto",
      name: "Restaurants, Cafés & Riads",
      badge: "Indispensable Tables",
      badgeColor: "bg-orange-100 text-orange-900 border-orange-300",
      icon: Utensils,
      iconBg: "bg-orange-50 text-orange-600 border border-orange-200",
      tagline: "Menu digital interactif & avis Google 5★",
      desc: "Remplacez vos menus papier abîmés par un menu digital ultra-rapide avec photos, tarifs et commandes.",
      features: [
        "Menu digital complet modifiable en temps réel",
        "Bouton réservation de table WhatsApp direct",
        "Lien direct vers vos avis Google Maps 5 étoiles",
        "Chevalet de table NFC / QR code offert"
      ],
      link: "/portfolio-exemple",
      orderLink: "/commander?pack=restaurant-cafe"
    },
    {
      id: "salon",
      name: "Salons de Beauté, Spas & Coiffure",
      badge: "Tendance Salons",
      badgeColor: "bg-pink-100 text-pink-900 border-pink-300",
      icon: Scissors,
      iconBg: "bg-pink-50 text-pink-600 border border-pink-200",
      tagline: "Carte des soins & prise de rendez-vous",
      desc: "Présentez vos prestations de soins, coiffure et maquillage avec photos et lien direct de réservation.",
      features: [
        "Carte des soins claire avec tarifs en DH",
        "Lien Instagram & Galerie de vos réalisations",
        "Bouton prise de rendez-vous instantané",
        "Chevalet de caisse NFC pour fidélisation"
      ],
      link: "/portfolio-exemple",
      orderLink: "/commander?pack=salon-beaute"
    },
    {
      id: "freelance",
      name: "Freelances, Designers & Devs",
      badge: "Créatifs & Tech",
      badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
      icon: Briefcase,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-200",
      tagline: "Portfolio digital & demandes de devis",
      desc: "Centralisez vos réalisations, votre GitHub/Behance, vos compétences et recevez des demandes de devis.",
      features: [
        "Portfolio de projets avec captures d'écran",
        "Liens LinkedIn, GitHub, Behance & Site web",
        "Formulaire de demande de devis direct",
        "QR Code haute définition personnalisé"
      ],
      link: "/portfolio-exemple",
      orderLink: "/commander?pack=freelance-consultant"
    },
    {
      id: "medical",
      name: "Médecins, Dentistes & Cliniques",
      badge: "Santé & Médical",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      icon: Stethoscope,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200",
      tagline: "Coordonnées cabinet & prise de RDV",
      desc: "Offrez à vos patients une carte connectée pour retrouver l'adresse GPS de votre cabinet et vos horaires.",
      features: [
        "Localisation Google Maps précise du cabinet",
        "Horaires d'ouverture et urgences médicales",
        "Bouton appel direct et téléconsultation",
        "Enregistrement immédiat dans le répertoire"
      ],
      link: "/portfolio-exemple",
      orderLink: "/commander"
    },
    {
      id: "juridique",
      name: "Avocats, Notaires & Experts",
      badge: "Prestige & Droit",
      badgeColor: "bg-slate-100 text-slate-900 border-slate-300",
      icon: Scale,
      iconBg: "bg-slate-100 text-slate-700 border border-slate-200",
      tagline: "Image statutaire de haute autorité",
      desc: "Une présence digitale sobre et prestigieuse conforme aux déontologies professionnelles du Barreau.",
      features: [
        "Domaines d'expertise juridique détaillés",
        "Consultation en cabinet ou à distance",
        "Carte NFC Noir Onyx ou Métal Doré luxe",
        "Respect total de la confidentialité client"
      ],
      link: "/portfolio-exemple",
      orderLink: "/commander"
    },
    {
      id: "auto",
      name: "Concessionnaires & Garages Auto",
      badge: "Automobile",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      icon: Car,
      iconBg: "bg-amber-50 text-amber-700 border border-amber-200",
      tagline: "Fiches véhicules & devis réparation",
      desc: "Facilitez le contact lors des salons auto, ventes de véhicules neufs/occasions ou devis atelier mécanique.",
      features: [
        "Lien vers votre stock de véhicules disponibles",
        "Demande de devis vidange & entretien",
        "Contact direct conseiller commercial",
        "Assistance dépannage rapide sur WhatsApp"
      ],
      link: "/portfolio-exemple",
      orderLink: "/commander"
    },
    {
      id: "commerce",
      name: "Commerces & Boutiques de Détail",
      badge: "Retail & Shopping",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      icon: ShoppingBag,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-200",
      tagline: "Booster Instagram & fidélité en caisse",
      desc: "Placez votre carte ou chevalet sur votre comptoir pour que vos clients suivent vos réseaux sociaux en caisse.",
      features: [
        "Accès 1 tap à votre catalogue Instagram & TikTok",
        "Augmentation rapide de vos abonnés locaux",
        "Collecte facile d'avis clients Google 5★",
        "Promotions & offres spéciales du moment"
      ],
      link: "/portfolio-exemple",
      orderLink: "/commander"
    }
  ];

  return (
    <div className="bg-slate-50/60 min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Solutions Métiers Spécifiques au Maroc</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Des solutions connectées conçues pour <br />
            <span className="gold-gradient-text">votre secteur d'activité.</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Chaque profession a ses spécificités. NFcard adapte votre carte NFC et votre profil digital avec les widgets et fonctionnalités essentiels à votre activité.
          </p>
        </div>

        {/* Sectors 8 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {sectors.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sec.iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sec.badgeColor}`}>
                      {sec.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{sec.name}</h3>
                  <p className="text-xs text-brand-600 font-semibold mb-3">{sec.tagline}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">{sec.desc}</p>

                  <div className="space-y-2 mb-6 pt-2 border-t border-slate-100">
                    {sec.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <Link
                    to={sec.link}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-500" />
                    <span>Voir l'exemple en direct</span>
                  </Link>

                  <Link
                    to={sec.orderLink}
                    className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <span>Commander ce pack</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Value Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-orange-200 shadow-lg shadow-orange-500/5 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-brand-500" />
              <span>Garantie Sans Application</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Compatible 100% des smartphones au Maroc
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Vos interlocuteurs n'ont besoin d'installer aucune application. Un simple tap sans contact NFC ou un scan du QR code personnalisé ouvre instantanément votre profil dans leur navigateur.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              to="/portfolio-exemple"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all text-center"
            >
              <Eye className="w-4 h-4" />
              <span>Tester le simulateur 8 secteurs</span>
            </Link>
            <Link
              to="/commander"
              className="w-full py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all text-center"
            >
              <span>Passer commande dès 130 DH</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
