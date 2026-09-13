import React, { useState, useEffect, useMemo } from "react";
import { Product } from "../../types";
import { api } from "../../services/api";
import {
  Boxes,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Search,
  Plus,
  Minus,
  RefreshCw,
  Edit3,
  PackagePlus,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Archive,
  Eye,
  Percent
} from "lucide-react";

export const StockManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  // Edit State for in-line edits
  const [editedProducts, setEditedProducts] = useState<{
    [id: string]: {
      stockQuantity: number;
      price: number;
      costPrice: number;
      minStockAlert: number;
      sku: string;
    };
  }>({});

  // Restock modal state
  const [restockItem, setRestockItem] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);
  const [restockCost, setRestockCost] = useState<number>(0);
  const [restockSubmitting, setRestockSubmitting] = useState(false);

  // Detail edit modal state
  const [detailModalItem, setDetailModalItem] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts();
      if (res.success && res.data) {
        setProducts(res.data);
        // Initialize local edit state
        const initialEdit: typeof editedProducts = {};
        res.data.forEach((p) => {
          initialEdit[p.id] = {
            stockQuantity: p.stockQuantity ?? 0,
            price: p.price ?? 0,
            costPrice: p.costPrice ?? 0,
            minStockAlert: p.minStockAlert ?? 5,
            sku: p.sku ?? ""
          };
        });
        setEditedProducts(initialEdit);
      }
    } catch (err) {
      console.error("Erreur chargement stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFieldChange = (
    id: string,
    field: "stockQuantity" | "price" | "costPrice" | "minStockAlert" | "sku",
    value: string | number
  ) => {
    setEditedProducts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: field === "sku" ? String(value) : Math.max(0, Number(value) || 0)
      }
    }));
  };

  const handleQuickDelta = (id: string, delta: number) => {
    setEditedProducts((prev) => {
      const current = prev[id]?.stockQuantity ?? 0;
      const nextVal = Math.max(0, current + delta);
      return {
        ...prev,
        [id]: {
          ...prev[id],
          stockQuantity: nextVal
        }
      };
    });
  };

  const handleSaveProduct = async (product: Product) => {
    const editData = editedProducts[product.id];
    if (!editData) return;

    setSavingId(product.id);
    try {
      const res = await api.updateProduct(product.id, {
        stockQuantity: editData.stockQuantity,
        price: editData.price,
        costPrice: editData.costPrice,
        minStockAlert: editData.minStockAlert,
        sku: editData.sku
      });

      if (res.success && res.data) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? res.data : p))
        );
        setSavedSuccessId(product.id);
        setTimeout(() => setSavedSuccessId(null), 2500);
      }
    } catch (err) {
      alert("Erreur lors de la sauvegarde du produit.");
    } finally {
      setSavingId(null);
    }
  };

  const handleApplyRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem) return;

    setRestockSubmitting(true);
    try {
      const currentStock = restockItem.stockQuantity ?? 0;
      const newStock = currentStock + Number(restockAmount);

      const updates: Partial<Product> = {
        stockQuantity: newStock
      };
      if (restockCost > 0) {
        updates.costPrice = Number(restockCost);
      }

      const res = await api.updateProduct(restockItem.id, updates);
      if (res.success && res.data) {
        setProducts((prev) =>
          prev.map((p) => (p.id === restockItem.id ? res.data : p))
        );
        setEditedProducts((prev) => ({
          ...prev,
          [restockItem.id]: {
            ...prev[restockItem.id],
            stockQuantity: newStock,
            costPrice: restockCost > 0 ? Number(restockCost) : prev[restockItem.id]?.costPrice ?? 0
          }
        }));
        setRestockItem(null);
      }
    } catch (err) {
      alert("Erreur lors de l'approvisionnement.");
    } finally {
      setRestockSubmitting(false);
    }
  };

  // KPIs Calculations
  const stats = useMemo(() => {
    let totalUnits = 0;
    let totalCostValue = 0;
    let totalRetailValue = 0;
    let outOfStockCount = 0;
    let lowStockCount = 0;
    let healthyStockCount = 0;

    products.forEach((p) => {
      const stock = editedProducts[p.id]?.stockQuantity ?? p.stockQuantity ?? 0;
      const price = editedProducts[p.id]?.price ?? p.price ?? 0;
      const cost = editedProducts[p.id]?.costPrice ?? p.costPrice ?? 0;
      const minAlert = editedProducts[p.id]?.minStockAlert ?? p.minStockAlert ?? 5;

      totalUnits += stock;
      totalCostValue += stock * cost;
      totalRetailValue += stock * price;

      if (stock === 0) {
        outOfStockCount++;
      } else if (stock <= minAlert) {
        lowStockCount++;
      } else {
        healthyStockCount++;
      }
    });

    const totalProfit = totalRetailValue - totalCostValue;
    const avgMarginPercent = totalRetailValue > 0 ? (totalProfit / totalRetailValue) * 100 : 0;

    return {
      totalUnits,
      totalCostValue,
      totalRetailValue,
      totalProfit,
      avgMarginPercent,
      outOfStockCount,
      lowStockCount,
      healthyStockCount
    };
  }, [products, editedProducts]);

  // Categories list
  const categories = [
    { id: "all", label: "Toutes les catégories" },
    { id: "stands", label: "🏪 Chevalets & Plaques" },
    { id: "accessories", label: "✨ Stickers & Bracelets" },
    { id: "rfid", label: "🔑 RFID & Badges" },
    { id: "cards", label: "💳 Cartes NFC" }
  ];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const edit = editedProducts[prod.id];
      const stock = edit?.stockQuantity ?? prod.stockQuantity ?? 0;
      const minAlert = edit?.minStockAlert ?? prod.minStockAlert ?? 5;

      // Search match
      const matchSearch =
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (edit?.sku || prod.sku || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.tagline?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      // Category match
      if (selectedCategory !== "all" && prod.category !== selectedCategory) {
        return false;
      }

      // Status match
      if (selectedStatus === "in_stock" && stock <= minAlert) return false;
      if (selectedStatus === "low_stock" && (stock === 0 || stock > minAlert)) return false;
      if (selectedStatus === "out_of_stock" && stock > 0) return false;

      return true;
    });
  }, [products, editedProducts, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2">
            <Boxes className="w-3.5 h-3.5 text-amber-600" />
            <span>Inventaire & Rentabilité NFcard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Gestion de Stock & Tarification
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Contrôlez les quantités en stock, fixez vos prix d'achat et de vente, et suivez vos marges bénéficiaires en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-600" : ""}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Units */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unités en Stock</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{stats.totalUnits}</span>
            <span className="text-xs font-semibold text-slate-500">articles</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {stats.healthyStockCount} normaux
            </span>
            {stats.lowStockCount > 0 && (
              <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> {stats.lowStockCount} faibles
              </span>
            )}
            {stats.outOfStockCount > 0 && (
              <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> {stats.outOfStockCount} ruptures
              </span>
            )}
          </div>
        </div>

        {/* Total Cost Value */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valeur d'Achat (Investi)</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">
              {stats.totalCostValue.toLocaleString("fr-FR")}
            </span>
            <span className="text-xs font-bold text-amber-600">DH</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2.5">
            Coût d'acquisition total du stock disponible
          </p>
        </div>

        {/* Total Retail Value */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valeur Marchande (Vente)</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">
              {stats.totalRetailValue.toLocaleString("fr-FR")}
            </span>
            <span className="text-xs font-bold text-amber-600">DH</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2.5">
            Chiffre d'affaires estimé si tout est vendu
          </p>
        </div>

        {/* Projected Gross Profit & Margin */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bénéfice Prévisionnel</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-400">
              +{stats.totalProfit.toLocaleString("fr-FR")}
            </span>
            <span className="text-xs font-bold text-emerald-300">DH</span>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs">
            <span className="text-slate-300">Marge brute moyenne :</span>
            <span className="font-extrabold text-amber-300">{stats.avgMarginPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom de produit, SKU ou référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedStatus === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tous ({products.length})
            </button>
            <button
              onClick={() => setSelectedStatus("in_stock")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedStatus === "in_stock"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              🟢 En stock ({stats.healthyStockCount})
            </button>
            <button
              onClick={() => setSelectedStatus("low_stock")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedStatus === "low_stock"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              🟡 Stock faible ({stats.lowStockCount})
            </button>
            <button
              onClick={() => setSelectedStatus("out_of_stock")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedStatus === "out_of_stock"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-800 hover:bg-rose-100"
              }`}
            >
              🔴 Rupture ({stats.outOfStockCount})
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-white"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Article & Référence</th>
                <th className="py-3.5 px-3">Quantité en Stock</th>
                <th className="py-3.5 px-3">Prix d'Achat (DH)</th>
                <th className="py-3.5 px-3">Prix de Vente (DH)</th>
                <th className="py-3.5 px-3">Marge Brute / Unité</th>
                <th className="py-3.5 px-3">Valeur Marchande</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Archive className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Aucun produit ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const edit = editedProducts[prod.id] || {
                    stockQuantity: prod.stockQuantity ?? 0,
                    price: prod.price ?? 0,
                    costPrice: prod.costPrice ?? 0,
                    minStockAlert: prod.minStockAlert ?? 5,
                    sku: prod.sku ?? ""
                  };

                  const currentStock = edit.stockQuantity;
                  const minAlert = edit.minStockAlert;
                  const costPrice = edit.costPrice;
                  const sellPrice = edit.price;

                  const unitMarginDH = sellPrice - costPrice;
                  const unitMarginPercent = sellPrice > 0 ? (unitMarginDH / sellPrice) * 100 : 0;
                  const totalStockRetail = currentStock * sellPrice;
                  const totalStockCost = currentStock * costPrice;

                  const isSaved = savedSuccessId === prod.id;
                  const isSaving = savingId === prod.id;

                  // Status determination
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> En stock
                    </span>
                  );
                  if (currentStock === 0) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Rupture
                      </span>
                    );
                  } else if (currentStock <= minAlert) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Faible (≤{minAlert})
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Product details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <img
                              src={prod.image || "/products/google-stand.png"}
                              alt={prod.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {edit.sku || "REF-AUTO"}
                              </span>
                              {statusBadge}
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs mt-1 truncate">
                              {prod.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                              {prod.category} • {prod.badge || "Standard"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Stock Quantity + Quick Adjustment */}
                      <td className="py-4 px-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleQuickDelta(prod.id, -1)}
                              disabled={currentStock <= 0}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold flex items-center justify-center transition-colors text-xs"
                              title="-1 unité"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={currentStock}
                              onChange={(e) =>
                                handleFieldChange(prod.id, "stockQuantity", e.target.value)
                              }
                              className="w-16 text-center font-black text-sm bg-slate-50 border border-slate-200 rounded-lg py-1 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleQuickDelta(prod.id, 1)}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors text-xs"
                              title="+1 unité"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {/* Quick shortcuts */}
                          <div className="flex items-center gap-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() => handleQuickDelta(prod.id, 5)}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 font-bold transition-colors"
                            >
                              +5
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickDelta(prod.id, 10)}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 font-bold transition-colors"
                            >
                              +10
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRestockItem(prod);
                                setRestockCost(edit.costPrice);
                              }}
                              className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold transition-colors"
                            >
                              Réassort...
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Prix d'Achat (Cost Price) */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={costPrice}
                            onChange={(e) =>
                              handleFieldChange(prod.id, "costPrice", e.target.value)
                            }
                            className="w-20 font-bold text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white"
                          />
                          <span className="text-[11px] font-bold text-slate-400">DH</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Coût unitaire
                        </p>
                      </td>

                      {/* Prix de Vente (Retail Price) */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={sellPrice}
                            onChange={(e) =>
                              handleFieldChange(prod.id, "price", e.target.value)
                            }
                            className="w-20 font-black text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                          />
                          <span className="text-[11px] font-bold text-amber-600">DH</span>
                        </div>
                        {prod.comparePrice ? (
                          <span className="text-[10px] text-slate-400 line-through">
                            Barré : {prod.comparePrice} DH
                          </span>
                        ) : null}
                      </td>

                      {/* Marge Unitaire & % */}
                      <td className="py-4 px-3">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span
                              className={`font-black text-sm ${
                                unitMarginDH > 0 ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {unitMarginDH > 0 ? `+${unitMarginDH}` : unitMarginDH}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">DH</span>
                          </div>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold mt-0.5 ${
                              unitMarginPercent >= 50
                                ? "bg-emerald-100 text-emerald-800"
                                : unitMarginPercent >= 25
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {unitMarginPercent.toFixed(0)}% marge
                          </span>
                        </div>
                      </td>

                      {/* Total Stock Values */}
                      <td className="py-4 px-3">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 text-xs">
                            {totalStockRetail.toLocaleString("fr-FR")} DH{" "}
                            <span className="text-[10px] text-slate-400 font-normal">(Vente)</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {totalStockCost.toLocaleString("fr-FR")} DH{" "}
                            <span className="text-[10px] text-slate-400 font-normal">(Achat)</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSaveProduct(prod)}
                            disabled={isSaving}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all ${
                              isSaved
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                            }`}
                          >
                            {isSaving ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : isSaved ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Enregistré !
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" /> Sauvegarder
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDetailModalItem(prod)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Modifier tous les détails"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Express Modal */}
      {restockItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Réassort / Approvisionnement</h3>
                  <p className="text-xs text-slate-400">Ajouter du stock reçu</p>
                </div>
              </div>
              <button
                onClick={() => setRestockItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 flex items-center gap-3 border border-slate-200">
              <img
                src={restockItem.image || "/products/google-stand.png"}
                alt={restockItem.name}
                className="w-12 h-12 object-contain bg-white rounded-xl p-1 border border-slate-200"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs truncate">{restockItem.name}</h4>
                <p className="text-[11px] text-slate-500">
                  Stock actuel : <span className="font-bold text-slate-800">{restockItem.stockQuantity ?? 0} unités</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleApplyRestock} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nombre d'unités reçues (+) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Nouveau stock total :{" "}
                  <span className="font-bold text-emerald-600">
                    {(restockItem.stockQuantity ?? 0) + Number(restockAmount)} unités
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Prix d'Achat unitaire de cette commande (DH)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={restockCost}
                  onChange={(e) => setRestockCost(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Permet d'actualiser votre coût de revient si le fournisseur a changé de tarif.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockItem(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={restockSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  {restockSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Valider Réassort"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Full Details Modal */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Paramètres de l'Article</h3>
                <p className="text-xs text-slate-400">{detailModalItem.name}</p>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Code SKU / Référence</label>
                  <input
                    type="text"
                    value={editedProducts[detailModalItem.id]?.sku || ""}
                    onChange={(e) =>
                      handleFieldChange(detailModalItem.id, "sku", e.target.value)
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Seuil Alerte Stock Bas</label>
                  <input
                    type="number"
                    min="0"
                    value={editedProducts[detailModalItem.id]?.minStockAlert || 5}
                    onChange={(e) =>
                      handleFieldChange(detailModalItem.id, "minStockAlert", e.target.value)
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prix d'Achat (DH) *</label>
                  <input
                    type="number"
                    min="0"
                    value={editedProducts[detailModalItem.id]?.costPrice || 0}
                    onChange={(e) =>
                      handleFieldChange(detailModalItem.id, "costPrice", e.target.value)
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prix de Vente (DH) *</label>
                  <input
                    type="number"
                    min="0"
                    value={editedProducts[detailModalItem.id]?.price || 0}
                    onChange={(e) =>
                      handleFieldChange(detailModalItem.id, "price", e.target.value)
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Quantité Actuelle en Stock *</label>
                <input
                  type="number"
                  min="0"
                  value={editedProducts[detailModalItem.id]?.stockQuantity || 0}
                  onChange={(e) =>
                    handleFieldChange(detailModalItem.id, "stockQuantity", e.target.value)
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Marge brute unitaire :</span>
                  <span className="text-emerald-700">
                    {(editedProducts[detailModalItem.id]?.price || 0) -
                      (editedProducts[detailModalItem.id]?.costPrice || 0)}{" "}
                    DH
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Taux de marge :</span>
                  <span className="font-bold">
                    {detailModalItem.price > 0
                      ? (
                          (((editedProducts[detailModalItem.id]?.price || 0) -
                            (editedProducts[detailModalItem.id]?.costPrice || 0)) /
                            (editedProducts[detailModalItem.id]?.price || 1)) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDetailModalItem(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await handleSaveProduct(detailModalItem);
                    setDetailModalItem(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
