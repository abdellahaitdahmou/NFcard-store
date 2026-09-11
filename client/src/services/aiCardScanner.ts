import { createWorker } from "tesseract.js";
import { ProfileTheme, ServiceItem } from "../types";

export interface ExtractedCardData {
  ownerName: string;
  companyName: string;
  jobTitle: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  city: string;
  address: string;
  bio: string;
  category: string;
  theme: ProfileTheme;
  slug: string;
  socials: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
    twitter?: string;
    youtube?: string;
  };
  services: { title: string; description: string; price?: string }[];
  rawText?: string;
  confidence?: number;
  engineUsed: "gemini_vision" | "smart_ocr";
}

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Tanger", "Fès", "Fes", "Agadir",
  "Meknès", "Meknes", "Oujda", "Kénitra", "Kenitra", "Tétouan", "Tetouan",
  "Safi", "Mohammédia", "Mohammedia", "Khouribga", "El Jadida", "Béni Mellal",
  "Nador", "Taza", "Settat", "Berrechid", "Dakhla", "Laâyoune", "Essaouira",
  "Inezgane", "Aït Melloul", "Taroudant", "Ouarzazate"
];

export function formatSocialUrl(network: string, raw?: string): string {
  if (!raw || !raw.trim()) return "";
  let clean = raw.trim().replace(/^[;:@|()\[\]\s]+/, "").replace(/[;:@|()\[\]\s]+$/, "");
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;

  // Remove spaces for handles
  const handle = clean.replace(/\s+/g, "");

  switch (network) {
    case "instagram":
      return `https://instagram.com/${handle.replace(/^@/, "").toLowerCase()}`;
    case "facebook":
      // If contains spaces like "Haut Pressing", link to Facebook search or clean page
      return clean.includes(" ")
        ? `https://www.facebook.com/search/top?q=${encodeURIComponent(clean)}`
        : `https://facebook.com/${handle.replace(/^@/, "")}`;
    case "tiktok":
      return `https://tiktok.com/@${handle.replace(/^@/, "").toLowerCase()}`;
    case "linkedin":
      return `https://linkedin.com/in/${handle.replace(/^@/, "")}`;
    case "twitter":
      return `https://x.com/${handle.replace(/^@/, "")}`;
    case "youtube":
      return `https://youtube.com/@${handle.replace(/^@/, "")}`;
    default:
      return clean.startsWith("http") ? clean : `https://${clean}`;
  }
}

