import { createWorker } from "tesseract.js";
import { ProfileTheme } from "../types";

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
  };
  rawText?: string;
  confidence?: number;
  engineUsed: "gemini_vision" | "smart_ocr";
}

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Tanger", "Fès", "Fes", "Agadir",
  "Meknès", "Meknes", "Oujda", "Kénitra", "Kenitra", "Tétouan", "Tetouan",
  "Safi", "Mohammédia", "Mohammedia", "Khouribga", "El Jadida", "Béni Mellal",
  "Nador", "Taza", "Settat", "Berrechid", "Dakhla", "Laâyoune", "Essaouira"
];

const JOB_KEYWORDS: Record<string, { category: string; theme: ProfileTheme }> = {
  "avocat": { category: "Avocat & Notaire", theme: "luxury_gold" },
  "notaire": { category: "Avocat & Notaire", theme: "luxury_gold" },
  "juriste": { category: "Avocat & Notaire", theme: "luxury_gold" },
  "docteur": { category: "Médical & Santé", theme: "emerald_corporate" },
  "dr.": { category: "Médical & Santé", theme: "emerald_corporate" },
  "dr ": { category: "Médical & Santé", theme: "emerald_corporate" },
  "médecin": { category: "Médical & Santé", theme: "emerald_corporate" },
  "medecin": { category: "Médical & Santé", theme: "emerald_corporate" },
  "dentiste": { category: "Médical & Santé", theme: "emerald_corporate" },
  "chirurgien": { category: "Médical & Santé", theme: "emerald_corporate" },
  "pharmacien": { category: "Médical & Santé", theme: "emerald_corporate" },
  "architecte": { category: "Architecture & Design", theme: "slate_tech" },
  "designer": { category: "Architecture & Design", theme: "slate_tech" },
  "décorateur": { category: "Architecture & Design", theme: "slate_tech" },
  "immobilier": { category: "Immobilier", theme: "sky_realestate" },
  "promoteur": { category: "Immobilier", theme: "sky_realestate" },
  "directeur": { category: "Freelance & Consultant", theme: "modern_dark" },
  "gérant": { category: "Freelance & Consultant", theme: "modern_dark" },
  "gerant": { category: "Freelance & Consultant", theme: "modern_dark" },
  "fondateur": { category: "Tech & Startup", theme: "modern_dark" },
  "ceo": { category: "Tech & Startup", theme: "modern_dark" },
  "consultant": { category: "Freelance & Consultant", theme: "luxury_gold" },
  "coach": { category: "Coach & Formateur", theme: "warm_restaurant" },
  "formateur": { category: "Coach & Formateur", theme: "warm_restaurant" },
  "restaurant": { category: "Restaurant & Café", theme: "warm_restaurant" },
  "chef": { category: "Restaurant & Café", theme: "warm_restaurant" },
  "café": { category: "Restaurant & Café", theme: "warm_restaurant" },
  "salon": { category: "Beauté & Bien-être", theme: "purple_beauty" },
  "esthétique": { category: "Beauté & Bien-être", theme: "purple_beauty" },
  "coiffeur": { category: "Beauté & Bien-être", theme: "purple_beauty" },
  "ingénieur": { category: "Tech & Startup", theme: "slate_tech" },
  "ingenieur": { category: "Tech & Startup", theme: "slate_tech" },
  "développeur": { category: "Tech & Startup", theme: "slate_tech" },
  "expert": { category: "Finance & Banque", theme: "luxury_gold" },
  "comptable": { category: "Finance & Banque", theme: "luxury_gold" }
};

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

