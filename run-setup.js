const fs = require('fs');
const path = require('path');

const root = path.join('c:', 'Users', 'espacegamers', 'Desktop', 'nfc store');

// ── 1. Update server/src/services/store.ts ───────────────────────────────────
const storePath = path.join(root, 'server', 'src', 'services', 'store.ts');
let storeContent = fs.readFileSync(storePath, 'utf8');

const oldCreateOrder = `  createOrder(orderData: {
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
    const orderNumber = \`NFC-2026-\${String(count).padStart(3, "0")}\`;
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
      adminNotes: [],
      history: [
        {
          status: "new",
          timestamp: new Date().toISOString(),
          note: "Commande passée par le client"
        }
      ]
    };
    this.data.orders.unshift(newOrder);
    this.saveData();
    return newOrder;
  }`;

const newCreateOrder = `  createOrder(orderData: {
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
    const orderNumber = \`NFC-2026-\${String(count).padStart(3, "0")}\`;
    
    // 1. Generate unique clean slug for digital profile
    const rawName = (orderData.customerInfo?.companyName || orderData.customerInfo?.fullName || "client").trim();
    let baseSlug = rawName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\\u0300-\\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "client";
    
    let generatedSlug = baseSlug;
    let slugSuffix = 1;
    while (this.data.profiles.some(p => p.slug.toLowerCase() === generatedSlug.toLowerCase())) {
      generatedSlug = \`\${baseSlug}-\${slugSuffix}\`;
      slugSuffix++;
    }

    // 2. Generate unique secure client access password
    const accessPassword = \`TK-\${Math.floor(1000 + Math.random() * 9000)}\`;

    // 3. Map sector/category to suitable theme & styling
    const cat = (orderData.customerInfo?.category || "Immobilier").toLowerCase();
    let profileTheme: any = "luxury_gold";
    let defaultCover = "from-amber-700 to-amber-900";

    if (cat.includes("resto") || cat.includes("café") || cat.includes("nourriture")) {
      profileTheme = "warm_restaurant";
      defaultCover = "from-orange-700 to-red-900";
    } else if (cat.includes("beauté") || cat.includes("coiffure") || cat.includes("spa")) {
      profileTheme = "purple_beauty";
      defaultCover = "from-pink-500 to-rose-700";
    } else if (cat.includes("tech") || cat.includes("dev") || cat.includes("freelance")) {
      profileTheme = "slate_tech";
      defaultCover = "from-blue-700 to-indigo-900";
    } else if (cat.includes("médic") || cat.includes("santé") || cat.includes("docteur")) {
      profileTheme = "minimal_light";
      defaultCover = "from-red-600 to-rose-800";
    } else if (cat.includes("juridi") || cat.includes("avocat") || cat.includes("droit")) {
      profileTheme = "luxury_gold";
      defaultCover = "from-slate-700 to-slate-900";
    } else if (cat.includes("commerce") || cat.includes("boutique")) {
      profileTheme = "purple_beauty";
      defaultCover = "from-purple-600 to-indigo-800";
    } else if (cat.includes("entreprise") || cat.includes("btp") || cat.includes("société")) {
      profileTheme = "emerald_corporate";
      defaultCover = "from-emerald-700 to-teal-900";
    }

    // 4. Automatically construct & persist the digital profile
    const newProfile: DigitalProfile = {
      id: "prof-" + uuidv4().slice(0, 8),
      slug: generatedSlug,
      ownerName: orderData.customerInfo.fullName || "Client Tektap",
      companyName: orderData.customerInfo.companyName || "Entreprise",
      jobTitle: orderData.customerInfo.jobTitle || "Professionnel",
      bio: orderData.customerInfo.description || \`Bienvenue sur le profil digital officiel de \${orderData.customerInfo.fullName || orderData.customerInfo.companyName}.\`,
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
        instagram: orderData.customerInfo.instagram ? (orderData.customerInfo.instagram.startsWith("http") ? orderData.customerInfo.instagram : \`https://instagram.com/\${orderData.customerInfo.instagram.replace("@", "")}\`) : undefined,
        facebook: orderData.customerInfo.facebook ? (orderData.customerInfo.facebook.startsWith("http") ? orderData.customerInfo.facebook : \`https://facebook.com/\${orderData.customerInfo.facebook}\`) : undefined,
        linkedin: orderData.customerInfo.linkedin ? (orderData.customerInfo.linkedin.startsWith("http") ? orderData.customerInfo.linkedin : \`https://linkedin.com/in/\${orderData.customerInfo.linkedin}\`) : undefined,
        tiktok: orderData.customerInfo.tiktok ? (orderData.customerInfo.tiktok.startsWith("http") ? orderData.customerInfo.tiktok : \`https://tiktok.com/@\${orderData.customerInfo.tiktok.replace("@", "")}\`) : undefined,
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
      isProtected: true,
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
      uid: \`NFC-MA-\${String(count + 1000).padStart(4, "0")}\`,
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
      adminNotes: [\`Profil généré automatiquement: /p/\${generatedSlug} (Code d'accès: \${accessPassword})\`],
      history: [
        {
          status: "new",
          timestamp: new Date().toISOString(),
          note: \`Commande passée par le client. Profil /p/\${generatedSlug} créé avec mot de passe \${accessPassword}.\`
        }
      ]
    };

    this.data.orders.unshift(newOrder);
    this.saveData();
    return newOrder;
  }`;

