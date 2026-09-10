import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Zap,
  QrCode
} from "lucide-react";
import { NfcCard, CardStatus } from "../../types";
import { api } from "../../services/api";

export const CardManagement: React.FC = () => {
  const [cards, setCards] = useState<NfcCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<NfcCard | null>(null);

  const [formData, setFormData] = useState({
    uid: "",
    cardSlug: "",
    targetProfileSlug: "",
    customerName: "",
    status: "active" as CardStatus,
    orderNumber: "",
    notes: ""
  });

  const fetchCards = async () => {
    try {
      const res = await api.getCards();
      if (res.success && res.data) setCards(res.data);
    } catch (err) {
      console.warn("Could not load cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleOpenAdd = () => {
    setEditingCard(null);
    const randomUid = `NFC-MA-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      uid: randomUid,
      cardSlug: randomUid.toLowerCase(),
      targetProfileSlug: "ahmed-benali",
      customerName: "",
      status: "active",
      orderNumber: "",
      notes: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card: NfcCard) => {
    setEditingCard(card);
    setFormData({
      uid: card.uid,
      cardSlug: card.cardSlug,
      targetProfileSlug: card.targetProfileSlug,
      customerName: card.customerName,
      status: card.status,
      orderNumber: card.orderNumber || "",
      notes: card.notes || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous supprimer cette carte NFC de l'inventaire ?")) return;
    try {
      await api.deleteCard(id);
      fetchCards();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCard) {
        await api.updateCard(editingCard.id, formData);
      } else {
        await api.createCard(formData);
      }
      setIsModalOpen(false);
      fetchCards();
    } catch (err) {
      alert("Erreur lors de l'enregistrement de la carte.");
    }
  };

  const filtered = cards.filter(
    (c) =>
      c.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetProfileSlug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Inventaire des Cartes & Puces NFC</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des {cards.length} tags physiques encodés, URLs de redirection (/card/slug) et compteurs de taps.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Enregistrer une Carte NFC</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher UID, client, profil cible..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
        />
      </div>

      {/* Cards Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-4">UID Puce NFC</th>
                <th className="px-5 py-4">Client Titulaire</th>
                <th className="px-5 py-4">Profil Cible (/p/...)</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Taps Enregistrés</th>
                <th className="px-5 py-4">N° Commande</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-xs">
                    Aucune carte NFC trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>{card.uid}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {card.customerName}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`/p/${card.targetProfileSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-700 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>/p/{card.targetProfileSlug}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          card.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${card.status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
                        {card.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {card.totalTaps} taps
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono text-[11px]">
                      {card.orderNumber || "—"}
                    </td>
                    <td className="px-5 py-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(card)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCard ? "Modifier la Carte NFC" : "Enregistrer une Carte NFC"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">UID Unique de la Puce *</label>
                <input
                  type="text"
                  required
                  value={formData.uid}
                  onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nom du Client / Titulaire *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Slug du Profil Cible (/p/...) *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: ahmed-benali"
                  value={formData.targetProfileSlug}
                  onChange={(e) => setFormData({ ...formData, targetProfileSlug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CardStatus })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">En attente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">N° Commande</label>
                  <input
                    type="text"
                    placeholder="NFC-2026-001"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes d'atelier</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
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