// Client-side OCR + AI Parser
export async function scanCardWithOCR(
  imageSource: string | File,
  onProgress?: (step: string, pct: number) => void
): Promise<ExtractedCardData> {
  onProgress?.("Initialisation de l'IA de vision...", 10);
  const worker = await createWorker(["fra", "eng"]);

  onProgress?.("Lecture optique de la carte de visite...", 40);
  const ret = await worker.recognize(imageSource);
  await worker.terminate();

  onProgress?.("Extraction des entités & coordonnées...", 80);
  const fullText = ret.data.text;
  const lines = fullText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 1);

  let email = "";
  let website = "";
  const phones: string[] = [];
  let city = "Casablanca";
  let address = "";
  let jobTitle = "";
  let category = "Immobilier";
  let theme: ProfileTheme = "luxury_gold";
  let ownerName = "";
  let companyName = "";
  const instagram = "";
  const linkedin = "";
  const facebook = "";
  const tiktok = "";

  // 1. Email extraction
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) email = emailMatch[0].toLowerCase();

  // 2. Website extraction
  const webMatch = fullText.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.(ma|com|net|org|co|fr|io|me)\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i);
  if (webMatch && !webMatch[0].includes("@")) {
    let w = webMatch[0];
    if (!w.startsWith("http")) w = "https://" + w;
    website = w;
  }

  // 3. Phone numbers (Moroccan patterns: +212, 06, 07, 05)
  const phoneRegex = /(?:(?:\+|00)212[\s.-]?|0)[5-7](?:[\s.-]?\d{2}){4}/g;
  let match: RegExpExecArray | null;
  while ((match = phoneRegex.exec(fullText)) !== null) {
    const cp = cleanPhone(match[0]);
    if (!phones.includes(cp)) phones.push(cp);
  }

  // 4. City detection
  for (const c of MOROCCAN_CITIES) {
    const reg = new RegExp(`\\b${c}\\b`, "i");
    if (reg.test(fullText)) {
      city = c;
      break;
    }
  }

  // 5. Job Title & Category detection
  for (const line of lines) {
    const lower = line.toLowerCase();
    for (const [kw, meta] of Object.entries(JOB_KEYWORDS)) {
      if (lower.includes(kw)) {
        jobTitle = line;
        category = meta.category;
        theme = meta.theme;
        break;
      }
    }
    if (jobTitle) break;
  }

  // 6. Name and Company inference
  // Exclude lines with email, website, or phone numbers
  const candidateLines = lines.filter((l) => {
    if (l.includes("@")) return false;
    if (/(?:www\.|\.ma|\.com|\.net)/i.test(l)) return false;
    if (/\d{4,}/.test(l)) return false;
    if (l.length < 3 || l.length > 50) return false;
    return true;
  });

  if (candidateLines.length > 0) {
    // Top line is often company or owner
    ownerName = candidateLines[0];
    if (candidateLines.length > 1) {
      // If line contains company indicator or second line
      if (/(?:sarl|sa|group|agence|cabinet|studio|company|centre)/i.test(candidateLines[0])) {
        companyName = candidateLines[0];
        ownerName = candidateLines[1];
      } else {
        companyName = candidateLines[1];
      }
    }
  }

  // Clean ownerName (remove Dr, etc. if attached)
  if (ownerName.toLowerCase().startsWith("dr ") || ownerName.toLowerCase().startsWith("dr. ")) {
    if (!jobTitle) jobTitle = "Docteur";
  }

  // Address
  const addrLine = lines.find((l) =>
    /(?:rue|bd|boulevard|av|avenue|angle|imm|residence|résidence|n°|nº|etage|étage)/i.test(l)
  );
  if (addrLine) address = addrLine;

  const phone = phones[0] || "+212 6 ";
  const whatsapp = phones.find((p) => p.startsWith("+2126") || p.startsWith("+2127")) || phone;
  const slug = slugify(ownerName || companyName || "profil");

  const bio = ownerName
    ? `${jobTitle || "Professionnel"} chez ${companyName || "mon entreprise"}${city ? ` à ${city}` : ""}. Bienvenue sur mon profil digital.`
    : "Bienvenue sur mon profil digital connecté NFcard.";

  onProgress?.("Terminé !", 100);

  return {
    ownerName: ownerName || "Professionnel",
    companyName: companyName || "Entreprise",
    jobTitle: jobTitle || "Directeur",
    phone,
    whatsapp,
    email,
    website,
    city,
    address,
    bio,
    category,
    theme,
    slug: slug || "nouveau-profil",
    socials: {
      instagram: instagram || undefined,
      linkedin: linkedin || undefined,
      facebook: facebook || undefined,
      tiktok: tiktok || undefined
    },
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
  // If no key provided, check localStorage
  const apiKey = geminiApiKey || localStorage.getItem("nfcard_gemini_api_key") || "";

  if (!apiKey) {
    // Fall back to OCR
    return scanCardWithOCR(imageSource, onProgress);
  }

  onProgress?.("Préparation de l'image pour l'IA Gemini...", 20);

  // Convert File or URL to base64
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
    // If it's a relative URL from our uploads or external URL
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

  onProgress?.("Analyse multimodale par Google Gemini AI...", 60);

  const prompt = `You are an expert AI business card analyzer for Morocco and international professionals.
Analyze this image of a business card (carte de visite) and extract all contact and professional information.

Return ONLY a valid JSON object without any markdown wrapping or backticks with this exact structure:
{
  "ownerName": "Full name of person (e.g. Dr. Karim Bennani)",
  "companyName": "Company or business name",
  "jobTitle": "Job title or profession (e.g. Avocat, Chirurgien Dentiste, CEO)",
  "phone": "Phone number with international country code (e.g. +212 6 XX XX XX XX)",
  "whatsapp": "WhatsApp number with international country code (e.g. +212 6 XX XX XX XX)",
  "email": "Email address",
  "website": "Full website URL starting with https://",
  "city": "City name in Morocco or international (e.g. Casablanca)",
  "address": "Full physical address if present",
  "bio": "A professional 1-2 sentence bio in French based on their title and company",
  "category": "One of: Immobilier, Restaurant & Café, Médical & Santé, Avocat & Notaire, Architecture & Design, Beauté & Bien-être, Coach & Formateur, Freelance & Consultant, Tech & Startup, Commerce & Retail, Association & ONG, Artiste & Créatif, Finance & Banque, Autre",
  "theme": "One of: luxury_gold, modern_dark, emerald_corporate, warm_restaurant, purple_beauty, sky_realestate, slate_tech, minimal_light",
  "slug": "url-friendly-slug-based-on-person-name",
  "socials": {
    "instagram": "https://instagram.com/... or empty",
    "facebook": "https://facebook.com/... or empty",
    "linkedin": "https://linkedin.com/in/... or empty",
    "tiktok": "https://tiktok.com/@... or empty",
    "twitter": "https://x.com/... or empty"
  }
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
      console.warn("Gemini API error, falling back to OCR");
      return scanCardWithOCR(imageSource, onProgress);
    }

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOutput) throw new Error("Empty Gemini response");

    const parsed = JSON.parse(textOutput.trim());
    onProgress?.("Analyse IA terminée avec succès !", 100);

    return {
      ownerName: parsed.ownerName || "Professionnel",
      companyName: parsed.companyName || "Entreprise",
      jobTitle: parsed.jobTitle || "Directeur",
      phone: parsed.phone || "+212 6 ",
      whatsapp: parsed.whatsapp || parsed.phone || "+212 6 ",
      email: parsed.email || "",
      website: parsed.website || "",
      city: parsed.city || "Casablanca",
      address: parsed.address || "",
      bio: parsed.bio || "",
      category: parsed.category || "Immobilier",
      theme: (parsed.theme as ProfileTheme) || "luxury_gold",
      slug: parsed.slug || slugify(parsed.ownerName || "profil"),
      socials: parsed.socials || {},
      confidence: 99,
      engineUsed: "gemini_vision"
    };
  } catch (err) {
    console.warn("Gemini failed, fallback to OCR:", err);
    return scanCardWithOCR(imageSource, onProgress);
  }
}
