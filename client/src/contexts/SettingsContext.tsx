import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteSettings } from "../types";
import { api } from "../services/api";

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  openWhatsAppChat: (customMessage?: string) => void;
}

const defaultSettings: SiteSettings = {
  whatsappNumber: "+212661234567",
  whatsappDisplay: "+212 6 61 23 45 67",
  supportEmail: "contact@tektap.ma",
  supportPhone: "+212 5 22 00 11 22",
  companyName: "Tektap NFC Maroc",
  tagline: "La 1ère Solution de Cartes de Visite NFC & Profils Digitaux au Maroc",
  currency: "DH",
  deliveryFee: 35,
  freeDeliveryThreshold: 500,
  announcementText: "🚀 Livraison Gratuite partout au Maroc à partir de 500 DH d'achat ! Délais 24h/48h.",
  announcementActive: true,
  socialLinks: {
    instagram: "https://instagram.com/tektap.maroc",
    facebook: "https://facebook.com/tektap.maroc",
    linkedin: "https://linkedin.com/company/tektap-maroc",
    tiktok: "https://tiktok.com/@tektap.maroc"
  }
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
  refreshSettings: async () => {},
  openWhatsAppChat: () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res && res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.warn("Could not load backend settings, using defaults.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const openWhatsAppChat = (customMessage?: string) => {
    const rawNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");
    const text = customMessage || "Bonjour Tektap Maroc, je souhaite avoir plus d'informations sur vos cartes de visite NFC et profils digitaux.";
    const url = `https://wa.me/${rawNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings, openWhatsAppChat }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
