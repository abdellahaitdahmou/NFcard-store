import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  Product,
  BusinessPackage,
  Order,
  DigitalProfile,
  NfcCard,
  Competitor,
  AnalyticsEvent,
  SiteSettings,
  ContactMessage,
  AdminUser,
  OrderStatus
} from "../models/types";
import { initialProducts } from "./seedProducts";
import { initialPackages } from "./seedPackages";
import { initialProfiles } from "./seedProfiles";
import {
  initialAdminUsers,
  initialSettings,
  initialCards,
  initialOrders,
  initialCompetitors,
  initialAnalyticsEvents,
  initialMessages
} from "./seedOthers";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

export interface DatabaseSchema {
  adminUsers: AdminUser[];
  products: Product[];
  packages: BusinessPackage[];
  orders: Order[];
  profiles: DigitalProfile[];
  cards: NfcCard[];
  competitors: Competitor[];
  analyticsEvents: AnalyticsEvent[];
  settings: SiteSettings;
  messages: ContactMessage[];
}

function getInitialData(): DatabaseSchema {
  return {
    adminUsers: initialAdminUsers,
    settings: initialSettings,
    products: initialProducts,
    packages: initialPackages,
    profiles: initialProfiles,
    cards: initialCards,
    orders: initialOrders,
    competitors: initialCompetitors,
    analyticsEvents: initialAnalyticsEvents,
    messages: initialMessages
  };
}

