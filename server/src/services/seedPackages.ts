import { BusinessPackage } from "../models/types";

export const initialPackages: BusinessPackage[] = [
  {
    id: "pack-restaurant-booster",
    name: "Pack Restaurant & Café Booster",
    slug: "pack-restaurant-booster",
    businessType: "restaurant",
    tagline: "L'équipement complet : Avis Google + Menu Digital + 5 Chevalets de Table",
    description: "La solution clé-en-main ultime pour booster votre restaurant, café ou lounge : récoltez des centaines d'avis 5 étoiles et modernisez votre service en terrasse.",
    price: 690,
    comparePrice: 930,
    features: [
      "1x Chevalet Acrylique Luxe Avis Google 5★ (Comptoir / Caisse)",
      "5x Chevalets de Table Numérotés NFC & QR Code (Table 01 à 05)",
      "1x Carte NFC Noir Mat Luxe pour le Gérant / Responsable",
      "Menu Digital Interactif avec photos, prix et mise à jour instantanée",
      "Bouton réservation de table et commande directe WhatsApp",
      "Configuration complète et expédition gratuite partout au Maroc"
    ],
    badge: "Pack N°1 Restauration",
    isPopular: true,
    icon: "Utensils",
    idealFor: "Restaurants, Cafés & Terasses"
  },
  {
    id: "pack-commerce-beaute",
    name: "Pack Commerce, Beauté & Salons",
    slug: "pack-commerce-beaute",
    businessType: "salon_barber",
    tagline: "Multipliez vos avis Google et vos abonnés Instagram en caisse",
    description: "Idéal pour les instituts de beauté, salons de coiffure, spas, boutiques et showrooms. Transformez chaque cliente en ambassadrice digitale.",
    price: 490,
    comparePrice: 670,
    features: [
      "1x Chevalet Acrylique Luxe Avis Google 5★ de caisse",
      "1x Plaque Ronde Réseaux Sociaux (Instagram / TikTok) pour miroir ou vitrine",
      "1x Carte NFC Blanche Pure ou Noir Mat Personnalisée",
      "Profil Digital avec catalogue des soins & prise de RDV WhatsApp",
      "Accompagnement design et intégration de votre charte"
    ],
    badge: "Idéal Salons & Boutiques",
    isPopular: true,
    icon: "Scissors",
    idealFor: "Instituts de beauté, Spas & Salons"
  },
  {
    id: "pack-syndic-rfid",
    name: "Pack Syndic, Résidence & Sécurité RFID",
    slug: "pack-syndic-rfid",
    businessType: "company",
    tagline: "Kit complet de duplication de badges pour immeubles, parkings et bureaux",
    description: "Équipez votre copropriété, résidence ou entreprise d'un système autonome pour dupliquer et gérer les accès résidents et visiteurs sans dépendre d'un prestataire externe.",
    price: 590,
    comparePrice: 810,
    features: [
      "1x Copieur / Duplicateur RFID 125Khz Portatif avec synthèse vocale",
      "15x Badges Porte-clés RFID 125Khz Universels bleus",
      "6x Porte-clés Réinscriptibles réutilisables",
      "Clonage 1-seconde sans ordinateur",
      "Notice complète en français + piles incluses"
    ],
    badge: "Syndics & Entreprises",
    isPopular: false,
    icon: "Shield",
    idealFor: "Syndics, Résidences & Bureaux"
  },
  {
    id: "pack-pro-elite",
    name: "Pack Dirigeant & Professionnel Élite",
    slug: "pack-pro-elite",
    businessType: "freelancer",
    tagline: "L'arsenal sans contact pour consultants, agents immobiliers et dirigeants",
    description: "Combinez carte de visite prestige, plaque de bureau et stickers discrets pour connecter tous vos supports professionnels.",
    price: 390,
    comparePrice: 540,
    features: [
      "1x Carte NFC Noir Mat Satiné Prestige NTAG215",
      "1x Plaque Ronde Réseaux Sociaux & Contact pour bureau",
      "3x Stickers NFC NTAG215 pour ordinateur portable / voiture",
      "Mini-Site Portfolio Pro avec QR Code dynamique",
      "Téléchargement de contact vCard instantané 1-tap"
    ],
    badge: "Prestige",
    isPopular: false,
    icon: "Briefcase",
    idealFor: "Consultants, Dirigeants & Agents Immo"
  },
  {
    id: "pack-evenement-vip",
    name: "Pack Événements & Accès VIP",
    slug: "pack-evenement-vip",
    businessType: "custom",
    tagline: "Bracelets et stickers connectés pour festivals, soirées privées et hôtels",
    description: "Une expérience 100% connectée pour vos invités VIP, événements d'entreprise ou résidences hôtelières.",
    price: 350,
    comparePrice: 480,
    features: [
      "4x Bracelets NFC Tissés avec puce étanche et bague de serrage",
      "5x Stickers NFC NTAG215 pour affiches, badges et comptoirs",
      "Redirection dynamique vers programme, billetterie ou profil VIP",
      "Réutilisable et durable"
    ],
    badge: "Événementiel",
    isPopular: false,
    icon: "Sparkles",
    idealFor: "Festivals, Hôtels & Soirées VIP"
  }
];
