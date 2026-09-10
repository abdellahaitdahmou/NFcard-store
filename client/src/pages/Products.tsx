import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Product } from "../types";
import { useSettings } from "../contexts/SettingsContext";
import { QuickOrderModal } from "../components/common/QuickOrderModal";
import {
  CreditCard,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  Smartphone,
  Layers,
  Key,
  Flame
} from "lucide-react";

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [quickOrderItem, setQuickOrderItem] = useState<Product | null>(null);
  const { openWhatsAppChat } = useSettings();

  useEffect(() => {
    api.getProducts()
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data);
        }
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: "all", label: "Tous les Produits" },
    { id: "cards", label: "💳 Cartes NFC" },
    { id: "stands", label: "🏪 Chevalets & Plaques Avis" },
    { id: "accessories", label: "✨ Stickers & Bracelets" },
    { id: "rfid", label: "🔑 Badges & Duplicateurs RFID" }
  ];

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="bg-slate-50/60 min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Catalogue Officiel NFcard Maroc</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Produits Connectés & Solutions NFC <br />
            <span className="gold-gradient-text">Livraison Express au Maroc.</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Cartes sans contact, chevalets d'avis Google, plaques réseaux sociaux, stickers NTAG215 et duplicateurs RFID pour particuliers et professionnels.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-orange-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-white border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative group ${
                  prod.isPopular
                    ? "border-orange-400 shadow-xl shadow-orange-500/10 ring-2 ring-orange-400/20"
                    : "border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Popular Badge */}
                {prod.isPopular && (
                  <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>{prod.badge || "Populaire"}</span>
                  </div>
                )}

                <div>
                  {/* Image banner */}
                  <div className="relative h-56 bg-gradient-to-b from-slate-50 to-slate-100/70 border-b border-slate-100 flex items-center justify-center p-4 overflow-hidden">
                    <img
                      src={prod.image || "/products/google-stand.png"}
                      alt={prod.name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-white shadow-sm">
                      {prod.badge || "NFC Maroc"}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 leading-snug">{prod.name}</h3>
                      <p className="text-xs text-orange-600 font-semibold mb-2">{prod.tagline}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{prod.description}</p>
                    </div>

                    {/* Price Box */}
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 font-medium">Tarif</span>
                      <div>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">{prod.price}</span>
                        <span className="text-sm font-bold text-orange-500 ml-1">DH</span>
                        {prod.comparePrice && (
                          <span className="text-xs text-slate-400 line-through ml-2">
                            {prod.comparePrice} DH
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 text-xs text-slate-700 pt-1">
                      {prod.features.slice(0, 5).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-5 sm:p-6 pt-0 space-y-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setQuickOrderItem(prod)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs shadow-md transition-all active:scale-98 ${
                      prod.isPopular
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Commander en 1 Clic ({prod.price} DH)</span>
                  </button>

                  <button
                    onClick={() => openWhatsAppChat(`Bonjour, je souhaite commander : ${prod.name} (Prix : ${prod.price} DH).`)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Commander via WhatsApp</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Quick Order Modal */}
        <QuickOrderModal
          isOpen={!!quickOrderItem}
          onClose={() => setQuickOrderItem(null)}
          item={quickOrderItem}
          itemType="product"
        />

        {/* Value Prop Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Livraison Rapide 24-48h</h4>
            <p className="text-xs text-slate-500">Expédition suivie dans toutes les villes du Maroc avec Amana Express.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Paiement à la Livraison</h4>
            <p className="text-xs text-slate-500">Réglez en espèces à réception de votre commande auprès du livreur.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mx-auto flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Configuration Offerte</h4>
            <p className="text-xs text-slate-500">Nos techniciens configurent vos puces NFC et profils sans frais supplémentaires.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
