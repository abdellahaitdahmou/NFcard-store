import React, { useState, useEffect } from "react";
import { Product, BusinessPackage } from "../../types";
import { api } from "../../services/api";
import { Tag, Edit, Check, DollarSign, Plus, Sparkles, Image, CheckCircle2 } from "lucide-react";

export const DynamicPricing: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<BusinessPackage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCostPrice, setEditCostPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editComparePrice, setEditComparePrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [successSaved, setSuccessSaved] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [prodRes, packRes] = await Promise.all([api.getProducts(), api.getPackages()]);
      if (prodRes.success && prodRes.data) setProducts(prodRes.data);
      if (packRes.success && packRes.data) setPackages(packRes.data);
    } catch (err) {
      console.warn("Could not load pricing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStartEditProduct = (prod: Product) => {
    setEditingId(prod.id);
    setEditPrice(prod.price);
    setEditCostPrice(prod.costPrice || 0);
    setEditStock(prod.stockQuantity ?? 0);
    setEditComparePrice(prod.comparePrice || 0);
  };

  const handleSaveProductPrice = async (prod: Product) => {
    try {
      await api.updateProduct(prod.id, {
        price: Number(editPrice),
        costPrice: Number(editCostPrice),
        stockQuantity: Number(editStock),
        comparePrice: editComparePrice ? Number(editComparePrice) : undefined
      });
      setEditingId(null);
      setSuccessSaved(prod.id);
      setTimeout(() => setSuccessSaved(null), 2500);
      fetchData();
    } catch (err) {
      alert("Erreur lors de la mise à jour du prix et du stock.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2">
          <DollarSign className="w-3.5 h-3.5 text-amber-600" />
          <span>Gestion des Tarifs & Marges en Dirhams (DH)</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Catalogue & Prix de Vente</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Modifiez instantanément les prix d'achat, de vente et les stocks des articles individuels et des packs.
        </p>
      </div>

      {/* Products Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Articles & Produits Individuels ({products.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod) => {
            const isEditing = editingId === prod.id;
            const currentCost = prod.costPrice || 0;
            const currentPrice = prod.price;
            const marginDH = currentPrice - currentCost;
            const marginPct = currentPrice > 0 ? (marginDH / currentPrice) * 100 : 0;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={prod.image || "/products/google-stand.png"}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {prod.badge || "Standard"}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          Stock: {prod.stockQuantity ?? 0}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs mt-1 truncate">{prod.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{prod.tagline}</p>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Prix de Vente (DH) *</label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Prix d'Achat (DH)</label>
                          <input
                            type="number"
                            value={editCostPrice}
                            onChange={(e) => setEditCostPrice(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Stock Disponible</label>
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">Prix Barré (DH)</label>
                          <input
                            type="number"
                            value={editComparePrice}
                            onChange={(e) => setEditComparePrice(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="p-2 bg-amber-50/80 rounded-xl text-[11px] flex justify-between font-bold text-slate-800">
                        <span>Marge : <strong className="text-emerald-700">+{editPrice - editCostPrice} DH</strong></span>
                        <span>Rentabilité : <strong>{editPrice > 0 ? (((editPrice - editCostPrice) / editPrice) * 100).toFixed(0) : 0}%</strong></span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleSaveProductPrice(prod)}
                          className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                        <span className="text-xs text-slate-500 font-medium">Prix Vente :</span>
                        <div>
                          <span className="text-2xl font-black text-slate-900">{prod.price}</span>
                          <span className="text-xs font-bold text-amber-600 ml-1">DH</span>
                          {prod.comparePrice && (
                            <span className="text-xs text-slate-400 line-through ml-2">
                              {prod.comparePrice} DH
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cost and margin badge */}
                      <div className="px-3 py-1.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          Achat: <strong className="text-slate-800">{currentCost} DH</strong>
                        </span>
                        <span className="font-bold text-emerald-600">
                          Marge: +{marginDH} DH ({marginPct.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    {successSaved === prod.id ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Mis à jour !
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">
                        {prod.stockQuantity ?? 0} unités en réserve
                      </span>
                    )}

                    <button
                      onClick={() => handleStartEditProduct(prod)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-600" />
                      <span>Modifier Prix & Stock</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
