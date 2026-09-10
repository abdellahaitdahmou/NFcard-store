export type OrderStatus =
  | "new"
  | "info_requested"
  | "info_received"
  | "design_in_progress"
  | "customer_validation"
  | "production"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export type CardStatus = "active" | "inactive" | "pending";

export type ProfileTheme =
  | "modern_dark"
  | "luxury_gold"
  | "emerald_corporate"
  | "minimal_light"
  | "warm_restaurant"
  | "sky_realestate"
  | "purple_beauty"
  | "slate_tech";

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number; // in DH
  comparePrice?: number;
  features: string[];
  isPopular?: boolean;
  category: "cards" | "stands" | "accessories" | "rfid" | "basic" | "business" | "premium" | "custom";
  badge?: string;
  icon?: string;
  image?: string;
  includedCardCount: number;
}

export interface BusinessPackage {
  id: string;
  name: string;
  slug: string;
  businessType?: "restaurant" | "real_estate" | "salon_barber" | "freelancer" | "company" | "medical" | "custom" | string;
  tagline: string;
  description: string;
  price: number; // in DH
  comparePrice?: number;
  features: string[];
  icon: string;
  badge?: string;
  idealFor?: string;
  isPopular?: boolean;
}

export interface CustomerBusinessInfo {
  fullName: string;
  companyName: string;
  jobTitle?: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  address?: string;
  category: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  googleMaps?: string;
  description?: string;
  services?: string[];
  openingHours?: string;
  notes?: string;
  logoUrl?: string;
  oldCardPhotoUrl?: string;
  additionalPhotos?: string[];
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. NFC-2026-001
  createdAt: string;
  status: OrderStatus;
  productOrPackName: string;
  productType: "product" | "package";
  productId: string;
  quantity: number;
  unitPrice: number; // in DH
  totalPrice: number; // in DH
  paymentStatus: "pending" | "paid" | "cash_on_delivery";
  customerInfo: CustomerBusinessInfo;
  createdProfileSlug?: string;
  accessPassword?: string;
  nfcCardUid?: string;
  adminNotes?: string[];
  history: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
}

export interface DigitalProfile {
  id: string;
  slug: string; // e.g. ahmed-immobilier -> /p/ahmed-immobilier
  ownerName: string;
  companyName: string;
  jobTitle: string;
  bio: string;
  category: string;
  avatarUrl: string;
  coverUrl?: string;
  logoUrl?: string;
  theme: ProfileTheme;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  address?: string;
  city?: string;
  googleMapsUrl?: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
  };
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  openingHours?: string;
  isActive: boolean;
  isProtected?: boolean;
  accessPassword?: string;
  createdFromOrderNumber?: string;
  viewsCount: number;
  qrScansCount: number;
  nfcTapsCount: number;
  whatsappClicksCount: number;
  callClicksCount: number;
  vcardDownloadsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NfcCard {
  id: string;
  uid: string; // unique card code e.g. NFC-MA-8849
  cardSlug: string; // e.g. /card/8849
  targetProfileSlug: string;
  customerName: string;
  status: CardStatus;
  orderNumber?: string;
  activationDate?: string;
  expirationDate?: string;
  notes?: string;
  totalTaps: number;
}

export interface Competitor {
  id: string;
  companyName: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  product: string;
  price: string;
  packageDetails: string;
  targetCustomer: string;
  advantages: string;
  weaknesses: string;
  notes: string;
  dateResearched: string;
  isVerified: boolean;
}

export interface AnalyticsEvent {
  id: string;
  profileSlug: string;
  eventType: "page_view" | "nfc_tap" | "qr_scan" | "whatsapp_click" | "call_click" | "email_click" | "vcard_save" | "maps_click" | "social_click";
  platform?: string;
  city?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SiteSettings {
  whatsappNumber: string;
  whatsappDisplay: string;
  supportEmail: string;
  supportPhone: string;
  companyName: string;
  tagline: string;
  currency: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  announcementText: string;
  announcementActive: boolean;
  socialLinks: {
    instagram: string;
    facebook: string;
    linkedin: string;
    tiktok: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  serviceInterest?: string;
  createdAt: string;
  status: "new" | "read" | "replied";
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "superadmin" | "admin";
}
