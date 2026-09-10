import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "fr" | "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    "nav.home": "Accueil",
    "nav.products": "Nos Cartes NFC",
    "nav.services": "Services",
    "nav.packages": "Packs Métiers",
    "nav.howItWorks": "Comment ça marche",
    "nav.templates": "Modèles de Profils",
    "nav.demo": "Démo Interactive",
    "nav.contact": "Contact",
    "nav.order": "Commander",
    "nav.admin": "Administration",
    "hero.badge": "🇲🇦 La 1ère Solution NFC & Profils Digitaux au Maroc",
    "hero.title": "Votre carte de visite.",
    "hero.titleHighlight": "Maintenant intelligente.",
    "hero.subtitle": "Présentez votre activité, partagez vos coordonnées et développez votre présence digitale avec une seule carte connectée sans contact.",
    "hero.ctaPrimary": "Créer ma carte",
    "hero.ctaSecondary": "Découvrir nos produits",
    "hero.whatsapp": "Commander sur WhatsApp",
    "hero.talk": "Parler avec nous",
    "hero.quote": "Demander un devis",
    "oldCard.title": "Vous avez déjà votre ancienne carte de visite ?",
    "oldCard.desc": "Envoyez-nous une photo de votre ancienne carte de visite et nous nous occupons de transformer vos informations en une carte digitale professionnelle.",
    "oldCard.cta": "Créer ma carte digitale",
    "features.noApp": "Sans aucune application requise",
    "features.compatible": "100% Compatible iPhone & Android",
    "features.instant": "Partage en 1 seconde par simple tap",
    "features.unlimited": "Mises à jour illimitées de vos infos"
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.products": "بطاقات NFC",
    "nav.services": "خدماتنا",
    "nav.packages": "باقات المهن",
    "nav.howItWorks": "كيف تعمل",
    "nav.templates": "نماذج الملفات",
    "nav.demo": "تجربة تفاعلية",
    "nav.contact": "اتصل بنا",
    "nav.order": "اطلب الآن",
    "nav.admin": "لوحة التحكم",
    "hero.badge": "🇲🇦 الحل الأول لبطاقات NFC والملفات الرقمية في المغرب",
    "hero.title": "بطاقة عملك.",
    "hero.titleHighlight": "أصبحت ذكية الآن.",
    "hero.subtitle": "قدّم نشاطك التجاري، شارك أرقامك وحساباتك، وطوّر حضورك الرقمي بلمسة واحدة بدون تلامس.",
    "hero.ctaPrimary": "أنشئ بطاقتي",
    "hero.ctaSecondary": "اكتشف منتجاتنا",
    "hero.whatsapp": "طلب عبر واتساب",
    "hero.talk": "تحدث معنا",
    "hero.quote": "طلب تسعيرة",
    "oldCard.title": "هل لديك بطاقة عمل ورقية قديمة بالفعل؟",
    "oldCard.desc": "أرسل لنا صورة لبطاقتك الورقية وسنتكفل بتحويل كافة معلوماتك إلى بطاقة رقمية احترافية بالكامل.",
    "oldCard.cta": "أنشئ بطاقتي الرقمية",
    "features.noApp": "بدون الحاجة لأي تطبيق",
    "features.compatible": "متوافق 100% مع آيفون وأندرويد",
    "features.instant": "مشاركة فورية بلمسة واحدة",
    "features.unlimited": "تعديل غير محدود لمعلوماتك"
  },
  en: {
    "nav.home": "Home",
    "nav.products": "NFC Cards",
    "nav.services": "Services",
    "nav.packages": "Business Packs",
    "nav.howItWorks": "How It Works",
    "nav.templates": "Templates",
    "nav.demo": "Live Demo",
    "nav.contact": "Contact",
    "nav.order": "Order Now",
    "nav.admin": "Admin",
    "hero.badge": "🇲🇦 #1 NFC Cards & Digital Business Profiles in Morocco",
    "hero.title": "Your business card.",
    "hero.titleHighlight": "Now intelligent.",
    "hero.subtitle": "Showcase your business, share your contacts instantly, and elevate your digital brand with a single contactless tap.",
    "hero.ctaPrimary": "Create My Card",
    "hero.ctaSecondary": "Explore Products",
    "hero.whatsapp": "Order on WhatsApp",
    "hero.talk": "Chat with Us",
    "hero.quote": "Request a Quote",
    "oldCard.title": "Already have an old paper business card?",
    "oldCard.desc": "Send us a picture of your old business card and our team will turn your information into a complete professional digital profile.",
    "oldCard.cta": "Create My Digital Card",
    "features.noApp": "No app required",
    "features.compatible": "100% Compatible iPhone & Android",
    "features.instant": "Instant 1-tap contact sharing",
    "features.unlimited": "Unlimited real-time profile updates"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  t: (k) => k,
  isRtl: false
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("nfc_lang") as Language;
    return saved || "fr";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("nfc_lang", lang);
    if (lang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  };

  useEffect(() => {
    if (language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["fr"]?.[key] || key;
  };

  const isRtl = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
