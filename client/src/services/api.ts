import {
  Product,
  BusinessPackage,
  Order,
  DigitalProfile,
  NfcCard,
  Competitor,
  SiteSettings,
  ContactMessage,
  AnalyticsSummary,
  OrderStatus
} from "../types";

const API_BASE = "/api";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("nfc_admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Settings
  async getSettings(): Promise<{ success: boolean; data: SiteSettings }> {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Products
  async getProducts(): Promise<{ success: boolean; data: Product[] }> {
    const res = await fetch(`${API_BASE}/products`);
    return res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async createProduct(product: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    return res.json();
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Packages
  async getPackages(): Promise<{ success: boolean; data: BusinessPackage[] }> {
    const res = await fetch(`${API_BASE}/packages`);
    return res.json();
  },

  async updatePackage(id: string, updates: Partial<BusinessPackage>) {
    const res = await fetch(`${API_BASE}/packages/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async createPackage(pkg: Partial<BusinessPackage>) {
    const res = await fetch(`${API_BASE}/packages`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(pkg)
    });
    return res.json();
  },

  async deletePackage(id: string) {
    const res = await fetch(`${API_BASE}/packages/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Orders
  async createOrder(orderData: any): Promise<{ success: boolean; data: Order; message?: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  async getOrders(): Promise<{ success: boolean; data: Order[] }> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async updateOrderStatus(id: string, status: OrderStatus, note?: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note })
    });
    return res.json();
  },

  async addOrderNote(id: string, note: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/notes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ note })
    });
    return res.json();
  },

  // Profiles
  async getProfile(slug: string): Promise<{ success: boolean; data: DigitalProfile }> {
    const res = await fetch(`${API_BASE}/profiles/${slug}`);
    return res.json();
  },

  async getAllProfiles(): Promise<{ success: boolean; data: DigitalProfile[] }> {
    const res = await fetch(`${API_BASE}/profiles`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async createProfile(profile: Partial<DigitalProfile>) {
    const res = await fetch(`${API_BASE}/profiles`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(profile)
    });
    return res.json();
  },

  async updateProfile(slug: string, updates: Partial<DigitalProfile>) {
    const res = await fetch(`${API_BASE}/profiles/${slug}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteProfile(slug: string) {
    const res = await fetch(`${API_BASE}/profiles/${slug}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getProfileQrCode(slug: string): Promise<{ success: boolean; dataUrl: string; targetUrl: string }> {
    const res = await fetch(`${API_BASE}/profiles/${slug}/qrcode`);
    return res.json();
  },

  // NFC Cards
  async getCards(): Promise<{ success: boolean; data: NfcCard[] }> {
    const res = await fetch(`${API_BASE}/cards`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async resolveCard(cardSlug: string) {
    const res = await fetch(`${API_BASE}/cards/${cardSlug}`);
    return res.json();
  },

  async createCard(card: Partial<NfcCard>) {
    const res = await fetch(`${API_BASE}/cards`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(card)
    });
    return res.json();
  },

  async updateCard(id: string, updates: Partial<NfcCard>) {
    const res = await fetch(`${API_BASE}/cards/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteCard(id: string) {
    const res = await fetch(`${API_BASE}/cards/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Competitor Market Research
  async getCompetitors(): Promise<{ success: boolean; data: Competitor[] }> {
    const res = await fetch(`${API_BASE}/competitors`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async createCompetitor(comp: Partial<Competitor>) {
    const res = await fetch(`${API_BASE}/competitors`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(comp)
    });
    return res.json();
  },

  async updateCompetitor(id: string, updates: Partial<Competitor>) {
    const res = await fetch(`${API_BASE}/competitors/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteCompetitor(id: string) {
    const res = await fetch(`${API_BASE}/competitors/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Analytics
  async track(profileSlug: string, eventType: string, metadata?: Record<string, any>) {
    try {
      await fetch(`${API_BASE}/analytics/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileSlug,
          eventType,
          platform: navigator.userAgent,
          city: "Maroc",
          metadata
        })
      });
    } catch (e) {
      // ignore track error
    }
  },

  async getAnalyticsSummary(): Promise<{ success: boolean; data: AnalyticsSummary }> {
    const res = await fetch(`${API_BASE}/analytics/summary`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Messages
  async sendMessage(msg: Partial<ContactMessage>) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg)
    });
    return res.json();
  },

  async getMessages(): Promise<{ success: boolean; data: ContactMessage[] }> {
    const res = await fetch(`${API_BASE}/messages`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async updateMessageStatus(id: string, status: "new" | "read" | "replied") {
    const res = await fetch(`${API_BASE}/messages/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // File Upload
  async uploadFile(file: File): Promise<{ success: boolean; fileUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData
    });
    return res.json();
  }
};

