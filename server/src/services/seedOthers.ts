import bcrypt from "bcryptjs";
import {
  AdminUser,
  SiteSettings,
  NfcCard,
  Order,
  Competitor,
  AnalyticsEvent,
  ContactMessage
} from "../models/types";

export const initialAdminUsers: AdminUser[] = [
  {
    id: "admin-1",
    email: "admin@nfcard.ma",
    name: "Directeur NFcard Maroc",
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "superadmin"
  }
];

export const initialSettings: SiteSettings = {
  whatsappNumber: "+212661234567",
  whatsappDisplay: "+212 6 61 23 45 67",
  supportEmail: "contact@nfcard.ma",
  supportPhone: "+212 5 22 00 11 22",
  companyName: "NFcard Maroc",
  tagline: "La 1ère Solution de Cartes de Visite NFC & Profils Digitaux au Maroc",
  currency: "DH",
  deliveryFee: 35,
  freeDeliveryThreshold: 500,
  announcementText: "🚀 Livraison Gratuite partout au Maroc à partir de 500 DH d'achat ! Délais 24h/48h.",
  announcementActive: true,
  socialLinks: {
    instagram: "https://instagram.com/nfcard.ma",
    facebook: "https://facebook.com/nfcard.ma",
    linkedin: "https://linkedin.com/company/nfcard-maroc",
    tiktok: "https://tiktok.com/@nfcard.ma"
  }
};

export const initialCards: NfcCard[] = [];

export const initialOrders: Order[] = [];

export const initialCompetitors: Competitor[] = [
  {
    id: "comp-1",
    companyName: "SmartCard Maroc (Exemple Marché)",
    website: "https://smartcard-maroc.example.com",
    instagram: "@smartcard_maroc",
    facebook: "SmartCardMorocco",
    product: "Cartes NFC standard en PVC",
    price: "250 DH - 400 DH",
    packageDetails: "Carte PVC avec lien Linktree ou page basique générique.",
    targetCustomer: "Particuliers & Freelancers",
    advantages: "Présence active sur Instagram, livraison Amana.",
    weaknesses: "Designs de profil très basiques, pas de gestion de menu restaurant, pas de vrai suivi des analytics, support client lent.",
    notes: "Données relevées lors de l'étude de marché de Février 2026. À vérifier périodiquement.",
    dateResearched: "2026-02-10",
    isVerified: true
  },
  {
    id: "comp-2",
    companyName: "TapLink Pro Maroc",
    website: "https://taplinkpro.example.com",
    instagram: "@taplink_ma",
    product: "Carte NFC Métal & Bambou",
    price: "450 DH - 700 DH",
    packageDetails: "Carte NFC haut de gamme avec QR code au verso.",
    targetCustomer: "Cadres dirigeants et agents immobiliers",
    advantages: "Matériaux nobles (bois/métal), packaging soigné.",
    weaknesses: "Prix élevé, pas de service clé-en-main de création du profil (le client doit tout saisir lui-même), pas de vCard v3 enrichie.",
    notes: "Positionnement luxe mais expérience client technique complexe pour les commerçants traditionnels.",
    dateResearched: "2026-02-15",
    isVerified: true
  },
  {
    id: "comp-3",
    companyName: "MenuScan Restaurant Maroc",
    website: "https://menuscan.example.com",
    instagram: "@menuscan_maroc",
    product: "Chevalets QR Code pour restaurants",
    price: "600 DH / an (Abonnement)",
    packageDetails: "Affichage simple d'un fichier PDF sur smartphone.",
    targetCustomer: "Cafés, Snacks et Restaurants à Casablanca & Marrakech",
    advantages: "Spécialisé restauration.",
    weaknesses: "Simple PDF non interactif (zoom désagréable sur mobile), pas de commande WhatsApp, abonnement récurrent imposé.",
    notes: "Opportunité majeure pour NFcard : offrir un vrai menu digital interactif avec commande WhatsApp sans abonnement contraignant.",
    dateResearched: "2026-02-20",
    isVerified: true
  }
];

export const initialAnalyticsEvents: AnalyticsEvent[] = [];

export const initialMessages: ContactMessage[] = [];
