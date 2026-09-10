import { DigitalProfile } from "../models/types";

export const initialProfiles: DigitalProfile[] = [
  {
    id: "prof-ahmed",
    slug: "ahmed-benali",
    ownerName: "Ahmed Benali",
    companyName: "Atlas Prestige Real Estate",
    jobTitle: "Consultant en Immobilier de Prestige",
    bio: "Spécialiste de l'immobilier haut de gamme à Marrakech et Casablanca. J'accompagne investisseurs et particuliers dans l'achat, la vente et la location de propriétés d'exception.",
    category: "Immobilier",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80",
    theme: "luxury_gold",
    phone: "+212661234567",
    whatsapp: "+212661234567",
    email: "ahmed.benali@atlasprestige.ma",
    website: "https://atlasprestige.ma",
    address: "Angle Boulevard Mohammed V et Rue de la Liberté, Guéliz",
    city: "Marrakech",
    googleMapsUrl: "https://maps.google.com/?q=Gueliz+Marrakech",
    socials: {
      instagram: "https://instagram.com/ahmed.benali.immo",
      linkedin: "https://linkedin.com/in/ahmed-benali-immo",
      facebook: "https://facebook.com/atlasprestige.maroc"
    },
    services: [
      {
        id: "serv-1",
        title: "Achat & Vente de Villas de Luxe",
        description: "Propriétés sélectionnées sur la Palmeraie, Route d'Amizmiz et l'Hivernage avec rentabilité locative.",
        price: "Sur Mandat"
      },
      {
        id: "serv-2",
        title: "Estimation Immobilière Certifiée",
        description: "Évaluation précise de la valeur marchande de votre bien au mètre carré selon les tendances du marché.",
        price: "Offerte"
      },
      {
        id: "serv-3",
        title: "Accompagnement Notarié & Juridique",
        description: "Gestion complète du dossier d'acquisition, vérification du titre foncier et formalités administratives.",
        price: "Inclus"
      }
    ],
    portfolio: [
      {
        id: "port-1",
        title: "Villa Contemporaine - Palmeraie Marrakech",
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80",
        category: "Villa"
      },
      {
        id: "port-2",
        title: "Penthouse avec Vue Mer - Casablanca Anfa",
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
        category: "Appartement"
      },
      {
        id: "port-3",
        title: "Riad Rénové 6 Suites - Médina Marrakech",
        imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&auto=format&fit=crop&q=80",
        category: "Riad"
      }
    ],
    openingHours: "Lun - Sam : 09:00 - 19:30 | Dimanche sur RDV",
    isActive: true,
    viewsCount: 0,
    qrScansCount: 0,
    nfcTapsCount: 0,
    whatsappClicksCount: 0,
    callClicksCount: 0,
    vcardDownloadsCount: 0,
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-02-20T14:30:00.000Z"
  },
  {
    id: "prof-resto",
    slug: "le-jardin-marrakech",
    ownerName: "Chef Karim Tazi",
    companyName: "Restaurant Le Jardin Secret",
    jobTitle: "Chef Propriétaire & Fondateur",
    bio: "Cuisine marocaine raffinée et gastronomie méditerranéenne au cœur d'un patio verdoyant. Produits frais du terroir, ambiance tamisée et service d'exception.",
    category: "Restauration",
    avatarUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80",
    theme: "warm_restaurant",
    phone: "+212524445566",
    whatsapp: "+212660112233",
    email: "reservation@lejardin-marrakech.com",
    website: "https://lejardin-marrakech.com",
    address: "32 Rue Sidi Abdelaziz, Médina",
    city: "Marrakech",
    googleMapsUrl: "https://maps.google.com/?q=Medina+Marrakech",
    socials: {
      instagram: "https://instagram.com/lejardinmarrakech",
      facebook: "https://facebook.com/lejardinmarrakech",
      tiktok: "https://tiktok.com/@lejardin.secret"
    },
    services: [
      {
        id: "menu-1",
        title: "Pastilla Traditionnelle au Pigeon & Amandes",
        description: "Feuilletage croustillant artisanal, cannelle douce et éclats d'amandes dorées.",
        price: "130 DH"
      },
      {
        id: "menu-2",
        title: "Tajine d'Agneau aux Pruneaux Caramélisés",
        description: "Viande fondante mijotée 5 heures, graines de sésame grillées et amandes.",
        price: "160 DH"
      },
      {
        id: "menu-3",
        title: "Thé Gourmand à la Menthe & Pâtisseries Fassies",
        description: "Corne de gazelle, ghriba aux noix et briouates au miel pur.",
        price: "70 DH"
      }
    ],
    portfolio: [
      {
        id: "resto-p1",
        title: "Patio et Fontaine Végétale",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
        category: "Ambiance"
      },
      {
        id: "resto-p2",
        title: "Tajine Royal Marocain",
        imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600&auto=format&fit=crop&q=80",
        category: "Gastronomie"
      }
    ],
    openingHours: "Tous les jours : 12:00 - 23:30 (Service continu)",
    isActive: true,
    viewsCount: 0,
    qrScansCount: 0,
    nfcTapsCount: 0,
    whatsappClicksCount: 0,
    callClicksCount: 0,
    vcardDownloadsCount: 0,
    createdAt: "2026-01-10T12:00:00.000Z",
    updatedAt: "2026-02-18T16:00:00.000Z"
  },
  {
    id: "prof-sara",
    slug: "sara-kabbaj",
    ownerName: "Sara Kabbaj",
    companyName: "Sara Kabbaj Beauty Studio",
    jobTitle: "Makeup Artist & Esthéticienne Certifiée",
    bio: "Sublimez votre beauté pour vos mariages, fiançailles et événements spéciaux à Casablanca. Soins experts de la peau, maquillage mariée haute tenue et lamination des sourcils.",
    category: "Beauté & Bien-être",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80",
    theme: "purple_beauty",
    phone: "+212662998877",
    whatsapp: "+212662998877",
    email: "contact@sarakabbaj.ma",
    website: "https://sarakabbaj.ma",
    address: "Résidence Les Lilas, Boulevard Franklin Roosevelt, Racine",
    city: "Casablanca",
    googleMapsUrl: "https://maps.google.com/?q=Racine+Casablanca",
    socials: {
      instagram: "https://instagram.com/sarakabbaj.beauty",
      tiktok: "https://tiktok.com/@sarakabbaj.mua"
    },
    services: [
      {
        id: "serv-s1",
        title: "Pack Mariée VIP Prestige",
        description: "Essai maquillage, soin éclat visage, pose cils HD, maquillage jour J et retouche soirée.",
        price: "2 800 DH"
      },
      {
        id: "serv-s2",
        title: "Maquillage Soirée & Invité",
        description: "Teint parfait sans effet masque, contouring lumineux et regard intensifié.",
        price: "600 DH"
      },
      {
        id: "serv-s3",
        title: "Hydrafacial & Soin Détoxifiant",
        description: "Nettoyage profond, extraction sans douleur et hydratation intense par sérums vitaminés.",
        price: "750 DH"
      }
    ],
    portfolio: [
      {
        id: "sara-p1",
        title: "Maquillage Mariée Royale Marocaine",
        imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80",
        category: "Mariage"
      },
      {
        id: "sara-p2",
        title: "Look Glamour Soirée",
        imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&auto=format&fit=crop&q=80",
        category: "Soirée"
      }
    ],
    openingHours: "Mardi au Dimanche : 10:00 - 20:00 | Fermé le Lundi",
    isActive: true,
    viewsCount: 0,
    qrScansCount: 0,
    nfcTapsCount: 0,
    whatsappClicksCount: 0,
    callClicksCount: 0,
    vcardDownloadsCount: 0,
    createdAt: "2026-01-20T11:00:00.000Z",
    updatedAt: "2026-02-22T09:00:00.000Z"
  },
  {
    id: "prof-yassine",
    slug: "yassine-dev",
    ownerName: "Yassine El Mansouri",
    companyName: "Nexus Digital Studio",
    jobTitle: "Consultant Tech & Développeur Full-Stack",
    bio: "J'aide les entreprises et startups marocaines à concevoir des applications web et mobiles modernes, rapides et orientées conversion.",
    category: "Tech & Freelance",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    theme: "modern_dark",
    phone: "+212678123987",
    whatsapp: "+212678123987",
    email: "yassine@nexusdigital.ma",
    website: "https://nexusdigital.ma",
    city: "Tanger",
    googleMapsUrl: "https://maps.google.com/?q=Tanger+City+Center",
    socials: {
      linkedin: "https://linkedin.com/in/yassine-elmansouri",
      instagram: "https://instagram.com/yassine.code",
      twitter: "https://twitter.com/yassine_tech"
    },
    services: [
      {
        id: "y-s1",
        title: "Création Site Web & E-commerce",
        description: "Boutique en ligne optimisée pour le paiement par carte CMI et livraison au Maroc.",
        price: "À partir de 4 500 DH"
      },
      {
        id: "y-s2",
        title: "Applications Mobiles iOS & Android",
        description: "Applications natives ou cross-platform fluides et intuitives.",
        price: "Sur Devis"
      }
    ],
    portfolio: [
      {
        id: "y-p1",
        title: "Application E-commerce Mode Maroc",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
        category: "Web & Mobile"
      }
    ],
    openingHours: "Lun - Ven : 09:00 - 18:30",
    isActive: true,
    viewsCount: 0,
    qrScansCount: 0,
    nfcTapsCount: 0,
    whatsappClicksCount: 0,
    callClicksCount: 0,
    vcardDownloadsCount: 0,
    createdAt: "2026-02-01T15:00:00.000Z",
    updatedAt: "2026-02-25T11:00:00.000Z"
  }
];
