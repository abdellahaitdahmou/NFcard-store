import React, { useState, useEffect } from "react";
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
  MapPin,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Flame,
  Clock
} from "lucide-react";

const CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Agadir",
  "Fès",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Salé",
  "Mohammedia",
  "El Jadida",
  "Nador",
  "Autre Ville Maroc"
];

export const OrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { settings, openWhatsAppChat } = useSettings();

  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<BusinessPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection
  const [selectedType, setSelectedType] = useState<"product" | "package">("product");
  const [selectedId, setSelectedId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  // Essential Delivery Info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [address, setAddress] = useState("");

  // Optional Customization
  const [showOptionalFields, setShowOptionalFields] = useState(Boolean(searchParams.get("template")));
  const [selectedTemplate, setSelectedTemplate] = useState<string>(searchParams.get("template") || "sur_mesure");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [oldCardFile, setOldCardFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodsRes, packsRes] = await Promise.all([
          api.getProducts(),
          api.getPackages()
        ]);
        if (prodsRes.success && prodsRes.data) {
          setProducts(prodsRes.data);
          if (!selectedId && prodsRes.data.length > 0) {
            setSelectedId(prodsRes.data[0].id);
          }
        }
        if (packsRes.success && packsRes.data) {
          setPackages(packsRes.data);
        }

        // Pre-select via URL params
        const productParam = searchParams.get("product");
        const packParam = searchParams.get("pack");

        if (packParam && packsRes.data) {
          const foundPack = packsRes.data.find(
            (p: BusinessPackage) => p.slug === packParam || p.id === packParam
          );
          if (foundPack) {
            setSelectedType("package");
            setSelectedId(foundPack.id);
          }
        } else if (productParam && prodsRes.data) {
          const foundProd = prodsRes.data.find(
            (p: Product) => p.slug === productParam || p.id === productParam
          );
          if (foundProd) {
            setSelectedType("product");
            setSelectedId(foundProd.id);
          }
        }
      } catch (err) {
        console.warn("Could not fetch order items");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const currentItem = selectedType === "product"
    ? products.find((p) => p.id === selectedId) || products[0]
    : packages.find((p) => p.id === selectedId) || packages[0];

  const unitPrice = currentItem ? currentItem.price : 130;
  const totalPrice = unitPrice * quantity;
  const deliveryFee = totalPrice >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const finalTotal = totalPrice + deliveryFee;

  const currentImage = currentItem && "image" in currentItem && currentItem.image
    ? currentItem.image
    : "/products/google-stand.png";

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert("Veuillez renseigner votre nom, téléphone et adresse pour la livraison.");
      return;
    }

    setSubmitting(true);
    try {
      let logoUrl = "";
      let oldCardPhotoUrl = "";

      if (logoFile) {
        try {
          const res = await api.uploadFile(logoFile);
          if (res.success) logoUrl = res.fileUrl;
        } catch (e) {}
      }

      if (oldCardFile) {
        try {
          const res = await api.uploadFile(oldCardFile);
          if (res.success) oldCardPhotoUrl = res.fileUrl;
        } catch (e) {}
      }

      const orderPayload = {
        productOrPackName: currentItem ? currentItem.name : "Commande Tektap",
        productType: selectedType,
        productId: currentItem ? currentItem.id : selectedId,
        quantity,
        unitPrice,
        totalPrice: finalTotal,
        paymentStatus: "cash_on_delivery",
        customerInfo: {
          fullName,
          companyName: companyName || fullName,
          jobTitle,
          phone,
          whatsapp: phone,
          city,
          address,
          notes: selectedTemplate && selectedTemplate !== "sur_mesure" 
            ? `[Modèle choisi: ${selectedTemplate}] ${notes || ""}`.trim()
            : notes,
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

  const handleWhatsAppDirect = () => {
    const text = `Bonjour Tektap Maroc !\nJe souhaite commander : *${currentItem?.name}* (Qté: ${quantity})\nTotal : *${finalTotal} DH* (Paiement à la livraison)\nNom : ${fullName || "[À préciser]"}\nTéléphone : ${phone || "[À préciser]"}\nVille : ${city}\nAdresse : ${address || "[À préciser]"}`;
    openWhatsAppChat(text);
  };

  if (orderComplete) {
    const profileSlug = orderComplete.createdProfileSlug;
    const profileUrl = profileSlug ? `${window.location.origin}/p/${profileSlug}` : null;
    const accessPassword = orderComplete.accessPassword;

    return (
      <div className="py-20 bg-slate-50/70 min-h-[80vh] flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 text-center space-y-6 shadow-xl shadow-emerald-500/10">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                Commande N° {orderComplete.orderNumber}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Félicitations {fullName} !
              </h2>
              <p className="text-sm text-slate-600">
                Votre commande a été confirmée avec succès. Paiement de <strong>{finalTotal} DH</strong> à la réception de votre colis.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>Article :</span>
                <span className="font-bold text-slate-900">{orderComplete.productOrPackName} (x{quantity})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ville & Adresse :</span>
                <span className="font-bold text-slate-900">{city}, {address}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Téléphone :</span>
                <span className="font-bold text-slate-900">{phone}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Mode de Paiement :</span>
                <span className="font-bold text-emerald-600">À la livraison (Cash on Delivery)</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total à régler :</span>
                <span className="text-amber-600 font-extrabold">{finalTotal} DH</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Recevoir le suivi de commande sur WhatsApp</span>
              </button>

              <Link
                to="/"
                className="block text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2"
              >
                ← Retourner à la boutique
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/60 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">

        {/* Simple Top Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Commande Express en 30 secondes • Paiement à la Livraison</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Finalisez votre Commande <br />
            <span className="gold-gradient-text">Livraison Rapide Partout au Maroc.</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Remplissez vos coordonnées simples ci-dessous pour recevoir votre colis. Paiement en espèces auprès du livreur.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Left Column: Product Picker & Delivery Form */}
          <div className="md:col-span-7 space-y-6">

            {/* Step 1: Product Selection */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Article Sélectionné</h2>
                </div>

                {/* Switcher Tab */}
                <div className="flex bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType("product");
                      if (products.length > 0) setSelectedId(products[0].id);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      selectedType === "product" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                    }`}
                  >
                    Produits
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType("package");
                      if (packages.length > 0) setSelectedId(packages[0].id);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      selectedType === "package" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                    }`}
                  >
                    Packs
                  </button>
                </div>
              </div>

              {/* Product Grid / Dropdown */}
              <div className="space-y-2">
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  {selectedType === "product"
                    ? products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.price} DH
                        </option>
                      ))
                    : packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} — {pkg.price} DH
                        </option>
                      ))}
                </select>

                {/* Selected Item Preview Card */}
                {currentItem && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-amber-50/50 to-slate-50 border border-amber-200/80">
                    <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={currentImage}
                        alt={currentItem.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {currentItem.name}
                      </h4>
                      <p className="text-[11px] text-amber-700 font-semibold">
                        {currentItem.price} DH
                        {currentItem.comparePrice && (
                          <span className="text-slate-400 line-through ml-2 font-normal">
                            {currentItem.comparePrice} DH
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Simplified Contact & Delivery Info */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Vos Coordonnées de Livraison</h2>
                  <p className="text-[11px] text-slate-500">Uniquement 3 informations nécessaires pour l'envoi.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom et Prénom *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="ex: Reda Chraibi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Téléphone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="06 XX XX XX XX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ville de Livraison *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Adresse Complète de Livraison (Quartier, Rue, N°) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="ex: Quartier Racine, Boulevard Franklin Roosevelt, Casablanca"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Section Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="flex items-center justify-between w-full p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Ajouter logo, photo d'ancienne carte ou précisions (Optionnel)</span>
                  </span>
                  {showOptionalFields ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showOptionalFields && (
                  <div className="mt-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 text-xs animate-fadeIn">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Modèle / Thème souhaité
                      </label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="sur_mesure">✨ Sur-mesure (selon mon logo & charte)</option>
                        <option value="luxury_gold">🏆 Luxury Gold Prestige (Immobilier & Luxe)</option>
                        <option value="warm_restaurant">🍽️ Riad & Gastronomie (Restaurants & Cafés)</option>
                        <option value="purple_beauty">✂️ Maison Beauté & Glamour (Salons & Spas)</option>
                        <option value="emerald_corporate">🏢 Corporate Émeraude (Entreprises & PME)</option>
                        <option value="modern_dark">💻 Studio Digital (Tech & Freelance)</option>
                        <option value="medical_clean">⚕️ Cabinet Médical (Santé & Soins)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Nom de Société / Activité
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Cabinet Atlas"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-3 text-center cursor-pointer bg-white transition-colors block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setOldCardFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Camera className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                        <span className="text-[11px] font-bold text-slate-800 block truncate">
                          {oldCardFile ? "✅ Photo ajoutée" : "Photo de votre carte"}
                        </span>
                        <span className="text-[10px] text-slate-400">JPG, PNG</span>
                      </label>

                      <label className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-3 text-center cursor-pointer bg-white transition-colors block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Upload className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                        <span className="text-[11px] font-bold text-slate-800 block truncate">
                          {logoFile ? "✅ Logo ajouté" : "Logo d'entreprise"}
                        </span>
                        <span className="text-[10px] text-slate-400">PNG transparent</span>
                      </label>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Instructions particulières (Optionnel)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Couleur souhaitée, gravure, liens particuliers..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Instant Summary & Actions */}
          <div className="md:col-span-5 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-amber-300 shadow-xl shadow-amber-500/5 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span>Récapitulatif Express</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                  <span className="font-semibold">{currentItem?.name} (x{quantity})</span>
                  <span className="font-bold text-slate-900">{totalPrice} DH</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Configuration du profil :</span>
                  <span className="font-bold text-emerald-600">Offerte (0 DH)</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Livraison au Maroc :</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">Gratuite</span>
                    ) : (
                      `${deliveryFee} DH`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total à payer :</span>
                  <div>
                    <span className="text-3xl font-black text-slate-900">{finalTotal}</span>
                    <span className="text-sm font-bold text-amber-600 ml-1">DH</span>
                  </div>
                </div>
              </div>

              {/* COD Badge */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">Paiement à la livraison</p>
                  <p className="text-[11px] text-emerald-700">Vous réglez en espèces lors de la réception de votre colis.</p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{submitting ? "Validation..." : `Valider ma Commande (${finalTotal} DH)`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="w-full py-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Commander en 1 Clic sur WhatsApp</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Garantie 2 ans
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  Livraison 24h-48h
                </span>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
