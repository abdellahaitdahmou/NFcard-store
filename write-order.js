const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'client', 'src', 'pages', 'OrderPage.tsx');
const code = `import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { Product, BusinessPackage } from "../types";
import { useSettings } from "../contexts/SettingsContext";
import confetti from "canvas-confetti";
import {
  ShoppingBag,
  CreditCard,
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Truck,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  FileCheck2,
  ArrowRight
} from "lucide-react";

export const OrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings, openWhatsAppChat } = useSettings();

  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<BusinessPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection
  const [selectedType, setSelectedType] = useState<"product" | "package">("product");
  const [selectedId, setSelectedId] = useState<string>("prod-business");
  const [quantity, setQuantity] = useState<number>(1);

  // Customer business info fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("+212 ");
  const [whatsapp, setWhatsapp] = useState("+212 ");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("Immobilier");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");
  const [notes, setNotes] = useState("");

  // Uploaded files
  const [oldCardFile, setOldCardFile] = useState<File | null>(null);
  const [oldCardPhotoUrl, setOldCardPhotoUrl] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [uploadingFiles, setUploadingFiles] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, pkgRes] = await Promise.all([api.getProducts(), api.getPackages()]);
        if (pRes.success && pRes.data) setProducts(pRes.data);
        if (pkgRes.success && pkgRes.data) setPackages(pkgRes.data);

        const paramPack = searchParams.get("pack");
        const paramProd = searchParams.get("product");
        if (paramPack) {
          setSelectedType("package");
          const found = pkgRes.data?.find((p) => p.slug === paramPack);
          if (found) setSelectedId(found.id);
        } else if (paramProd) {
          setSelectedType("product");
          const found = pRes.data?.find((p) => p.slug === paramProd);
          if (found) setSelectedId(found.id);
        }
      } catch (e) {
        console.warn("Could not load data for order page");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const currentItem = selectedType === "product"
    ? products.find((p) => p.id === selectedId) || products[0]
    : packages.find((p) => p.id === selectedId) || packages[0];

  const unitPrice = currentItem ? currentItem.price : 349;
  const totalPrice = unitPrice * quantity;
  const deliveryFee = totalPrice >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const finalTotal = totalPrice + deliveryFee;

  const handleOldCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOldCardFile(file);
      setUploadingFiles(true);
      try {
        const res = await api.uploadFile(file);
        if (res.success) setOldCardPhotoUrl(res.fileUrl);
      } catch (err) {
        setOldCardPhotoUrl(URL.createObjectURL(file));
      } finally {
        setUploadingFiles(false);
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setUploadingFiles(true);
      try {
        const res = await api.uploadFile(file);
        if (res.success) setLogoUrl(res.fileUrl);
      } catch (err) {
        setLogoUrl(URL.createObjectURL(file));
      } finally {
        setUploadingFiles(false);
      }
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert("Veuillez saisir votre nom et numéro de téléphone pour la livraison.");
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        productOrPackName: currentItem ? currentItem.name : "NFC Card Business",
        productType: selectedType,
        productId: selectedId,
        quantity,
        unitPrice,
        totalPrice: finalTotal,
        paymentStatus: "cash_on_delivery",
        customerInfo: {
          fullName,
          companyName,
          jobTitle,
          phone,
          whatsapp: whatsapp || phone,
          email,
          city,
          address,
          category,
          website,
          instagram,
          facebook,
          linkedin,
          googleMaps,
          description,
          notes,
          logoUrl,
          oldCardPhotoUrl
        }
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.data) {
        setOrderComplete(res.data);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert("Erreur lors de l'enregistrement de votre commande. Vous pouvez aussi commander directement par WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderComplete) {
    const whatsappOrderText = \`Bonjour Tektap Maroc ! Je viens de passer la commande \${orderComplete.orderNumber} pour \${orderComplete.productOrPackName} (\${orderComplete.totalPrice} DH).\\nNom : \${fullName}\\nVille : \${city}\\nTéléphone : \${phone}\`;

    return (
      <div className="py-20 bg-[#080d1a] min-h-[80vh] flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          <div className="glass-card-emerald rounded-3xl p-8 sm:p-10 border border-emerald-500/40 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Commande N° {orderComplete.orderNumber}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Félicitations {fullName} !
              </h2>
              <p className="text-sm text-slate-300">
                Votre commande a été enregistrée avec succès. Notre équipe va concevoir votre profil digital et préparer votre carte NFC.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Produit sélectionné :</span>
                <span className="font-bold text-white">{orderComplete.productOrPackName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Ville de livraison :</span>
                <span className="font-bold text-white">{city}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Paiement :</span>
                <span className="font-bold text-emerald-400">À la livraison (Cash on Delivery)</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Total à régler :</span>
                <span className="text-amber-400">{orderComplete.totalPrice} DH</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={\`https://wa.me/\${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=\${encodeURIComponent(whatsappOrderText)}\`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-emeraldGlow transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Confirmer ma commande sur WhatsApp</span>
              </a>

              <Link
                to="/"
                className="block text-xs font-semibold text-slate-400 hover:text-white pt-2"
              >
                ← Retourner à l'accueil
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 bg-[#080d1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Formulaire de Commande & Configuration
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Commandez votre Carte NFC & <br />
            <span className="gold-gradient-text">Profil Digital Professionnel.</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Remplissez les informations de votre entreprise ou envoyez-nous simplement une photo de votre ancienne carte.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 space-y-8">
              
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-lg font-bold text-white">Choisissez votre Produit ou Pack Métier</h2>
                </div>

                <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 max-w-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType("product");
                      if (products.length > 0) setSelectedId(products[0].id);
                    }}
                    className={\`flex-1 py-2 rounded-lg text-xs font-bold transition-all \${
                      selectedType === "product" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400"
                    }\`}
                  >
                    Cartes NFC Individuelles
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType("package");
                      if (packages.length > 0) setSelectedId(packages[0].id);
                    }}
                    className={\`flex-1 py-2 rounded-lg text-xs font-bold transition-all \${
                      selectedType === "package" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400"
                    }\`}
                  >
                    Packs Métiers Complets
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedType === "product" ? (
                    products.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedId(prod.id)}
                        className={\`p-4 rounded-2xl border cursor-pointer transition-all \${
                          selectedId === prod.id
                            ? "bg-amber-400/10 border-amber-400 ring-2 ring-amber-400/30"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                        }\`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-white text-sm">{prod.name}</h4>
                          <span className="font-extrabold text-amber-400 text-sm">{prod.price} DH</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{prod.tagline}</p>
                      </div>
                    ))
                  ) : (
                    packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedId(pkg.id)}
                        className={\`p-4 rounded-2xl border cursor-pointer transition-all \${
                          selectedId === pkg.id
                            ? "bg-emerald-500/10 border-emerald-400 ring-2 ring-emerald-400/30"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                        }\`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-white text-sm">{pkg.name}</h4>
                          <span className="font-extrabold text-emerald-400 text-sm">{pkg.price} DH</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{pkg.tagline}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="text-xs font-semibold text-slate-300">Quantité :</label>
                  <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg text-slate-300 hover:bg-slate-800 font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg text-slate-300 hover:bg-slate-800 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-amber-500/20">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Vous avez déjà votre ancienne carte de visite ? (Optionnel)
                    </h3>
                    <p className="text-[11px] text-amber-300/90">
                      Prenez une photo et nous nous chargeons de saisir vos informations.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-2xl p-5 text-center cursor-pointer bg-slate-950/60 transition-colors block">
                    <input type="file" accept="image/*" onChange={handleOldCardUpload} className="hidden" />
                    <Camera className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    {oldCardFile ? (
                      <p className="text-xs font-bold text-emerald-400">✅ {oldCardFile.name}</p>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-white">Photo de l'ancienne carte</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG jusqu'à 10 Mo</p>
                      </>
                    )}
                  </label>

                  <label className="border-2 border-dashed border-slate-700 hover:border-emerald-400 rounded-2xl p-5 text-center cursor-pointer bg-slate-950/60 transition-colors block">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <Upload className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    {logoFile ? (
                      <p className="text-xs font-bold text-emerald-400">✅ {logoFile.name}</p>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-white">Logo de votre entreprise</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">PNG transparent conseillé</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 text-xs">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-white">Informations de Contact & Profil Digital</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nom et Prénom *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Ahmed Benali"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nom de l'Entreprise / Marque</label>
                    <input
                      type="text"
                      placeholder="ex: Atlas Real Estate"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Fonction / Titre</label>
                    <input
                      type="text"
                      placeholder="ex: Consultant Immobilier, Gérant..."
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Secteur d'Activité *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Immobilier">Immobilier & Promotion</option>
                      <option value="Restauration">Restaurant, Café & Salon de thé</option>
                      <option value="Beauté">Coiffure, Beauté & Spas</option>
                      <option value="Freelance">Freelance, Tech & Créatif</option>
                      <option value="Médical">Santé, Médecin & Dentiste</option>
                      <option value="Juridique">Avocat, Notaire & Fiduciaire</option>
                      <option value="Commerce">Commerce & Boutique</option>
                      <option value="Entreprise">Société, BTP & Industrie</option>
                      <option value="Autre">Autre activité</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Numéro de Téléphone (Livraison) *</label>
                    <input
                      type="text"
                      required
                      placeholder="+212 6 XX XX XX XX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Numéro WhatsApp (Bouton profil)</label>
                    <input
                      type="text"
                      placeholder="+212 6 XX XX XX XX"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email Professionnel</label>
                    <input
                      type="email"
                      placeholder="contact@votre-domaine.ma"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Ville de Livraison (Maroc) *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Casablanca">Casablanca</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Marrakech">Marrakech</option>
                      <option value="Tanger">Tanger</option>
                      <option value="Agadir">Agadir</option>
                      <option value="Fès">Fès</option>
                      <option value="Meknès">Meknès</option>
                      <option value="Oujda">Oujda</option>
                      <option value="Kénitra">Kénitra</option>
                      <option value="Tétouan">Tétouan</option>
                      <option value="Autre Ville Maroc">Autre Ville Maroc</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Adresse complète de livraison</label>
                  <input
                    type="text"
                    placeholder="Quartier, Boulevard, Résidence, N°..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Instagram</label>
                    <input
                      type="text"
                      placeholder="@votre_compte"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Site Web</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Lien Google Maps</label>
                    <input
                      type="text"
                      placeholder="Lien de votre établissement"
                      value={googleMaps}
                      onChange={(e) => setGoogleMaps(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Instructions ou remarques particulières</label>
                  <textarea
                    rows={2}
                    placeholder="Précisions sur vos couleurs, gravure souhaitée ou textes à inclure..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>

            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="glass-card-gold rounded-3xl p-6 border border-amber-500/30 space-y-6 shadow-2xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  <span>Récapitulatif de la Commande</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-300 pb-2 border-b border-slate-800">
                    <span className="font-semibold">{currentItem?.name} (x{quantity})</span>
                    <span className="font-bold text-white">{totalPrice} DH</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Création du Profil Digital :</span>
                    <span className="font-bold text-emerald-400">Offerte (0 DH)</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>QR Code Haute Définition :</span>
                    <span className="font-bold text-emerald-400">Inclus</span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Frais de Livraison :</span>
                    <span className="font-bold text-white">
                      {deliveryFee === 0 ? <span className="text-emerald-400">Gratuite</span> : \`\${deliveryFee} DH\`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">Total à régler :</span>
                    <span className="text-2xl font-black text-amber-400">{finalTotal} DH</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Paiement à la livraison</span>
                  </p>
                  <p className="text-slate-400">
                    Réglez en espèces à la réception de votre colis auprès du livreur Amana Express.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{submitting ? "Enregistrement..." : "Valider ma Commande"}</span>
                </button>

                <div className="text-center pt-1">
                  <p className="text-[11px] text-slate-400 mb-2">Vous préférez commander par message ?</p>
                  <button
                    type="button"
                    onClick={() => openWhatsAppChat(\`Bonjour, je souhaite commander directement \${currentItem?.name} (\${finalTotal} DH).\`)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs font-bold hover:bg-emerald-900 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Commander sur WhatsApp</span>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
`;

fs.writeFileSync(target, code, 'utf-8');
console.log('OrderPage.tsx created successfully');
