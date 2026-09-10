import React, { useState, useEffect } from "react";
import { BusinessPackage } from "../../types";
import { api } from "../../services/api";
import {
  Briefcase,
  Edit,
  Plus,
  Trash2,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  DollarSign,
  Tag
} from "lucide-react";

const BUSINESS_TYPES = [
  { value: "restaurant", label: "🍽️ Restaurant & Café" },
  { value: "real_estate", label: "🏢 Immobilier" },
  { value: "salon_barber", label: "✂️ Salon & Coiffure" },
  { value: "freelancer", label: "💻 Freelance & Tech" },
  { value: "company", label: "🏭 Société & PME" },
  { value: "medical", label: "⚕️ Médical & Santé" },
  { value: "custom", label: "⭐ Sur Mesure" }
];

const emptyPackage: Partial<BusinessPackage> = {
  name: "",
  slug: "",
  businessType: "company",
  tagline: "",
  description: "",
  price: 399,
  features: [],
  icon: "🏢",
  idealFor: "",
  badge: ""
};

export const PackagesManagement: React.FC = () => {
  const [packages, setPackages] = useState<BusinessPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<BusinessPackage>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPkg, setNewPkg] = useState<Partial<BusinessPackage>>(emptyPackage);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await api.getPackages();
      if (res.success && res.data) setPackages(res.data);
    } catch {
      console.warn("Could not load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleStartEdit = (pkg: BusinessPackage) => {
    setEditingId(pkg.id);
    setEditData({ ...pkg });
    setExpandedId(pkg.id);
  };

  const handleSave = async (pkg: BusinessPackage) => {
    setSaving(true);
    try {
      await api.updatePackage(pkg.id, editData);
      setEditingId(null);
      fetchPackages();
    } catch {
      alert("Erreur lors de la sauvegarde du pack.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pkg: BusinessPackage) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le pack "${pkg.name}" ?`)) return;
    try {
      await api.deletePackage(pkg.id);
      fetchPackages();
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleAddFeature = (list: string[], setList: (f: string[]) => void, text: string) => {
    if (text.trim()) {
      setList([...list, text.trim()]);
    }
  };

  const handleCreatePackage = async () => {
    if (!newPkg.name || !newPkg.price) {
      alert("Veuillez remplir le nom et le prix du pack.");
      return;
    }
    setSaving(true);
    try {
      const slug = (newPkg.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await api.createPackage({ ...newPkg, slug });
      setShowAddModal(false);
      setNewPkg(emptyPackage);
      fetchPackages();
    } catch {
      alert("Erreur lors de la création du pack.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full mr-3" />
        Chargement des packs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Packs Métiers & Solutions Packagées</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez les offres sectorielles clé en main pour restaurants, immobilier, salons et entreprises.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Créer un Nouveau Pack</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="space-y-4">
        {packages.map((pkg) => {
          const isEditing = editingId === pkg.id;
          const isExpanded = expandedId === pkg.id;

          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden"
            >
              {/* Package Header Row */}
              <div className="flex items-center gap-4 p-5">
                <span className="text-3xl flex-shrink-0 bg-slate-50 p-2 rounded-2xl border border-slate-100">{pkg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-slate-900 text-sm truncate">{pkg.name}</h3>
                    {pkg.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {pkg.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {BUSINESS_TYPES.find(b => b.value === pkg.businessType)?.label || pkg.businessType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{pkg.tagline}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-lg font-black text-slate-900">{pkg.price} DH</span>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : pkg.id)}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors"
                    title={isExpanded ? "Réduire" : "Développer"}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleStartEdit(pkg)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-600" />
                    <span>Éditer</span>
                  </button>
                  <button
                    onClick={() => handleDelete(pkg)}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Body */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-5 bg-slate-50/60">
                  {isEditing ? (
                    /* ── EDIT FORM ── */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Nom du Pack *</label>
                          <input
                            type="text"
                            value={editData.name || ""}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Slogan / Tagline</label>
                          <input
                            type="text"
                            value={editData.tagline || ""}
                            onChange={(e) => setEditData({ ...editData, tagline: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Type de Métier</label>
                          <select
                            value={editData.businessType || "company"}
                            onChange={(e) => setEditData({ ...editData, businessType: e.target.value as BusinessPackage["businessType"] })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                          >
                            {BUSINESS_TYPES.map(bt => (
                              <option key={bt.value} value={bt.value}>{bt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Prix (DH) *
                          </label>
                          <input
                            type="number"
                            value={editData.price || 0}
                            onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Badge / Étiquette
                          </label>
                          <input
                            type="text"
                            placeholder="ex: Populaire, Nouveau..."
                            value={editData.badge || ""}
                            onChange={(e) => setEditData({ ...editData, badge: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Icône (emoji)</label>
                          <input
                            type="text"
                            value={editData.icon || ""}
                            onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1 text-xs">Description</label>
                        <textarea
                          rows={2}
                          value={editData.description || ""}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1 text-xs">Idéal pour...</label>
                        <input
                          type="text"
                          value={editData.idealFor || ""}
                          onChange={(e) => setEditData({ ...editData, idealFor: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-2 text-xs">Fonctionnalités incluses</label>
                        <div className="space-y-1.5">
                          {(editData.features || []).map((feat, fi) => (
                            <div key={fi} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span className="flex-1 text-xs text-slate-800 font-medium">{feat}</span>
                              <button
                                type="button"
                                onClick={() => setEditData({
                                  ...editData,
                                  features: (editData.features || []).filter((_, i) => i !== fi)
                                })}
                                className="text-slate-400 hover:text-red-500"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Ajouter une fonctionnalité..."
                            value={newFeatureText}
                            onChange={(e) => setNewFeatureText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddFeature(editData.features || [], (f) => setEditData({ ...editData, features: f }), newFeatureText);
                                setNewFeatureText("");
                              }
                            }}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              handleAddFeature(editData.features || [], (f) => setEditData({ ...editData, features: f }), newFeatureText);
                              setNewFeatureText("");
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                          >
                            <Plus className="w-3.5 h-3.5 text-amber-400" />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleSave(pkg)}
                          disabled={saving}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5 text-amber-400" />
                          <span>{saving ? "Sauvegarde..." : "Enregistrer les modifications"}</span>
                        </button>
                        <button
                          onClick={() => { setEditingId(null); }}
                          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── READ-ONLY VIEW ── */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                      <div>
                        <p className="font-bold text-slate-900 mb-1">Description</p>
                        <p className="text-slate-600 leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200">{pkg.description || "—"}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 mb-1">
                          <Star className="w-3.5 h-3.5 inline mr-1 text-amber-500" /> Idéal pour
                        </p>
                        <p className="text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200">{pkg.idealFor || "—"}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="font-bold text-slate-900 mb-2">Fonctionnalités ({pkg.features.length})</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {pkg.features.map((feat, fi) => (
                            <div key={fi} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span className="font-medium">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {packages.length === 0 && (
          <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-200">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30 text-slate-400" />
            <p className="font-bold text-slate-700">Aucun pack enregistré.</p>
            <p className="text-xs mt-1">Cliquez sur "Créer un Nouveau Pack" pour ajouter votre première solution clé en main.</p>
          </div>
        )}
      </div>

      {/* Add New Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Créer un Nouveau Pack Métier</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom *</label>
                <input
                  type="text"
                  placeholder="ex: Pack Restaurant Premium"
                  value={newPkg.name || ""}
                  onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Prix (DH) *</label>
                <input
                  type="number"
                  value={newPkg.price || ""}
                  onChange={(e) => setNewPkg({ ...newPkg, price: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Slogan</label>
                <input
                  type="text"
                  placeholder="ex: La visibilité de votre établissement"
                  value={newPkg.tagline || ""}
                  onChange={(e) => setNewPkg({ ...newPkg, tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Type de Métier</label>
                <select
                  value={newPkg.businessType || "company"}
                  onChange={(e) => setNewPkg({ ...newPkg, businessType: e.target.value as BusinessPackage["businessType"] })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  {BUSINESS_TYPES.map(bt => (
                    <option key={bt.value} value={bt.value}>{bt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Icône (emoji)</label>
                <input
                  type="text"
                  placeholder="🍽️"
                  value={newPkg.icon || ""}
                  onChange={(e) => setNewPkg({ ...newPkg, icon: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Badge</label>
                <input
                  type="text"
                  placeholder="ex: Populaire"
                  value={newPkg.badge || ""}
                  onChange={(e) => setNewPkg({ ...newPkg, badge: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Décrivez ce que comprend ce pack..."
                value={newPkg.description || ""}
                onChange={(e) => setNewPkg({ ...newPkg, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1">Idéal pour</label>
              <input
                type="text"
                placeholder="ex: Restaurants avec 1-3 points de vente"
                value={newPkg.idealFor || ""}
                onChange={(e) => setNewPkg({ ...newPkg, idealFor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-2">Fonctionnalités</label>
              {(newPkg.features || []).map((feat, fi) => (
                <div key={fi} className="flex items-center gap-2 mb-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="flex-1 text-slate-700 font-medium">{feat}</span>
                  <button
                    type="button"
                    onClick={() => setNewPkg({ ...newPkg, features: (newPkg.features || []).filter((_, i) => i !== fi) })}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 mt-1">
                <input
                  id="new-feature-input"
                  type="text"
                  placeholder="Ajouter une fonctionnalité..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value;
                      if (val.trim()) {
                        setNewPkg({ ...newPkg, features: [...(newPkg.features || []), val.trim()] });
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("new-feature-input") as HTMLInputElement;
                    if (input?.value.trim()) {
                      setNewPkg({ ...newPkg, features: [...(newPkg.features || []), input.value.trim()] });
                      input.value = "";
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleCreatePackage}
                disabled={saving}
                className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs"
              >
                {saving ? "Création en cours..." : "Créer le Pack"}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