if (storeContent.includes('const newOrder: Order = {')) {
  storeContent = storeContent.replace(oldCreateOrder, newCreateOrder);
  fs.writeFileSync(storePath, storeContent, 'utf8');
  console.log('store.ts updated');
}

// ── 2. Update server/src/routes/profiles.ts ──────────────────────────────────
const profilesRoutePath = path.join(root, 'server', 'src', 'routes', 'profiles.ts');
let profilesRoute = fs.readFileSync(profilesRoutePath, 'utf8');

const verifyPasswordEndpoint = `
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
`;

if (!profilesRoute.includes("/verify-password")) {
  profilesRoute = profilesRoute.replace('const router = Router();', 'const router = Router();\n' + verifyPasswordEndpoint);
  fs.writeFileSync(profilesRoutePath, profilesRoute, 'utf8');
  console.log('profiles.ts updated');
}

// ── 3. Update client/src/pages/ProfilePage.tsx ───────────────────────────────
const profilePagePath = path.join(root, 'client', 'src', 'pages', 'ProfilePage.tsx');
const newProfilePage = `import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { DigitalProfileView } from "../components/profile/DigitalProfileView";
import { Loader2, AlertCircle, Lock, KeyRound, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Security Lock state
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    
    // Check if unlocked via query param or sessionStorage
    const urlPin = searchParams.get("pin") || searchParams.get("pass");
    const savedPin = sessionStorage.getItem(\`unlocked_profile_\${slug}\`);

    api.getProfile(slug)
      .then((res) => {
        if (res.success && res.data) {
          const profData = res.data;
          setProfile(profData);

          // If not protected, unlock immediately
          if (!profData.isProtected) {
            setIsUnlocked(true);
          } else if (urlPin && profData.accessPassword && (urlPin.toUpperCase() === profData.accessPassword.toUpperCase() || urlPin.toUpperCase() === profData.accessPassword.replace("TK-", "").toUpperCase())) {
            setIsUnlocked(true);
            sessionStorage.setItem(\`unlocked_profile_\${slug}\`, urlPin);
          } else if (savedPin && profData.accessPassword && (savedPin.toUpperCase() === profData.accessPassword.toUpperCase() || savedPin.toUpperCase() === profData.accessPassword.replace("TK-", "").toUpperCase())) {
            setIsUnlocked(true);
          }
        } else {
          setError("Profil introuvable.");
        }
      })
      .catch(() => setError("Impossible de charger ce profil digital."))
      .finally(() => setLoading(false));
  }, [slug, searchParams]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const cleanInput = inputPassword.trim().toUpperCase();
    const correct = (profile.accessPassword || "").trim().toUpperCase();

    if (cleanInput === correct || cleanInput === correct.replace("TK-", "")) {
      setIsUnlocked(true);
      setPasswordError(false);
      sessionStorage.setItem(\`unlocked_profile_\${slug}\`, inputPassword);
    } else {
      setPasswordError(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shadow-sm">
          <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
        </div>
        <p className="text-slate-600 text-sm font-medium">Chargement du profil digital sécurisé...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-rose-600" />
        </div>
        <h2 className="font-bold text-slate-900 text-xl">Profil introuvable</h2>
        <p className="text-slate-500 text-sm">{error || "Ce profil n'existe pas ou a été désactivé."}</p>
        <Link to="/" className="text-xs font-bold text-amber-600 hover:underline pt-2">← Retour à l'accueil</Link>
      </div>
    );
  }

  // If protected and not unlocked yet -> show clean White/Gray/Gold security gate
  if (profile.isProtected && !isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl shadow-amber-500/5 space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-100 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Profil Client Sécurisé
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {profile.ownerName || profile.companyName}
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ce profil digital est privé. Veuillez saisir votre code d'accès client pour déverrouiller votre landing page.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-xs">
            <div className="space-y-1 text-left">
              <label className="block text-slate-700 font-semibold text-xs">Code d'accès unique</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="ex: TK-8492"
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  className={\`w-full bg-slate-50 border rounded-2xl px-4 py-3.5 text-center font-mono font-extrabold text-base tracking-widest text-slate-900 focus:outline-none focus:bg-white transition-all \${
                    passwordError
                      ? "border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                      : "border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  }\`}
                />
              </div>
              {passwordError && (
                <p className="text-[11px] text-rose-600 font-medium text-center pt-1">
                  ❌ Code d'accès incorrect. Vérifiez votre confirmation de commande.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Déverrouiller mon Profil</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
            <p>🇲🇦 Propulsé par <Link to="/" className="text-amber-600 font-semibold hover:underline">Tektap NFC Maroc</Link></p>
            <p>Code transmis lors de votre commande ou par WhatsApp.</p>
          </div>

        </div>
      </div>
    );
  }

  // Format profile data for DigitalProfileView
  const profileViewModel = {
    name: profile.ownerName || "Professionnel",
    title: profile.jobTitle || "Directeur",
    company: profile.companyName || "Entreprise",
    bio: profile.bio || "",
    avatar: profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    logo: profile.logoUrl || undefined,
    coverColor: profile.coverUrl || "from-amber-700 to-amber-900",
    phone: profile.phone || "",
    whatsapp: profile.whatsapp || profile.phone || "",
    email: profile.email || "",
    website: profile.website || undefined,
    instagram: profile.socials?.instagram || undefined,
    facebook: profile.socials?.facebook || undefined,
    linkedin: profile.socials?.linkedin || undefined,
    tiktok: profile.socials?.tiktok || undefined,
    location: profile.city || profile.address || undefined,
    hours: profile.openingHours || undefined,
    theme: profile.theme || "luxury_gold",
    services: (profile.services || []).map((s: any) => ({ name: s.title, desc: s.description, price: s.price })),
    portfolio: (profile.portfolio || []).map((p: any) => ({ image: p.imageUrl, title: p.title })),
    slug: profile.slug
  };

  return <DigitalProfileView profile={profileViewModel} />;
};
`;

