import { Router, Request, Response } from "express";
import QRCode from "qrcode";
import { store } from "../services/store";
import { requireAdminAuth } from "../middleware/auth";
import { generateVCard } from "../utils/vcard";

const router = Router();

// Public: Verify access password for a protected profile
router.post("/:slug/verify-password", (req: Request, res: Response) => {
  const { password } = req.body;
  const profile = store.getProfileBySlug(req.params.slug);
  if (!profile) {
    res.status(404).json({ success: false, message: "Profil introuvable." });
    return;
  }

  if (!profile.isProtected || !profile.accessPassword) {
    res.json({ success: true, valid: true, message: "Profil public" });
    return;
  }

  const cleanInput = (password || "").trim().toUpperCase();
  const cleanPass = (profile.accessPassword || "").trim().toUpperCase();

  if (cleanInput === cleanPass || cleanInput === cleanPass.replace("TK-", "")) {
    res.json({ success: true, valid: true, message: "Mot de passe correct" });
  } else {
    res.status(401).json({ success: false, valid: false, message: "Code d'accès incorrect." });
  }
});


// Public: Get profile by slug
router.get("/:slug", (req: Request, res: Response) => {
  const profile = store.getProfileBySlug(req.params.slug);
  if (!profile) {
    res.status(404).json({ success: false, message: "Profil digital non trouvé ou inactif." });
    return;
  }

  // Increment view
  store.incrementProfileMetric(profile.slug, "views");

  res.json({ success: true, data: profile });
});

// Public: Download vCard
router.get("/:slug/vcard", (req: Request, res: Response) => {
  const profile = store.getProfileById(req.params.slug);
  if (!profile) {
    res.status(404).json({ success: false, message: "Profil introuvable." });
    return;
  }

  store.incrementProfileMetric(profile.slug, "vcard");

  const siteUrl = process.env.SITE_URL || "http://localhost:5173";
  const vcardContent = generateVCard(profile, siteUrl);

  const cleanName = profile.ownerName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  res.setHeader("Content-Type", "text/vcard; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${cleanName}-contact.vcf"`);
  res.send(vcardContent);
});

// Public: Generate QR Code data URL
router.get("/:slug/qrcode", async (req: Request, res: Response) => {
  const profile = store.getProfileById(req.params.slug);
  if (!profile) {
    res.status(404).json({ success: false, message: "Profil introuvable." });
    return;
  }

  const siteUrl = process.env.SITE_URL || "http://localhost:5173";
  const targetUrl = `${siteUrl}/p/${profile.slug}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff"
      }
    });

    res.json({ success: true, dataUrl: qrDataUrl, targetUrl });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Erreur lors de la génération du QR Code." });
  }
});

// Admin: Get all profiles
router.get("/", requireAdminAuth, (req: Request, res: Response) => {
  const profiles = store.getProfiles();
  res.json({ success: true, data: profiles });
});

// Admin: Create profile
router.post("/", requireAdminAuth, (req: Request, res: Response) => {
  const {
    slug,
    ownerName,
    companyName,
    jobTitle,
    bio,
    category,
    avatarUrl,
    coverUrl,
    logoUrl,
    theme,
    phone,
    whatsapp,
    email,
    website,
    address,
    city,
    googleMapsUrl,
    socials,
    services,
    portfolio,
    openingHours,
    isActive
  } = req.body;

  if (!slug || !ownerName) {
    res.status(400).json({ success: false, message: "Le slug et le nom du titulaire sont obligatoires." });
    return;
  }

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const existing = store.getProfileById(cleanSlug);
  if (existing) {
    res.status(400).json({ success: false, message: "Un profil avec ce slug existe déjà." });
    return;
  }

  const newProfile = store.createProfile({
    slug: cleanSlug,
    ownerName,
    companyName: companyName || "",
    jobTitle: jobTitle || "",
    bio: bio || "",
    category: category || "Général",
    avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
    coverUrl,
    logoUrl,
    theme: theme || "luxury_gold",
    phone: phone || "",
    whatsapp: whatsapp || phone || "",
    email: email || "",
    website,
    address,
    city: city || "Casablanca",
    googleMapsUrl,
    socials: socials || {},
    services: Array.isArray(services) ? services : [],
    portfolio: Array.isArray(portfolio) ? portfolio : [],
    openingHours,
    isActive: isActive !== undefined ? Boolean(isActive) : true
  });

  res.status(201).json({ success: true, data: newProfile });
});

// Admin: Update profile
router.put("/:slug", requireAdminAuth, (req: Request, res: Response) => {
  const updated = store.updateProfile(req.params.slug, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: "Profil non trouvé." });
    return;
  }
  res.json({ success: true, data: updated });
});

// Admin: Delete profile
router.delete("/:slug", requireAdminAuth, (req: Request, res: Response) => {
  const deleted = store.deleteProfile(req.params.slug);
  if (!deleted) {
    res.status(404).json({ success: false, message: "Profil non trouvé." });
    return;
  }
  res.json({ success: true, message: "Profil supprimé avec succès." });
});

export default router;