export class DataStore {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectoryExists();
    this.data = this.loadData();
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.profiles)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Could not parse existing DB file, resetting with seed data.");
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave?: DatabaseSchema): void {
    try {
      const d = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(d, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving database file:", err);
    }
  }

  // Admin Auth
  getAdminByEmail(email: string): AdminUser | undefined {
    return this.data.adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  updateAdminPassword(id: string, newHash: string): boolean {
    const admin = this.data.adminUsers.find((u) => u.id === id);
    if (!admin) return false;
    admin.passwordHash = newHash;
    this.saveData();
    return true;
  }

  // Settings
  getSettings(): SiteSettings {
    return this.data.settings;
  }

  updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.saveData();
    return this.data.settings;
  }

  // Products
  getProducts(): Product[] {
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id || p.slug === id);
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.saveData();
    return this.data.products[idx];
  }

  createProduct(productData: Omit<Product, "id">): Product {
    const newProduct: Product = {
      ...productData,
      id: "prod-" + uuidv4().slice(0, 8)
    };
    this.data.products.push(newProduct);
    this.saveData();
    return newProduct;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Packages
  getPackages(): BusinessPackage[] {
    return this.data.packages;
  }

  getPackageById(id: string): BusinessPackage | undefined {
    return this.data.packages.find((p) => p.id === id || p.slug === id);
  }

  updatePackage(id: string, updates: Partial<BusinessPackage>): BusinessPackage | null {
    const idx = this.data.packages.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.packages[idx] = { ...this.data.packages[idx], ...updates };
    this.saveData();
    return this.data.packages[idx];
  }

  createPackage(pkgData: Omit<BusinessPackage, "id">): BusinessPackage {
    const newPkg: BusinessPackage = {
      ...pkgData,
      id: "pack-" + uuidv4().slice(0, 8)
    };
    this.data.packages.push(newPkg);
    this.saveData();
    return newPkg;
  }

  deletePackage(id: string): boolean {
    const initialLen = this.data.packages.length;
    this.data.packages = this.data.packages.filter((p) => p.id !== id);
    if (this.data.packages.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Orders
  getOrders(): Order[] {
    return [...this.data.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: {
    productOrPackName: string;
    productType: "product" | "package";
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    paymentStatus?: "pending" | "paid" | "cash_on_delivery";
    customerInfo: Order["customerInfo"];
  }): Order {
    const count = this.data.orders.length + 1;
    const orderNumber = `NFC-2026-${String(count).padStart(3, "0")}`;
    
    // 1. Generate unique clean slug for digital profile
    const rawName = (orderData.customerInfo?.companyName || orderData.customerInfo?.fullName || "client").trim();
    let baseSlug = rawName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "client";
    
    let generatedSlug = baseSlug;
    let slugSuffix = 1;
    while (this.data.profiles.some(p => p.slug.toLowerCase() === generatedSlug.toLowerCase())) {
      generatedSlug = `${baseSlug}-${slugSuffix}`;
      slugSuffix++;
    }

    // 2. Generate unique secure client access password
    const accessPassword = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Map sector/category to suitable theme & styling
    const cat = (orderData.customerInfo?.category || "Immobilier")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    
    let profileTheme: any = "luxury_gold";
    let defaultCover = "from-amber-700 to-amber-900";

    if (cat.includes("resto") || cat.includes("cafe") || cat.includes("nourriture") || cat.includes("gastronom")) {
      profileTheme = "warm_restaurant";
      defaultCover = "from-orange-700 to-red-900";
    } else if (cat.includes("beaute") || cat.includes("coiffure") || cat.includes("spa") || cat.includes("salon")) {
      profileTheme = "purple_beauty";
      defaultCover = "from-pink-500 to-rose-700";
    } else if (cat.includes("tech") || cat.includes("dev") || cat.includes("freelance") || cat.includes("digital")) {
      profileTheme = "slate_tech";
      defaultCover = "from-blue-700 to-indigo-900";
    } else if (cat.includes("medic") || cat.includes("sante") || cat.includes("docteur") || cat.includes("clinique")) {
      profileTheme = "minimal_light";
      defaultCover = "from-red-600 to-rose-800";
    } else if (cat.includes("juridi") || cat.includes("avocat") || cat.includes("droit") || cat.includes("notaire")) {
      profileTheme = "luxury_gold";
      defaultCover = "from-slate-700 to-slate-900";
    } else if (cat.includes("commerce") || cat.includes("boutique") || cat.includes("artisanat") || cat.includes("magasin")) {
      profileTheme = "purple_beauty";
      defaultCover = "from-purple-600 to-indigo-800";
    } else if (cat.includes("entreprise") || cat.includes("btp") || cat.includes("societe") || cat.includes("holding")) {
      profileTheme = "emerald_corporate";
      defaultCover = "from-emerald-700 to-teal-900";
    }

    // 4. Automatically construct & persist the digital profile
    const newProfile: DigitalProfile = {
      id: "prof-" + uuidv4().slice(0, 8),
      slug: generatedSlug,
      ownerName: orderData.customerInfo.fullName || "Client NFcard",
      companyName: orderData.customerInfo.companyName || "Entreprise",
      jobTitle: orderData.customerInfo.jobTitle || "Professionnel",
      bio: orderData.customerInfo.description || `Bienvenue sur le profil digital officiel de ${orderData.customerInfo.fullName || orderData.customerInfo.companyName}.`,
      category: orderData.customerInfo.category || "Professionnel",
      avatarUrl: orderData.customerInfo.logoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      logoUrl: orderData.customerInfo.logoUrl || "",
      coverUrl: defaultCover,
      theme: profileTheme,
      phone: orderData.customerInfo.phone || "",
      whatsapp: orderData.customerInfo.whatsapp || orderData.customerInfo.phone || "",
      email: orderData.customerInfo.email || "",
      website: orderData.customerInfo.website || "",
      address: orderData.customerInfo.address || "",
      city: orderData.customerInfo.city || "Maroc",
      googleMapsUrl: orderData.customerInfo.googleMaps || "",
      socials: {
        instagram: orderData.customerInfo.instagram ? (orderData.customerInfo.instagram.startsWith("http") ? orderData.customerInfo.instagram : `https://instagram.com/${orderData.customerInfo.instagram.replace("@", "")}`) : undefined,
        facebook: orderData.customerInfo.facebook ? (orderData.customerInfo.facebook.startsWith("http") ? orderData.customerInfo.facebook : `https://facebook.com/${orderData.customerInfo.facebook}`) : undefined,
        linkedin: orderData.customerInfo.linkedin ? (orderData.customerInfo.linkedin.startsWith("http") ? orderData.customerInfo.linkedin : `https://linkedin.com/in/${orderData.customerInfo.linkedin}`) : undefined,
        tiktok: orderData.customerInfo.tiktok ? (orderData.customerInfo.tiktok.startsWith("http") ? orderData.customerInfo.tiktok : `https://tiktok.com/@${orderData.customerInfo.tiktok.replace("@", "")}`) : undefined,
      },
      services: [
        { id: "srv-1", title: "Prestation Principale", description: "Service sur-mesure de haute qualité.", price: "Sur devis" },
        { id: "srv-2", title: "Consultation & RDV", description: "Prise de contact rapide sur WhatsApp.", price: "Gratuit" }
      ],
      portfolio: [
        { id: "port-1", title: "Réalisation 1", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
        { id: "port-2", title: "Réalisation 2", imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" },
        { id: "port-3", title: "Réalisation 3", imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80" }
      ],
      isActive: true,
      isProtected: false,
      accessPassword: accessPassword,
      createdFromOrderNumber: orderNumber,
      viewsCount: 0,
      qrScansCount: 0,
      nfcTapsCount: 0,
      whatsappClicksCount: 0,
      callClicksCount: 0,
      vcardDownloadsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.profiles.push(newProfile);

    // 5. Automatically create a linked NFC card record
    const newCard: NfcCard = {
      id: "card-" + uuidv4().slice(0, 8),
      uid: `NFC-MA-${String(count + 1000).padStart(4, "0")}`,
      cardSlug: generatedSlug,
      targetProfileSlug: generatedSlug,
      customerName: orderData.customerInfo.fullName || orderData.customerInfo.companyName,
      status: "pending",
      orderNumber: orderNumber,
      activationDate: new Date().toISOString(),
      totalTaps: 0
    };
    this.data.cards.push(newCard);

    // 6. Create the Order
    const newOrder: Order = {
      id: "ord-" + uuidv4().slice(0, 8),
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "new",
      productOrPackName: orderData.productOrPackName,
      productType: orderData.productType,
      productId: orderData.productId,
      quantity: orderData.quantity || 1,
      unitPrice: orderData.unitPrice,
      totalPrice: orderData.totalPrice,
      paymentStatus: orderData.paymentStatus || "cash_on_delivery",
      customerInfo: orderData.customerInfo,
      createdProfileSlug: generatedSlug,
      accessPassword: accessPassword,
      adminNotes: [`Profil généré automatiquement: /p/${generatedSlug} (Code d'accès: ${accessPassword})`],
      history: [
        {
          status: "new",
          timestamp: new Date().toISOString(),
          note: `Commande passée par le client. Profil /p/${generatedSlug} créé avec mot de passe ${accessPassword}.`
        }
      ]
    };

    this.data.orders.unshift(newOrder);
    this.saveData();
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;
    order.status = status;
    order.history.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Statut mis à jour : ${status}`
    });
    this.saveData();
    return order;
  }

  addOrderNote(orderId: string, note: string): Order | null {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;
    if (!order.adminNotes) order.adminNotes = [];
    order.adminNotes.push(note);
    this.saveData();
    return order;
  }

  updateOrder(orderId: string, updates: Partial<Order>): Order | null {
    const idx = this.data.orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (idx === -1) return null;
    this.data.orders[idx] = { ...this.data.orders[idx], ...updates };
    this.saveData();
    return this.data.orders[idx];
  }

  // Profiles
  getProfiles(): DigitalProfile[] {
    return this.data.profiles;
  }

  getProfileBySlug(slug: string): DigitalProfile | undefined {
    return this.data.profiles.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase() && p.isActive
    );
  }

  getProfileById(id: string): DigitalProfile | undefined {
    return this.data.profiles.find((p) => p.id === id || p.slug === id);
  }

  createProfile(profileData: Omit<DigitalProfile, "id" | "viewsCount" | "qrScansCount" | "nfcTapsCount" | "whatsappClicksCount" | "callClicksCount" | "vcardDownloadsCount" | "createdAt" | "updatedAt">): DigitalProfile {
    const newProfile: DigitalProfile = {
      ...profileData,
      id: "prof-" + uuidv4().slice(0, 8),
      viewsCount: 0,
      qrScansCount: 0,
      nfcTapsCount: 0,
      whatsappClicksCount: 0,
      callClicksCount: 0,
      vcardDownloadsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.profiles.push(newProfile);
    this.saveData();
    return newProfile;
  }

  updateProfile(idOrSlug: string, updates: Partial<DigitalProfile>): DigitalProfile | null {
    const idx = this.data.profiles.findIndex(
      (p) => p.id === idOrSlug || p.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (idx === -1) return null;
    this.data.profiles[idx] = {
      ...this.data.profiles[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.profiles[idx];
  }

  deleteProfile(idOrSlug: string): boolean {
    const initialLen = this.data.profiles.length;
    this.data.profiles = this.data.profiles.filter(
      (p) => p.id !== idOrSlug && p.slug.toLowerCase() !== idOrSlug.toLowerCase()
    );
    if (this.data.profiles.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  incrementProfileMetric(slug: string, metric: "views" | "qr" | "nfc" | "whatsapp" | "call" | "vcard"): void {
    const profile = this.data.profiles.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
    if (!profile) return;
    if (metric === "views") profile.viewsCount = (profile.viewsCount || 0) + 1;
    if (metric === "qr") profile.qrScansCount = (profile.qrScansCount || 0) + 1;
    if (metric === "nfc") profile.nfcTapsCount = (profile.nfcTapsCount || 0) + 1;
    if (metric === "whatsapp") profile.whatsappClicksCount = (profile.whatsappClicksCount || 0) + 1;
    if (metric === "call") profile.callClicksCount = (profile.callClicksCount || 0) + 1;
    if (metric === "vcard") profile.vcardDownloadsCount = (profile.vcardDownloadsCount || 0) + 1;
    this.saveData();
  }

  // NFC Cards
  getCards(): NfcCard[] {
    return this.data.cards;
  }

  getCardBySlug(slug: string): NfcCard | undefined {
    return this.data.cards.find(
      (c) => c.cardSlug.toLowerCase() === slug.toLowerCase() || c.uid.toLowerCase() === slug.toLowerCase()
    );
  }

  createCard(cardData: Omit<NfcCard, "id" | "totalTaps">): NfcCard {
    const newCard: NfcCard = {
      ...cardData,
      id: "card-" + uuidv4().slice(0, 8),
      totalTaps: 0
    };
    this.data.cards.push(newCard);
    this.saveData();
    return newCard;
  }

  updateCard(id: string, updates: Partial<NfcCard>): NfcCard | null {
    const idx = this.data.cards.findIndex((c) => c.id === id || c.uid === id);
    if (idx === -1) return null;
    this.data.cards[idx] = { ...this.data.cards[idx], ...updates };
    this.saveData();
    return this.data.cards[idx];
  }

  incrementCardTap(slugOrUid: string): void {
    const card = this.data.cards.find(
      (c) => c.cardSlug.toLowerCase() === slugOrUid.toLowerCase() || c.uid.toLowerCase() === slugOrUid.toLowerCase()
    );
    if (!card) return;
    card.totalTaps = (card.totalTaps || 0) + 1;
    this.saveData();
  }

  deleteCard(id: string): boolean {
    const initialLen = this.data.cards.length;
    this.data.cards = this.data.cards.filter((c) => c.id !== id && c.uid !== id);
    if (this.data.cards.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Competitor Market Research
  getCompetitors(): Competitor[] {
    return this.data.competitors;
  }

  createCompetitor(compData: Omit<Competitor, "id">): Competitor {
    const newComp: Competitor = {
      ...compData,
      id: "comp-" + uuidv4().slice(0, 8)
    };
    this.data.competitors.push(newComp);
    this.saveData();
    return newComp;
  }

  updateCompetitor(id: string, updates: Partial<Competitor>): Competitor | null {
    const idx = this.data.competitors.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.competitors[idx] = { ...this.data.competitors[idx], ...updates };
    this.saveData();
    return this.data.competitors[idx];
  }

  deleteCompetitor(id: string): boolean {
    const initialLen = this.data.competitors.length;
    this.data.competitors = this.data.competitors.filter((c) => c.id !== id);
    if (this.data.competitors.length !== initialLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Analytics Events
  trackEvent(event: Omit<AnalyticsEvent, "id" | "timestamp">): AnalyticsEvent {
    const newEvt: AnalyticsEvent = {
      ...event,
      id: "evt-" + uuidv4().slice(0, 8),
      timestamp: new Date().toISOString()
    };
    this.data.analyticsEvents.unshift(newEvt);
    if (this.data.analyticsEvents.length > 1000) {
      this.data.analyticsEvents = this.data.analyticsEvents.slice(0, 1000);
    }
    this.saveData();
    return newEvt;
  }

  getAnalyticsSummary() {
    const totalViews = this.data.profiles.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
    const totalNfcTaps = (this.data.cards || []).reduce((acc, c) => acc + (c.totalTaps || 0), 0) +
      this.data.profiles.reduce((acc, p) => acc + (p.nfcTapsCount || 0), 0);
    const totalQrScans = this.data.profiles.reduce((acc, p) => acc + (p.qrScansCount || 0), 0);
    const totalWhatsappClicks = this.data.profiles.reduce((acc, p) => acc + (p.whatsappClicksCount || 0), 0);
    const totalVcards = this.data.profiles.reduce((acc, p) => acc + (p.vcardDownloadsCount || 0), 0);

    const orders = this.data.orders || [];
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((acc, o) => acc + (o.totalPrice || 0), 0);

    const pendingOrdersCount = orders.filter(
      (o) => o.status !== "completed" && o.status !== "delivered" && o.status !== "cancelled"
    ).length;

    const completedOrdersCount = orders.filter(
      (o) => o.status === "completed" || o.status === "delivered"
    ).length;

    const uniqueCustomers = new Set(
      orders.map((o) => o.customerInfo?.phone || o.customerInfo?.email || o.id)
    ).size;

    const totalNfcCardsSold = orders.reduce((acc, o) => acc + (o.quantity || 1), 0);

    const categoryCounts: Record<string, number> = {};
    orders.forEach((o) => {
      const cat = o.customerInfo?.category || "Général";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const popularCategory = Object.keys(categoryCounts).length > 0
      ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "En attente de commandes";

    const packageCounts: Record<string, number> = {};
    orders.forEach((o) => {
      packageCounts[o.productOrPackName] = (packageCounts[o.productOrPackName] || 0) + 1;
    });

    const popularProduct = Object.keys(packageCounts).length > 0
      ? Object.entries(packageCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "Aucune commande pour le moment";

    return {
      totalCustomers: uniqueCustomers,
      totalNfcCardsSold: totalNfcCardsSold,
      activeProfilesCount: this.data.profiles.filter((p) => p.isActive).length,
      pendingOrdersCount,
      completedOrdersCount,
      totalRevenueDH: totalRevenue,
      popularProduct,
      popularCategory,
      totalViews,
      totalNfcTaps,
      totalQrScans,
      totalWhatsappClicks,
      totalVcards,
      recentEvents: (this.data.analyticsEvents || []).slice(0, 20)
    };
  }

  // Messages
  getMessages(): ContactMessage[] {
    return [...this.data.messages].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createMessage(msgData: Omit<ContactMessage, "id" | "createdAt" | "status">): ContactMessage {
    const newMsg: ContactMessage = {
      ...msgData,
      id: "msg-" + uuidv4().slice(0, 8),
      createdAt: new Date().toISOString(),
      status: "new"
    };
    this.data.messages.unshift(newMsg);
    this.saveData();
    return newMsg;
  }

  updateMessageStatus(id: string, status: "new" | "read" | "replied"): boolean {
    const msg = this.data.messages.find((m) => m.id === id);
    if (!msg) return false;
    msg.status = status;
    this.saveData();
    return true;
  }
}

export const store = new DataStore();