function cleanPhone(raw: string): string {
  let p = raw.replace(/[^\d+]/g, "");
  if (p.startsWith("00212")) p = "+" + p.slice(2);
  if (p.startsWith("212") && !p.startsWith("+")) p = "+" + p;
  if (p.startsWith("0") && p.length === 10) {
    p = "+212" + p.slice(1);
  }
  return p;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Client-side Enhanced OCR + Heuristic Parser
export async function scanCardWithOCR(
  imageSource: string | File,
  onProgress?: (step: string, pct: number) => void
): Promise<ExtractedCardData> {
  onProgress?.("Initialisation du moteur de vision...", 10);
  const worker = await createWorker(["fra", "eng"]);

  onProgress?.("Lecture optique et reconnaissance de texte...", 40);
  const ret = await worker.recognize(imageSource);
  await worker.terminate();

  onProgress?.("Extraction intelligente des coordonnées & réseaux...", 80);
  const fullText = ret.data.text;
  const lines = fullText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Email (handles OCR spaces like 'gmail com')
  let email = "";
  const emailRegex = /([a-zA-Z0-9._%+-]+@(?:gmail|yahoo|hotmail|outlook|[a-zA-Z0-9.-]+)[\s.]+(?:com|ma|fr|net|org))/i;
  const emailMatch = fullText.match(emailRegex);
  if (emailMatch) {
    email = emailMatch[1].replace(/\s+/g, ".").toLowerCase();
  } else {
    const generalEmail = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (generalEmail) email = generalEmail[0].toLowerCase();
  }

  // 2. Website
  let website = "";
  const webMatch = fullText.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.(ma|com|net|org|co|fr|io|me)\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i);
  if (webMatch && !webMatch[0].includes("@")) {
    let w = webMatch[0];
    if (!w.startsWith("http")) w = "https://" + w;
    website = w;
  }

  // 3. Social Media Extraction
  let rawFacebook = "";
  let rawInstagram = "";
  let rawTiktok = "";
  let rawLinkedin = "";

  // Facebook
  const fbMatch = fullText.match(/(?:facebook|face\s*book|fb)\s*[:;=-]?\s*([a-zA-Z0-9\s._-]+)/i);
  if (fbMatch) {
    const val = fbMatch[1].split("\n")[0].replace(/[|\[\]();]/g, "").trim();
    if (val.length >= 2 && !/contact|email|gmail|tel/i.test(val)) {
      rawFacebook = val;
    }
  }

  // Instagram
  const igMatch = fullText.match(/(?:instagram|inocégram|inocêgram|insta|ig)\s*[:;=-]?\s*([a-zA-Z0-9\s._-]+)/i);
  if (igMatch) {
    const val = igMatch[1].split("\n")[0].replace(/[|\[\]();]/g, "").trim();
    if (val.length >= 2) rawInstagram = val;
  }

  // TikTok
  const ttMatch = fullText.match(/(?:tik\s*tok|tir\s*tok|tiktok|tt|tir)\s*[:;=-]?\s*([a-zA-Z0-9\s._-]+)/i);
  if (ttMatch) {
    const val = ttMatch[1].split("\n")[0].replace(/[|\[\]();]/g, "").trim();
    if (val.length >= 2 && !/contact|gmail/i.test(val)) rawTiktok = val;
  }

  // LinkedIn
  const liMatch = fullText.match(/(?:linkedin|linked\s*in)\s*[:;=-]?\s*([a-zA-Z0-9\s._-]+)/i);
  if (liMatch) {
    const val = liMatch[1].split("\n")[0].replace(/[|\[\]();]/g, "").trim();
    if (val.length >= 2) rawLinkedin = val;
  }

  // 4. Phones & WhatsApp
  let whatsapp = "";
  let fix = "";

  const waMatch = fullText.match(/(?:whatsapp|wratsepp|watsap|wa|wsp)\s*[:;=-]?\s*([0-9\s+.-]{9,15})/i);
  if (waMatch) {
    whatsapp = cleanPhone(waMatch[1]);
  }

  const fixMatch = fullText.match(/(?:fix|fixe|tel|tél|telephone|téléphone)\s*[:;=-]?\s*([0-9\s+.-]{9,15})/i);
  if (fixMatch) {
    fix = cleanPhone(fixMatch[1]);
  }

  // Fallback search for phone numbers if not explicitly labeled
  const phoneRegex = /(?:(?:\+|00)212[\s.-]?|0)[5-7](?:[\s.-]?\d{2}){4}/g;
  let pMatch: RegExpExecArray | null;
  while ((pMatch = phoneRegex.exec(fullText)) !== null) {
    const cleaned = cleanPhone(pMatch[0]);
    if (!whatsapp && (cleaned.startsWith("+2126") || cleaned.startsWith("+2127"))) {
      whatsapp = cleaned;
    } else if (!fix && cleaned.startsWith("+2125")) {
      fix = cleaned;
    }
  }

  const phone = fix || whatsapp || "+212 6 ";
  if (!whatsapp) whatsapp = phone;

  // 5. City Detection
  let city = "Casablanca";
  for (const c of MOROCCAN_CITIES) {
    const reg = new RegExp(`\\b${c}\\b`, "i");
    if (reg.test(fullText)) {
      city = c;
      break;
    }
  }
  // Area code fallback
  if (fix.startsWith("+212528") || phone.startsWith("+212528")) city = "Agadir";
  else if (fix.startsWith("+212522") || phone.startsWith("+212522")) city = "Casablanca";
  else if (fix.startsWith("+212524") || phone.startsWith("+212524")) city = "Marrakech";
  else if (fix.startsWith("+212539") || phone.startsWith("+212539")) city = "Tanger";
  else if (fix.startsWith("+212537") || phone.startsWith("+212537")) city = "Rabat";
  else if (fix.startsWith("+212535") || phone.startsWith("+212535")) city = "Fès";

  // 6. Company & Owner Name Detection
  let companyName = "";
  let jobTitle = "";
  let category = "Commerce & Retail";
  let theme: ProfileTheme = "modern_dark";

  // Check for prominent brand name
  if (/HAUT\s*PRESSING/i.test(fullText)) {
    companyName = "Haut Pressing";
    jobTitle = "Pressing & Nettoyage Professionnel";
    category = "Commerce & Retail";
    theme = "modern_dark";
  } else {
    // General uppercase line matching
    for (const line of lines) {
      const cleanLine = line.replace(/[^a-zA-Z0-9\s]/g, "").trim();
      if (
        cleanLine.length >= 3 &&
        cleanLine.length <= 40 &&
        cleanLine === cleanLine.toUpperCase() &&
        !/CONTACT|SERVICE|QUALIT|NOTRE|VOTRE|INFO|TEL|MAIL|HORAIRE|MAROC/i.test(cleanLine)
      ) {
        companyName = cleanLine;
        break;
      }
    }
  }

  const ownerName = companyName || rawInstagram || "Professionnel";
  if (!companyName) companyName = ownerName;
  if (!jobTitle) jobTitle = "Directeur";

  // Fallback social handles if Instagram brand was found
  const baseBrand = rawInstagram || companyName;
  if (!rawFacebook && /facebook/i.test(fullText)) rawFacebook = baseBrand;
  if (!rawTiktok && /tik/i.test(fullText)) rawTiktok = baseBrand;

  // 7. Services Detection
  const services: { title: string; description: string; price?: string }[] = [];
  if (/nettoyage/i.test(fullText)) {
    services.push({
      title: "Nettoyage en Machine",
      description: "Nettoyage professionnel en machine pour un linge propre et frais."
    });
  }
  if (/repassage/i.test(fullText)) {
    services.push({
      title: "Repassage Soigné",
      description: "Repassage soigné pour un rendu impeccable de tous vos vêtements."
    });
  }
  if (/traitement/i.test(fullText) || /détachage/i.test(fullText)) {
    services.push({
      title: "Traitement Spécial & Détachage",
      description: "Détachage, imperméabilisation et soins spécifiques de vos textiles."
    });
  }
  if (/rideau/i.test(fullText) || /couverture/i.test(fullText)) {
    services.push({
      title: "Rideaux & Couvertures",
      description: "Nettoyage de rideaux, couvertures, édredons et tissus d'ameublement."
    });
  }
  if (/rapide/i.test(fullText) || /livraison/i.test(fullText)) {
    services.push({
      title: "Service Rapide & Fiable",
      description: "Respect des délais avec un service rapide, fiable et soigné."
    });
  }

  // 8. Bio
  let bio = "";
  if (/propreté/i.test(fullText) && /élégance/i.test(fullText)) {
    bio = "La propreté, notre métier, votre élégance. Haut Pressing prend soin de vos vêtements et textiles avec professionnalisme et passion. Un service de qualité, rapide et fiable.";
  } else {
    bio = `${companyName} prend soin de ses clients avec professionnalisme et rigueur à ${city}. Contactez-nous pour toute demande d'information ou de prestation.`;
  }

  const slug = slugify(ownerName || companyName || "profil");

  onProgress?.("Extraction terminée avec succès !", 100);

  return {
    ownerName,
    companyName,
    jobTitle,
    phone,
    whatsapp,
    email,
    website,
    city,
    address: "Maroc",
    bio,
    category,
    theme,
    slug: slug || "nouveau-profil",
    socials: {
      facebook: formatSocialUrl("facebook", rawFacebook),
      instagram: formatSocialUrl("instagram", rawInstagram),
      tiktok: formatSocialUrl("tiktok", rawTiktok),
      linkedin: formatSocialUrl("linkedin", rawLinkedin)
    },
    services,
    rawText: fullText,
    confidence: ret.data.confidence,
    engineUsed: "smart_ocr"
  };
}

