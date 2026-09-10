import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Instagram,
  Facebook,
  Globe,
  Tag,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Competitor } from "../../types";
import { api } from "../../services/api";

export const CompetitorResearch: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<Competitor | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    instagram: "",
    facebook: "",
    product: "Cartes NFC standard",
    price: "",
    packageDetails: "",
    targetCustomer: "",
    advantages: "",
    weaknesses: "",
    notes: "",
    dateResearched: new Date().toISOString().split("T")[0],
    isVerified: true
  });

  const fetchCompetitors = async () => {
    try {
      const res = await api.getCompetitors();
      if (res.success && res.data) {
        setCompetitors(res.data);
      }
    } catch (err) {
      console.warn("Could not load competitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const handleOpenAdd = () => {
    setEditingComp(null);
    setFormData({
      companyName: "",
      website: "",
      instagram: "",
      facebook: "",
      product: "Cartes NFC standard",
      price: "",
      packageDetails: "",
      targetCustomer: "",
      advantages: "",
      weaknesses: "",
      notes: "",
      dateResearched: new Date().toISOString().split("T")[0],
      isVerified: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: Competitor) => {
    setEditingComp(comp);
    setFormData({
      companyName: comp.companyName,
      website: comp.website || "",
      instagram: comp.instagram || "",
      facebook: comp.facebook || "",
      product: comp.product,
      price: comp.price,
      packageDetails: comp.packageDetails,
      targetCustomer: comp.targetCustomer,
      advantages: comp.advantages,
      weaknesses: comp.weaknesses,
      notes: comp.notes,
      dateResearched: comp.dateResearched,
      isVerified: comp.isVerified
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet enregistrement d'étude de marché ?")) return;
    try {
      await api.deleteCompetitor(id);
      fetchCompetitors();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingComp) {
        await api.updateCompetitor(editingComp.id, formData);
      } else {
        await api.createCompetitor(formData);
      }
      setIsModalOpen(false);
      fetchCompetitors();
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  const filtered = competitors.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetCustomer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Étude de Marché & Concurrents Maroc</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Veille concurrentielle et analyse des prix de l'écosystème NFC & QR code au Maroc.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Ajouter un Concurrent</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par entreprise, produit, cible..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
        />
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-4">Entreprise / Marque</th>
                <th className="px-5 py-4">Produit Proposé</th>
                <th className="px-5 py-4">Fourchette Prix (DH)</th>
                <th className="px-5 py-4">Public Cible</th>
                <th className="px-5 py-4">Points Forts</th>
                <th className="px-5 py-4">Faiblesses & Opportunités Tektap</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-xs">
                    Aucun concurrent enregistré pour le moment.
                  </td>
                </tr>
              ) : (
                filtered.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{comp.companyName}</span>
                        {comp.isVerified && (
                          <span title="Données vérifiées">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        {comp.website && (
                          <a href={comp.website} target="_blank" rel="noreferrer" className="hover:text-amber-700 flex items-center gap-0.5">
                            <Globe className="w-3 h-3 text-slate-400" />
                            <span>Site</span>
                          </a>
                        )}
                        {comp.instagram && (
                          <span className="text-pink-600 font-medium">{comp.instagram}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {comp.product}
                    </td>
                    <td className="px-5 py-4 font-black text-amber-700">
                      {comp.price}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {comp.targetCustomer}
                    </td>
                    <td className="px-5 py-4 text-emerald-700 text-[11px] max-w-xs font-medium">
                      {comp.advantages}
                    </td>
                    <td className="px-5 py-4 text-red-600 text-[11px] max-w-xs font-medium">
                      {comp.weaknesses}
                    </td>
                    <td className="px-5 py-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(comp)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(comp.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Competitor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {editingComp ? "Modifier les Données du Concurrent" : "Enregistrer un Nouveau Concurrent"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nom de l'entreprise *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Produit Principal *</label>
                  <input
                    type="text"
                    required
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prix constaté (DH)</label>
                  <input
                    type="text"
                    placeholder="ex: 299 DH"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Site Web</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Instagram</label>
                  <input
                    type="text"
                    placeholder="@nom"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Client Cible</label>
                <input
                  type="text"
                  placeholder="ex: Restaurants, Freelances, Cabinets..."
                  value={formData.targetCustomer}
                  onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-emerald-700 font-bold mb-1">Avantages & Points Forts</label>
                  <textarea
                    rows={2}
                    value={formData.advantages}
                    onChange={(e) => setFormData({ ...formData, advantages: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-red-600 font-bold mb-1">Faiblesses & Opportunités pour Tektap</label>
                  <textarea
                    rows={2}
                    value={formData.weaknesses}
                    onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes Internes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
