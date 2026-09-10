import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { Product } from "../../types";
import { useSettings } from "../../contexts/SettingsContext";
import { QuickOrderModal } from "../common/QuickOrderModal";
import {
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  MessageCircle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck
} from "lucide-react";

export const FeaturedProductsSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [quickOrderItem, setQuickOrderItem] = useState<Product | null>(null);
  const { openWhatsAppChat } = useSettings();

  useEffect(() => {
    api.getProducts()
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data);
        }
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: "all", label: "Tous nos Produits" },
    { id: "cards", label: "💳 Cartes NFC" },
    { id: "stands", label: "🏪 Chevalets & Plaques Avis" },
    { id: "accessories", label: "✨ Stickers & Bracelets" },
    { id: "rfid", label: "🔑 Badges & Duplicateurs RFID" }
  ];

  const filtered = activeTab === "all"
    ? products
    : products.filter(p => p.category === activeTab);

  return (
    <section className="py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Catalogue Disponible en Stock</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Nos Produits & Solutions NFC <br />
            <span className="gold-gradient-text">Prêts à être Expédiés au Maroc.</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Cartes connectées, chevalets d'avis Google Maps, plaques réseaux sociaux, stickers et copieurs de badges RFID avec paiement à la livraison.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === cat.id
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-105"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-white border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative group hover:-translate-y-1 ${
                  prod.isPopular
                    ? "border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/20"
                    : "border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Popular Badge */}
                {prod.isPopular && (
                  <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span>{prod.badge || "Best Seller"}</span>
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
                      {prod.badge || "En Stock Maroc"}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">{prod.name}</h3>
                      <p className="text-xs text-amber-700 font-semibold mb-2">{prod.tagline}</p>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{prod.description}</p>
                    </div>

                    {/* Price Box */}
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 font-medium">Tarif</span>
                      <div>
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">{prod.price}</span>
                        <span className="text-sm font-bold text-amber-600 ml-1">DH</span>
                        {prod.comparePrice && (
                          <span className="text-xs text-slate-400 line-through ml-2">
                            {prod.comparePrice} DH
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 text-xs text-slate-700 pt-1">
                      {prod.features.slice(0, 4).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
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
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs shadow-md transition-all active:scale-95 ${
                      prod.isPopular
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Commander en 1 Clic ({prod.price} DH)</span>
                  </button>

                  <button
                    onClick={() => openWhatsAppChat(`Bonjour, je souhaite commander : ${prod.name} (Prix : ${prod.price} DH).`)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
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

        {/* View all button */}
        <div className="text-center pt-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 text-slate-900 font-bold text-sm shadow-sm hover:shadow transition-all"
          >
            <span>Voir tout le catalogue ({products.length} produits)</span>
            <ArrowRight className="w-4 h-4 text-amber-600" />
          </Link>
        </div>

      </div>
    </section>
  );
};