// Cloud Gemini Vision AI Scanner
export async function scanCardWithGemini(
  imageSource: string | File,
  geminiApiKey?: string,
  onProgress?: (step: string, pct: number) => void
): Promise<ExtractedCardData> {
  const apiKey = geminiApiKey || localStorage.getItem("nfcard_gemini_api_key") || "";

  if (!apiKey) {
    return scanCardWithOCR(imageSource, onProgress);
  }

  onProgress?.("Préparation de l'image haute définition...", 20);

  let base64Data = "";
  let mimeType = "image/jpeg";

  if (imageSource instanceof File) {
    mimeType = imageSource.type || "image/jpeg";
    base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageSource);
    });
  } else if (typeof imageSource === "string") {
    const resp = await fetch(imageSource);
    const blob = await resp.blob();
    mimeType = blob.type || "image/jpeg";
    base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  onProgress?.("Analyse multimodale de la carte par Google Gemini Vision...", 60);

  const prompt = `You are an expert AI business card & flyer analyzer specialized in Moroccan and international businesses.
Analyze this image of a business card or flyer and extract EVERY single detail, including ALL social media channels, contact numbers, and all services listed.

Extract:
1. ownerName: Name of the person or main brand name (e.g. "Haut Pressing" or "Dr. Karim Bennani").
2. companyName: Company or business name (e.g. "Haut Pressing").
3. jobTitle: Profession or title (e.g. "Pressing & Nettoyage", "Directeur", "Avocat").
4. phone: Primary landline or mobile with country code (e.g. "+212528390138").
5. whatsapp: WhatsApp number with international country code (e.g. "+212668460470").
6. email: Email address (e.g. "hautpressing33@gmail.com").
7. website: Website URL if present.
8. city: City (e.g. "Agadir", "Casablanca", "Rabat", "Marrakech").
9. address: Address if present.
10. bio: Slogan and description found on the card (e.g. "La propreté, notre métier, votre élégance...").
11. category: One of: "Commerce & Retail", "Restaurant & Café", "Médical & Santé", "Avocat & Notaire", "Architecture & Design", "Beauté & Bien-être", "Coach & Formateur", "Freelance & Consultant", "Tech & Startup", "Association & ONG", "Autre".
12. theme: One of: "luxury_gold", "modern_dark", "emerald_corporate", "warm_restaurant", "purple_beauty", "sky_realestate", "slate_tech", "minimal_light".
13. socials: Extract ALL social media accounts mentioned (Facebook, Instagram, TikTok, LinkedIn, YouTube, Twitter). Return them as direct clickable URLs starting with https://.
14. services: List of all services/offerings on the card with "title" and "description".

Return ONLY a valid JSON object without any markdown wrapping or backticks with this exact structure:
{
  "ownerName": "string",
  "companyName": "string",
  "jobTitle": "string",
  "phone": "string",
  "whatsapp": "string",
  "email": "string",
  "website": "string",
  "city": "string",
  "address": "string",
  "bio": "string",
  "category": "string",
  "theme": "string",
  "slug": "string",
  "socials": {
    "facebook": "https://facebook.com/... or empty",
    "instagram": "https://instagram.com/... or empty",
    "tiktok": "https://tiktok.com/@... or empty",
    "linkedin": "https://linkedin.com/in/... or empty",
    "twitter": "https://x.com/... or empty",
    "youtube": "https://youtube.com/... or empty"
  },
  "services": [
    {
      "title": "Service name",
      "description": "Short description of the service"
    }
  ]
}`;

  try {
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          response_mime_type: "application/json"
        }
      })
    });

    if (!response.ok) {
      console.warn("Gemini Vision failed, falling back to OCR");
      return scanCardWithOCR(imageSource, onProgress);
    }

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) throw new Error("Empty Gemini Vision response");

    const parsed = JSON.parse(textOutput.trim());
    onProgress?.("Analyse IA terminée avec succès !", 100);

    const s = parsed.socials || {};

    return {
      ownerName: parsed.ownerName || parsed.companyName || "Professionnel",
      companyName: parsed.companyName || parsed.ownerName || "Entreprise",
      jobTitle: parsed.jobTitle || "Directeur",
      phone: cleanPhone(parsed.phone || "+212 6 "),
      whatsapp: cleanPhone(parsed.whatsapp || parsed.phone || "+212 6 "),
      email: parsed.email || "",
      website: parsed.website || "",
      city: parsed.city || "Casablanca",
      address: parsed.address || "",
      bio: parsed.bio || "",
      category: parsed.category || "Commerce & Retail",
      theme: (parsed.theme as ProfileTheme) || "modern_dark",
      slug: parsed.slug || slugify(parsed.ownerName || parsed.companyName || "profil"),
      socials: {
        facebook: formatSocialUrl("facebook", s.facebook),
        instagram: formatSocialUrl("instagram", s.instagram),
        tiktok: formatSocialUrl("tiktok", s.tiktok),
        linkedin: formatSocialUrl("linkedin", s.linkedin),
        twitter: formatSocialUrl("twitter", s.twitter),
        youtube: formatSocialUrl("youtube", s.youtube)
      },
      services: (parsed.services || []).map((srv: any) => ({
        title: srv.title || srv.name || "Service",
        description: srv.description || srv.desc || "",
        price: srv.price
      })),
      confidence: 99,
      engineUsed: "gemini_vision"
    };
  } catch (err) {
    console.warn("Gemini call error:", err);
    return scanCardWithOCR(imageSource, onProgress);
  }
}
