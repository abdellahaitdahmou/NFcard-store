import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { DigitalProfileView, ProfileData } from "../components/profile/DigitalProfileView";
import {
  ShoppingBag, MessageCircle, Eye, Zap, CheckCircle,
  Utensils, Building2, Scissors, Briefcase,
  HeartPulse, Scale, ShoppingCart, Car, ChevronLeft, ChevronRight
} from "lucide-react";

const categories: {
  id: string; label: string; emoji: string;
  icon: React.ReactNode; activeBg: string; profile: ProfileData;
}[] = [
  {
    id: "immo", label: "Immobilier", emoji: "🏛️",
    icon: <Building2 className="w-4 h-4" />,
    activeBg: "bg-amber-50 border-amber-400 text-amber-800",
    profile: {
      name: "Youssef Amrani", title: "Consultant Immobilier de Prestige",
      company: "Atlas Prestige Immobilier",
      bio: "Specialiste de la vente de villas, riads et appartements de luxe a Marrakech et Casablanca. 15 ans d experience.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&auto=format&fit=crop&q=80",
      coverColor: "from-amber-700 to-amber-900",
      phone: "+212 6 61 23 45 67", whatsapp: "+212661234567",
      email: "youssef@atlasprestige.ma", website: "https://atlasprestige.ma",
      instagram: "https://instagram.com/atlasprestige",
      facebook: "https://facebook.com/atlasprestige",
      linkedin: "https://linkedin.com/in/youssefamrani",
      location: "Marrakech & Casablanca",
      hours: "Lun - Sam : 09h - 19h  |  Visites sur RDV",
      services: [
        { name: "Vente Villa & Riad", desc: "Biens premium et de prestige.", price: "Commission 2.5%" },
        { name: "Location Longue Duree", desc: "Appartements et villas.", price: "1 mois de loyer" },
        { name: "Expertise & Evaluation", desc: "Estimation de votre bien.", price: "500 DH" },
        { name: "Gestion Locative", desc: "Gestion complete de votre patrimoine.", price: "5%/mois" },
      ],
      portfolio: [
        { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80", title: "Villa Palmeraie" },
        { image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80", title: "Riad Medina" },
        { image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80", title: "Appart Gueliz" },
        { image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80", title: "Villa Californie" },
        { image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80", title: "Penthouse CFC" },
        { image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80", title: "Duplex Maarif" },
      ],
    },
  },
  {
    id: "resto", label: "Restaurant", emoji: "🍽️",
    icon: <Utensils className="w-4 h-4" />,
    activeBg: "bg-orange-50 border-orange-400 text-orange-800",
    profile: {
      name: "Chef Karim Tazi", title: "Chef Cuisinier & Proprietaire",
      company: "Le Jardin Secret Marrakech",
      bio: "Cuisine marocaine raffinee et saveurs mediterraneennes au coeur d un riad historique. Terrasse et jardin prives.",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop&q=80",
      coverColor: "from-orange-700 to-red-900",
      phone: "+212 5 24 43 12 34", whatsapp: "+212662889900",
      email: "reservation@lejardinsecret.ma", website: "https://lejardinsecret.ma",
      instagram: "https://instagram.com/lejardinsecret",
      facebook: "https://facebook.com/lejardinsecret",
      location: "Gueliz, Marrakech",
      hours: "Tous les jours 12h-15h & 19h-23h  |  Ferme Mardi",
      services: [
        { name: "Menu Dejeuner 3 plats", desc: "Entree, plat, dessert.", price: "180 DH" },
        { name: "Menu Diner Decouverte", desc: "5 plats signature du chef.", price: "320 DH" },
        { name: "Soiree Privee 20+ pers", desc: "Buffet, musique, decoration.", price: "Sur devis" },
        { name: "Menu Ramadan Iftar", desc: "Harira, dattes, pastilla.", price: "120 DH/pers" },
      ],
      portfolio: [
        { image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80", title: "Salle principale" },
        { image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", title: "Pastilla" },
        { image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80", title: "Terrasse" },
        { image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=400&q=80", title: "Tajine" },
        { image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80", title: "Desserts" },
        { image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80", title: "Soiree" },
      ],
    },
  },
  {
    id: "salon", label: "Beaute", emoji: "✂️",
    icon: <Scissors className="w-4 h-4" />,
    activeBg: "bg-pink-50 border-pink-400 text-pink-800",
    profile: {
      name: "Sara Kabbaj", title: "Directrice Artistique & Coiffeuse",
      company: "Maison Kabbaj Beaute",
      bio: "Salon de haute coiffure, soins capillaires et maquillage evenementiel. Specialiste balayage, keratine et coiffure mariee.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80",
      coverColor: "from-pink-500 to-rose-700",
      phone: "+212 5 22 36 78 90", whatsapp: "+212663112233",
      email: "contact@maisonkabbaj.ma", website: "https://maisonkabbaj.ma",
      instagram: "https://instagram.com/maisonkabbaj",
      facebook: "https://facebook.com/maisonkabbaj",
      tiktok: "https://tiktok.com/@maisonkabbaj",
      location: "Triangle d'Or, Casablanca",
      hours: "Mar - Sam : 09h - 20h  |  Dim : 10h - 17h",
      services: [
        { name: "Coupe & Brushing", desc: "Coupe personnalisee.", price: "150 DH" },
        { name: "Balayage Californien", desc: "Eclaircissement naturel.", price: "450 DH" },
        { name: "Keratine Bresilienne", desc: "Lissage 4-6 mois.", price: "600 DH" },
        { name: "Maquillage Mariee", desc: "Essai + jour J.", price: "800 DH" },
        { name: "Soin Botox Capillaire", desc: "Nutrition intense.", price: "350 DH" },
      ],
      portfolio: [
        { image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80", title: "Balayage Blond" },
        { image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&q=80", title: "Coiffure Mariee" },
        { image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80", title: "Soin Visage" },
        { image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80", title: "Maquillage Gala" },
        { image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&q=80", title: "Ambiance Salon" },
        { image: "https://images.unsplash.com/photo-1500840216050-6ffa99d75160?w=400&q=80", title: "Manucure" },
      ],
    },
  },
  {
    id: "freelance", label: "Freelance & Tech", emoji: "💻",
    icon: <Briefcase className="w-4 h-4" />,
    activeBg: "bg-blue-50 border-blue-400 text-blue-800",
    profile: {
      name: "Mehdi Bensouda", title: "Developpeur Full-Stack & Designer UI/UX",
      company: "Studio Mehdi Digital",
      bio: "Developpeur web et mobile independant base a Rabat. React, Node.js et design d interface utilisateur premium.",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80",
      coverColor: "from-blue-700 to-indigo-900",
      phone: "+212 6 64 55 66 77", whatsapp: "+212664556677",
      email: "mehdi@studiobensouda.ma", website: "https://studiobensouda.ma",
      instagram: "https://instagram.com/studiobensouda",
      linkedin: "https://linkedin.com/in/mehdibensouda",
      facebook: "https://facebook.com/studiobensouda",
      location: "Rabat, Maroc",
      hours: "Lun - Ven : 09h - 18h",
      services: [
        { name: "Site Web Vitrine", desc: "Design + dev sur mesure.", price: "Des 2 500 DH" },
        { name: "Application Mobile", desc: "iOS & Android React Native.", price: "Sur devis" },
        { name: "E-commerce Complet", desc: "Boutique, paiement, livraison.", price: "Des 5 000 DH" },
        { name: "Design UI/UX Figma", desc: "Maquettes + prototype.", price: "800 DH/jour" },
      ],
      portfolio: [
        { image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=80", title: "E-commerce" },
        { image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&q=80", title: "App Mobile" },
        { image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&q=80", title: "Dashboard" },
        { image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80", title: "Analytics" },
        { image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=400&q=80", title: "Design System" },
        { image: "https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=400&q=80", title: "Landing Page" },
      ],
    },
  },
  {
    id: "medical", label: "Medical", emoji: "🏥",
    icon: <HeartPulse className="w-4 h-4" />,
    activeBg: "bg-red-50 border-red-400 text-red-800",
    profile: {
      name: "Dr. Fatima Ouali", title: "Medecin Generaliste & Nutritionniste",
      company: "Cabinet Medical Ouali",
      bio: "Medecin generaliste avec specialisation en nutrition et medecine preventive. Remboursement CNSS/AMO. Telemedicine disponible.",
      avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=200&auto=format&fit=crop&q=80",
      coverColor: "from-red-600 to-rose-800",
      phone: "+212 5 37 12 34 56", whatsapp: "+212665778899",
      email: "drouali@cabinetouali.ma", website: "https://cabinetouali.ma",
      instagram: "https://instagram.com/drfatimaouali",
      facebook: "https://facebook.com/cabinetouali",
      location: "Agdal, Rabat",
      hours: "Lun - Ven : 08h - 18h  |  Sam : 08h - 13h",
      services: [
        { name: "Consultation Generaliste", desc: "Examen, ordonnance, bilan.", price: "200 DH" },
        { name: "Bilan Nutritionnel", desc: "Analyse et plan alimentaire.", price: "350 DH" },
        { name: "Telemedicine Video", desc: "Consultation a distance.", price: "150 DH" },
        { name: "Certificat Medical", desc: "Sport, travail, scolaire.", price: "100 DH" },
      ],
      portfolio: [
        { image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80", title: "Salle attente" },
        { image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&q=80", title: "Equipements" },
        { image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80", title: "Consultation" },
        { image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80", title: "Cabinet" },
        { image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80", title: "Bilan" },
        { image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80", title: "Nutrition" },
      ],
    },
  },
  {
    id: "juridique", label: "Juridique", emoji: "⚖️",
    icon: <Scale className="w-4 h-4" />,
    activeBg: "bg-slate-100 border-slate-500 text-slate-800",
    profile: {
      name: "Me. Hamid Lahlou", title: "Avocat au Barreau de Casablanca",
      company: "Cabinet Lahlou et Associes",
      bio: "Avocat specialise en droit des affaires, droit immobilier et droit de la famille. Consultations en arabe, francais et anglais.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&auto=format&fit=crop&q=80",
      coverColor: "from-slate-700 to-slate-900",
      phone: "+212 5 22 48 90 12", whatsapp: "+212666001122",
      email: "contact@lahlou-avocats.ma", website: "https://lahlou-avocats.ma",
      linkedin: "https://linkedin.com/in/hamidlahlou",
      facebook: "https://facebook.com/lahlou.avocats",
      location: "Quartier des Affaires, Casablanca",
      hours: "Lun - Ven : 09h - 18h  |  RDV obligatoire",
      services: [
        { name: "Consultation Juridique 1h", desc: "Analyse et conseil.", price: "500 DH" },
        { name: "Contrat Commercial", desc: "Redaction et validation.", price: "Des 1 500 DH" },
        { name: "Creation d Entreprise", desc: "SARL, SA, auto-entrepreneur.", price: "Des 2 000 DH" },
        { name: "Droit de la Famille", desc: "Divorce, succession, garde.", price: "Sur devis" },
      ],
      portfolio: [
        { image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80", title: "Cabinet" },
        { image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80", title: "Bibliotheque" },
        { image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&q=80", title: "Reunion" },
        { image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80", title: "Equipe" },
        { image: "https://images.unsplash.com/photo-1562564055-71e051d33c19?w=400&q=80", title: "Documents" },
        { image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80", title: "Bureau" },
      ],
    },
  },
  {
    id: "commerce", label: "Commerce", emoji: "🛍️",
    icon: <ShoppingCart className="w-4 h-4" />,
    activeBg: "bg-purple-50 border-purple-400 text-purple-800",
    profile: {
      name: "Nadia Chraibi", title: "Fondatrice & Responsable Boutique",
      company: "Nadia Artisanat Maroc",
      bio: "Boutique d artisanat authentique marocain. Zellige, babouches, djellabas faits main. Livraison nationale et internationale.",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=80",
      coverColor: "from-purple-600 to-indigo-800",
      phone: "+212 6 67 89 00 11", whatsapp: "+212667890011",
      email: "contact@nadiaartisanat.ma", website: "https://nadiaartisanat.ma",
      instagram: "https://instagram.com/nadiaartisanat",
      facebook: "https://facebook.com/nadiaartisanat",
      tiktok: "https://tiktok.com/@nadiaartisanat",
      location: "Medina de Fes, Maroc",
      hours: "Tous les jours : 09h - 20h",
      services: [
        { name: "Babouches Cuir Main", desc: "Toutes pointures.", price: "Des 180 DH" },
        { name: "Djellaba Femme", desc: "Soie, coton, broderie.", price: "Des 450 DH" },
        { name: "Zellige Artisanal", desc: "Carreaux decoratifs.", price: "150 DH/m2" },
        { name: "Coffret Cadeau", desc: "Argane, savon beldi, henne.", price: "Des 250 DH" },
      ],
      portfolio: [
        { image: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=400&q=80", title: "Babouches" },
        { image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&q=80", title: "Tissus" },
        { image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80", title: "Zellige" },
        { image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80", title: "Boutique" },
        { image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80", title: "Coffrets" },
        { image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80", title: "Artisanat" },
      ],
    },
  },
  {
    id: "auto", label: "Auto", emoji: "🚗",
    icon: <Car className="w-4 h-4" />,
    activeBg: "bg-gray-100 border-gray-500 text-gray-800",
    profile: {
      name: "Rachid Moussaoui", title: "Expert Automobile & Chef Mecanicien",
      company: "Garage Moussaoui Pro",
      bio: "Garage multi-marques avec outillage diagnostic dernier cri. Reparation, entretien, carrosserie et pieces detachees. Devis gratuit en 30 min.",
      avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&auto=format&fit=crop&q=80",
      logo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&auto=format&fit=crop&q=80",
      coverColor: "from-gray-700 to-gray-900",
      phone: "+212 6 68 44 55 66", whatsapp: "+212668445566",
      email: "contact@garagemoussaoui.ma", website: "https://garagemoussaoui.ma",
      instagram: "https://instagram.com/garagemoussaoui",
      facebook: "https://facebook.com/garagemoussaoui",
      location: "Ain Sebaa, Casablanca",
      hours: "Lun - Sam : 08h - 19h  |  Urgences WhatsApp 7j/7",
      services: [
        { name: "Vidange + Filtres", desc: "Huile + filtre air/huile.", price: "280 DH" },
        { name: "Diagnostic Electronique", desc: "Codes defauts toutes marques.", price: "150 DH" },
        { name: "Freinage Complet", desc: "Plaquettes, disques, liquide.", price: "Des 400 DH" },
        { name: "Climatisation Recharge", desc: "Gaz + nettoyage circuit.", price: "350 DH" },
        { name: "Carrosserie & Peinture", desc: "Retouche, debosselage.", price: "Sur devis" },
      ],
      portfolio: [
        { image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80", title: "Diagnostic" },
        { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", title: "Mecanique" },
        { image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80", title: "Peinture" },
        { image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80", title: "Atelier" },
        { image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80", title: "Pieces" },
        { image: "https://images.unsplash.com/photo-1471479917193-f00955256257?w=400&q=80", title: "Carrosserie" },
      ],
    },
  },
];

const features = [
  "Photo de profil + logo de la societe",
  "WhatsApp direct avec message pre-rempli",
  "Telephone fixe cliquable",
  "Instagram, Facebook, LinkedIn, TikTok",
  "Site web avec lien externe",
  "Services avec prix en DH",
  "Galerie portfolio photos",
  "Enregistrement contact vCard 1-tap",
  "Bouton de partage du profil",
  "Localisation et horaires",
  "Mises a jour illimitees a vie",
];

export const PortfolioExemple: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (idx: number) => { setDirection(idx > activeIdx ? 1 : -1); setActiveIdx(idx); };
  const prev = () => goTo((activeIdx - 1 + categories.length) % categories.length);
  const next = () => goTo((activeIdx + 1) % categories.length);
  const active = categories[activeIdx];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 70 : -70, opacity: 0, scale: 0.96 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit:  (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.96, transition: { duration: 0.28 } }),
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-amber-50/80 via-white to-slate-50 text-slate-900 py-20 relative overflow-hidden border-b border-amber-200/50">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Eye className="w-3.5 h-3.5 text-brand-500" /> Aperçu Interactif - Choisissez votre secteur
          </motion.div>
          <motion.h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            Votre profil digital, tel que<br /><span className="gold-gradient-text">vos clients le verront.</span>
          </motion.h1>
          <motion.p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Sélectionnez votre secteur pour voir exactement à quoi ressemblera votre profil NFC personnalisé après un tap.
          </motion.p>
        </div>
      </section>

      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-snap-x">
          {categories.map((cat, i) => (
            <motion.button key={cat.id} onClick={() => goTo(i)}
              className={"flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 " + (activeIdx === i ? cat.activeBg + " shadow-sm" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300")}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            >
              <span className="text-sm">{cat.emoji}</span>{cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <div className="sticky top-36 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div key={active.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                    <div className={"inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold mb-3 " + active.activeBg}>
                      {active.icon} {active.emoji} Pack {active.label}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                      Profil digital pour<br /><span className="gold-gradient-text">{active.label}</span>
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Voici ce que vos clients verront après avoir tapé votre carte NFC. Tout est personnalisé avec vos vraies informations, logo, services et photos.
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-3">
                  <motion.button onClick={prev} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:border-orange-400 hover:text-orange-600 bg-white transition-all" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <ChevronLeft className="w-4 h-4" />Précédent
                  </motion.button>
                  <span className="text-xs text-gray-400 font-medium flex-1 text-center">{activeIdx + 1} / {categories.length}</span>
                  <motion.button onClick={next} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:border-orange-400 hover:text-orange-600 bg-white transition-all" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    Suivant<ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="card p-5 space-y-3">
                  <h3 className="font-bold text-gray-900 text-sm">Ce qui est inclus :</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" />{f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to="/commander" className="btn-primary w-full justify-center rounded-2xl py-4 text-sm btn-shimmer flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />Commander ce pack
                  </Link>
                  <a href="https://wa.me/212600000000?text=Bonjour je veux commander un profil NFC." target="_blank" rel="noreferrer" className="btn-whatsapp w-full justify-center rounded-2xl py-4 text-sm btn-shimmer flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />Commander via WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="max-w-sm mx-auto">
                <div className="flex justify-center gap-1.5 mb-4">
                  {categories.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)} className={"transition-all duration-300 rounded-full " + (i === activeIdx ? "w-6 h-2 bg-orange-500" : "w-2 h-2 bg-gray-300 hover:bg-gray-400")} />
                  ))}
                </div>
                <div className="bg-slate-100 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-300 ring-1 ring-slate-200 shadow-orange-500/10">
                  <div className="mx-auto w-28 h-6 bg-slate-300 rounded-full mb-2 flex items-center justify-end pr-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500/80 animate-pulse" />
                  </div>
                  <div className="bg-white rounded-[38px] overflow-hidden" style={{ height: "70vh", overflowY: "auto" }}>
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div key={active.id} custom={direction} variants={variants} initial="enter" animate="center" exit="exit">
                        <DigitalProfileView profile={active.profile} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400 mt-3">Scrollez dans le téléphone pour voir le profil complet</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Vous avez trouve votre modele ?</h2>
          <p className="text-gray-500 text-lg">Commandez votre carte NFC et recevez votre profil digital personnalise en 24h.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/commander" className="btn-primary rounded-2xl px-8 py-4 text-base font-bold btn-shimmer flex items-center gap-2 justify-center">
              <Zap className="w-5 h-5" />Creer mon profil maintenant
            </Link>
            <Link to="/packs" className="btn-outline rounded-2xl px-8 py-4 text-base font-bold flex items-center gap-2 justify-center">
              Voir les tarifs des packs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