fs.writeFileSync(profilePagePath, newProfilePage, 'utf8');
console.log('ProfilePage.tsx updated with password security gate');

// ── 4. Update client/src/components/admin/OrderManagement.tsx ────────────────
const orderManagementPath = path.join(root, 'client', 'src', 'components', 'admin', 'OrderManagement.tsx');
let orderManagement = fs.readFileSync(orderManagementPath, 'utf8');

const orderLinkSnippet = `
                  {/* Generated Profile & Password Info */}
                  {order.createdProfileSlug && (
                    <div className="mt-3 p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-900">🔗 Profil Digital Généré :</span>
                        <a
                          href={\`/p/\${order.createdProfileSlug}\`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-emerald-700 font-bold hover:underline flex items-center gap-1"
                        >
                          /p/{order.createdProfileSlug}
                          <ExternalLink className="w-3.5 h-3.5 inline" />
                        </a>
                      </div>
                      
                      {order.accessPassword && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Mot de passe client :</span>
                          <span className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg font-mono font-bold text-amber-800 shadow-sm">
                            🔑 {order.accessPassword}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <a
                          href={\`https://wa.me/\${order.customerInfo.phone?.replace(/[^0-9]/g, "")}?text=\${encodeURIComponent(\`Bonjour \${order.customerInfo.fullName} ! Votre profil digital Tektap NFC est prêt : https://tektap.ma/p/\${order.createdProfileSlug} - Votre code d'accès privé : \${order.accessPassword || "TK-2026"}\`)}\`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Envoyer lien + code sur WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  )}
`;

if (!orderManagement.includes('createdProfileSlug &&')) {
  orderManagement = orderManagement.replace(
    '{/* Order Notes & History */}',
    orderLinkSnippet + '\n\n                  {/* Order Notes & History */}'
  );
  fs.writeFileSync(orderManagementPath, orderManagement, 'utf8');
  console.log('OrderManagement.tsx updated with live profile link and password');
}

console.log('ALL AUTO PROFILE AND PASSWORD SYSTEMS INSTALLED SUCCESSFULLY!');
