import React, { useState } from "react";
import { Product, BusinessPackage } from "../../types";
import { api } from "../../services/api";
import { useSettings } from "../../contexts/SettingsContext";
import confetti from "canvas-confetti";
import {
  X,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Phone,
  User,
  MapPin,
  ChevronDown,
  ChevronUp,
  Camera,
  Upload
} from "lucide-react";

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Product | BusinessPackage | null;
  itemType?: "product" | "package";
}

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

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  item,
  itemType = "product"
}) => {
  const { settings, openWhatsAppChat } = useSettings();

  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Optional custom details toggle
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [oldCardFile, setOldCardFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  if (!isOpen || !item) return null;

  const unitPrice = item.price;
  const totalPrice = unitPrice * quantity;
  const deliveryFee = totalPrice >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const finalTotal = totalPrice + deliveryFee;

  const itemImage = "image" in item && item.image ? item.image : "/products/google-stand.png";

  const handleSubmit = async (e: React.FormEvent) => {
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
        productOrPackName: item.name,
        productType: itemType,
        productId: item.id,
        quantity,
        unitPrice,
        totalPrice: finalTotal,
        paymentStatus: "cash_on_delivery",
        customerInfo: {
          fullName,
          companyName: companyName || fullName,
          phone,
          whatsapp: phone,
          city,
          address,
          notes,
          logoUrl,
          oldCardPhotoUrl
        }
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.data) {
        setOrderComplete(res.data);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert("Erreur lors de la validation. Vous pouvez aussi commander en 1 clic sur WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const text = `Bonjour Tektap Maroc !\nJe souhaite commander : *${item.name}* (Qté: ${quantity})\nTotal : *${finalTotal} DH* (Paiement à la livraison)\nNom : ${fullName || "[À préciser]"}\nTéléphone : ${phone || "[À préciser]"}\nVille : ${city}\nAdresse : ${address || "[À préciser]"}`;
    openWhatsAppChat(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Commande Express 1-Clic
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {orderComplete ? (
            /* Success State */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  Commande N° {orderComplete.orderNumber}
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Merci {fullName} !
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Votre commande de <strong>{item.name}</strong> a été enregistrée. Paiement de <strong>{finalTotal} DH</strong> à la livraison.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ville & Adresse :</span>
                  <span className="font-bold text-slate-900">{city}, {address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Téléphone :</span>
                  <span className="font-bold text-slate-900">{phone}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                  <span className="text-slate-900">Total à payer :</span>
                  <span className="text-amber-600 text-sm">{finalTotal} DH</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmer sur WhatsApp (Plus rapide)</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            /* Order Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Snippet */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={itemImage}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-amber-700 font-semibold">
                    {item.price} DH / unité
                  </p>
                </div>
                {/* Quantity */}
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100 rounded"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Required Simple Fields */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nom et Prénom *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="ex: Youssef Bennani"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Numéro Téléphone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="06 XX XX XX XX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Ville de Livraison *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full py-2.5 px-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Adresse de Livraison (Quartier / Rue) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="ex: Quartier Gauthier, Rue Jean Jaurès..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Toggle for Custom Logo / Card Photo */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomOptions(!showCustomOptions)}
                  className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Ajouter un logo ou photo d'ancienne carte (Optionnel)
                  </span>
                  {showCustomOptions ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {showCustomOptions && (
                  <div className="p-3.5 mt-2 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs animate-fadeIn">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Nom de l'entreprise ou marque
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Cabinet Atlas"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <label className="border border-dashed border-slate-300 hover:border-amber-400 rounded-xl p-2.5 text-center cursor-pointer bg-white block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setOldCardFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Camera className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                        <span className="text-[10px] text-slate-700 font-bold block truncate">
                          {oldCardFile ? "✅ Photo ajoutée" : "Photo carte"}
                        </span>
                      </label>

                      <label className="border border-dashed border-slate-300 hover:border-amber-400 rounded-xl p-2.5 text-center cursor-pointer bg-white block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Upload className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                        <span className="text-[10px] text-slate-700 font-bold block truncate">
                          {logoFile ? "✅ Logo ajouté" : "Logo HD"}
                        </span>
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Remarques particulières..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Delivery Summary */}
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-600 block text-[11px]">Total à régler :</span>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    Paiement à la livraison
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-slate-900">{finalTotal}</span>
                  <span className="text-xs font-bold text-amber-600 ml-1">DH</span>
                  {deliveryFee === 0 && (
                    <span className="block text-[10px] text-emerald-600 font-bold">Livraison Gratuite</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{submitting ? "Validation..." : `Confirmer ma Commande (${finalTotal} DH)`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-2.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Commander directement sur WhatsApp</span>
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
