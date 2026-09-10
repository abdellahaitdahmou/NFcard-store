import { Product } from "../models/types";

export const initialProducts: Product[] = [
  {
    id: "prod-google-stand",
    name: "Chevalet Acrylique NFC Avis Google 5★",
    slug: "chevalet-nfc-avis-google-5-etoiles",
    tagline: "Multipliez vos avis Google Maps 5 étoiles en caisse et à la réception",
    description: "Chevalet de comptoir en acrylique noir de luxe avec logo Google Merchant officiel, puce NFC intégrée et QR Code. Vos clients approchent leur smartphone et déposent un avis 5 étoiles en 3 secondes !",
    price: 290,
    comparePrice: 390,
    features: [
      "Acrylique noir brillant haute qualité et design statutaire",
      "Puce NFC pré-programmée avec le lien direct de vos avis Google",
      "QR Code haute visibilité pour smartphones sans NFC",
      "Augmente considérablement votre classement sur Google Maps",
      "Zéro application requise pour vos clients",
      "Idéal pour restaurants, salons de beauté, hôtels, cliniques et commerces",
      "Installation immédiate prête à poser"
    ],
    isPopular: true,
    category: "stands",
    badge: "Spécial Commerces & Resto",
    image: "/products/google-stand.png",
    includedCardCount: 1
  },
  {
    id: "prod-table-tents-5",
    name: "Pack 5 Chevalets de Table NFC Restaurant (Table 01 à 05)",
    slug: "pack-5-chevalets-table-nfc-restaurant",
    tagline: "Lot de 5 chevalets numérotés pour menu digital et commandes en terrasse",
    description: "Chevalets double-face numérotés Table 01 à 05 pour restaurants, cafés et bars. Permet aux clients de consulter votre menu digital avec photos, prix, allergènes et bouton commande WhatsApp.",
    price: 390,
    comparePrice: 550,
    features: [
      "Lot complet de 5 chevalets rigides double-face (Tables 1 à 5)",
      "Puces NFC individuelles + QR Code haute lisibilité par table",
      "Menu digital interactif avec mise à jour des prix en temps réel",
      "Bouton commande et réservation WhatsApp direct",
      "Élimine les coûts d'impression des menus papier",
      "Résistant aux taches et lavable"
    ],
    isPopular: true,
    category: "stands",
    badge: "Pack Restauration",
    image: "/products/table-tents-5pcs.png",
    includedCardCount: 5
  },
  {
    id: "prod-social-plate",
    name: "Plaque Ronde NFC Réseaux Sociaux & Instagram",
    slug: "plaque-ronde-nfc-reseaux-sociaux",
    tagline: "Gagnez des abonnés Instagram, TikTok & Facebook en direct en boutique",
    description: "Disque adhésif rigide avec puce NFC et QR Code multi-réseaux. À coller sur votre comptoir de caisse, votre vitrine de magasin ou votre miroir de salon de coiffure.",
    price: 180,
    comparePrice: 250,
    features: [
      "Format rond 10cm avec adhésif ultra-résistant",
      "Puce NFC intégrée + QR Code coloré haute définition",
      "Ouvre directement votre page Instagram, TikTok ou profil Tektap",
      "Convertit vos visiteurs en abonnés fidèles",
      "Résistant aux nettoyages et à l'humidité",
      "Configuration offerte par notre équipe"
    ],
    isPopular: false,
    category: "stands",
    badge: "Tendance Boutique",
    image: "/products/social-plate.png",
    includedCardCount: 1
  },
  {
    id: "prod-nfc-stickers-10",
    name: "Lot de 10 Stickers / Autocollants NFC NTAG215",
    slug: "lot-10-stickers-autocollants-nfc-ntag215",
    tagline: "Transformez n'importe quelle vitrine, table ou objet en borne interactive",
    description: "Lot de 10 autocollants NFC transparents / blancs discrets avec puce NTAG215 (504 Bytes). À coller sur vos vitrines de magasin, tables, véhicules professionnels, packaging ou ordinateurs.",
    price: 130,
    comparePrice: 220,
    features: [
      "Lot de 10 stickers adhésifs haute adhérence",
      "Puce NXP NTAG215 504 Bytes réinscriptible",
      "Détection instantanée sans contact NFC",
      "Idéal pour automatiser des liens, avis ou profils digitaux",
      "Programmable avec smartphone iPhone ou Android",
      "Compatible toutes applications NFC"
    ],
    isPopular: false,
    category: "accessories",
    badge: "Lot de 10",
    image: "/products/nfc-stickers-10pcs.png",
    includedCardCount: 10
  },
  {
    id: "prod-wristbands-4",
    name: "Bracelet NFC Tissé Ajustable Événements & Hôtels",
    slug: "bracelet-nfc-tisse-ajustable",
    tagline: "Bracelet connecté pour accès VIP, hôtels, piscines, clubs & festivals",
    description: "Bracelet tissé ultra-confortable et indéchirable avec puce NFC étanche intégrée. Idéal pour gestion d'accès VIP, résidences hôtelières, événements privés ou partage de contact sans contact.",
    price: 100,
    comparePrice: 150,
    features: [
      "Bracelet tissé individuel avec bague de serrage sécurisée",
      "Puce NFC étanche (résistant à l'eau et à la transpiration)",
      "Lien programmable vers profil, contact, catalogue ou badge d'accès",
      "Finition noire sobre et élégante",
      "Réutilisable et durable"
    ],
    isPopular: false,
    category: "accessories",
    badge: "À l'unité",
    image: "/products/nfc-wristbands.png",
    includedCardCount: 1
  },
  {
    id: "prod-rfid-duplicator",
    name: "Copieur / Duplicateur de Badges RFID 125Khz + 6 Porte-clés",
    slug: "copieur-duplicateur-badges-rfid-125khz",
    tagline: "Dupliquez vos badges d'immeuble, parking et ascenseur en 1 seconde",
    description: "Appareil duplicateur autonome ergonomique avec synthèse vocale et LED indicatrices. Permet de lire et cloner tous les badges et porte-clés RFID 125Khz (EM4100 / TK4100 / T5577) sans ordinateur en 1 seul clic !",
    price: 450,
    comparePrice: 650,
    features: [
      "Appareil copieur RFID 125Khz portable avec poignée ergonomique",
      "Livré avec 6 porte-clés RFID réinscriptibles bleus inclus",
      "Clonage instantané (Bouton READ puis WRITE)",
      "Synthèse vocale bilingue et alertes sonores de confirmation",
      "Compatible interphones, barrières de parking, ascenseurs et portes d'immeuble au Maroc",
      "Fonctionne avec 2 piles AAA standards",
      "Prêt à l'emploi avec notice en français"
    ],
    isPopular: true,
    category: "rfid",
    badge: "Kit Complet Pro",
    image: "/products/rfid-duplicator.png",
    includedCardCount: 6
  },
  {
    id: "prod-keyfobs-15",
    name: "Lot de 15 Porte-clés / Badges RFID 125Khz Universels",
    slug: "lot-15-porte-cles-badges-rfid-125khz",
    tagline: "Badges porte-clés bleus étanches et résistants pour contrôle d'accès",
    description: "Lot de 15 porte-clés RFID 125Khz avec puce EM4100/TK4100 universelle pré-numérotée. Parfait pour les résidences, syndics de copropriété, bureaux, parkings et clubs sportifs.",
    price: 180,
    comparePrice: 260,
    features: [
      "Lot économique de 15 porte-clés RFID bleus",
      "Boîtier ABS étanche et résistant aux chocs",
      "Fréquence 125Khz universelle standard",
      "Numéro ID unique gravé au laser sur chaque porte-clés",
      "Anneau métallique porte-clés inclus",
      "Compatible tous lecteurs RFID standards au Maroc"
    ],
    isPopular: false,
    category: "rfid",
    badge: "Lot de 15",
    image: "/products/rfid-keyfobs-15pcs.png",
    includedCardCount: 15
  }
];
