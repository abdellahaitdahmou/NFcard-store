import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  MessageCircle,
  FileText,
  Camera,
  Image,
  Send,
  Plus,
  Edit,
  MapPin,
  Phone,
  Mail,
  User,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { Order, OrderStatus } from "../../types";
import { api } from "../../services/api";

interface OrderManagementProps {
  orders: Order[];
  onRefresh: () => Promise<void>;
}

const statusLabels: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  new: { label: "Nouvelle", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  info_requested: { label: "Infos Demandées", color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" },
  info_received: { label: "Infos Reçues", color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  design_in_progress: { label: "Design en cours", color: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-500" },
  customer_validation: { label: "Validation Client", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  production: { label: "Production & Encodage", color: "bg-cyan-50 text-cyan-700 border-cyan-200", dot: "bg-cyan-500" },
  shipped: { label: "Expédiée (Amana)", color: "bg-amber-50 text-amber-800 border-amber-300", dot: "bg-amber-500" },
  delivered: { label: "Livrée", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  completed: { label: "Clôturée", color: "bg-slate-100 text-slate-700 border-slate-300", dot: "bg-slate-500" }
};

export const OrderManagement: React.FC<OrderManagementProps> = ({ orders, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newNote, setNewNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo.phone.includes(searchTerm) ||
      (o.customerInfo.city && o.customerInfo.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      await api.updateOrderStatus(selectedOrder.id, newStatus, `Statut mis à jour : ${statusLabels[newStatus]?.label}`);
      await onRefresh();
      const updated = orders.find((o) => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    } catch (err) {
      alert("Erreur lors de la mise à jour du statut.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newNote.trim()) return;

    try {
      await api.addOrderNote(selectedOrder.id, newNote);
      setNewNote("");
      await onRefresh();
      const updated = orders.find((o) => o.id === selectedOrder.id);
      if (updated) setSelectedOrder(updated);
    } catch (err) {
      alert("Erreur lors de l'ajout de la note.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Gestion des Commandes</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des {orders.length} commandes enregistrées • Paiement à la livraison partout au Maroc.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher nom, N°, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500 shadow-xs"
          >
            <option value="all">Tous les statuts ({orders.length})</option>
            {Object.entries(statusLabels).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-4">N° Commande</th>
                <th className="px-5 py-4">Client & Ville</th>
                <th className="px-5 py-4">Article</th>
                <th className="px-5 py-4">Montant Total</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-xs">
                    Aucune commande ne correspond aux critères.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = statusLabels[order.status] || {
                    label: order.status,
                    color: "bg-slate-100 text-slate-600 border-slate-200",
                    dot: "bg-slate-400"
                  };
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-amber-700">
                        {order.orderNumber}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 text-xs">{order.customerInfo.fullName}</p>
                        <p className="text-[11px] text-slate-400">
                          {order.customerInfo.city} • {order.customerInfo.phone}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {order.productOrPackName}
                        {order.quantity > 1 && (
                          <span className="text-amber-600 ml-1 font-bold">(x{order.quantity})</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-slate-900">
                        {order.totalPrice} DH
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${statusInfo.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {order.customerInfo.phone && (
                          <a
                            href={`https://wa.me/${order.customerInfo.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour ${order.customerInfo.fullName}, nous préparons votre commande ${order.orderNumber} sur Tektap Maroc :`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 inline-flex items-center gap-1 border border-emerald-200 transition-colors shadow-xs"
                            title="Contacter sur WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Détails</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  {selectedOrder.orderNumber}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedOrder.productOrPackName}
                </h3>
                <p className="text-xs text-slate-500">
                  Enregistrée le {new Date(selectedOrder.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Status Selector */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Mettre à jour le statut :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(statusLabels).map(([statusKey, info]) => {
                  const isCurrent = selectedOrder.status === statusKey;
                  return (
                    <button
                      key={statusKey}
                      onClick={() => handleStatusChange(statusKey as OrderStatus)}
                      disabled={updatingStatus}
                      className={`p-2.5 rounded-xl text-[11px] font-bold border transition-all ${
                        isCurrent
                          ? `${info.color} ring-2 ring-slate-900 font-extrabold`
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                      }`}
                    >
                      {info.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-amber-800 uppercase tracking-wider text-[10px]">Client & Livraison</p>
                <p className="font-bold text-slate-900 text-sm">{selectedOrder.customerInfo.fullName}</p>
                <p className="text-slate-600">Société : {selectedOrder.customerInfo.companyName || "Particulier"}</p>
                <p className="text-slate-600">Ville : {selectedOrder.customerInfo.city}</p>
                <p className="text-slate-600">Adresse : {selectedOrder.customerInfo.address || "À préciser"}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">Contacts & Paiement</p>
                <p className="text-slate-700 font-semibold">Tél : {selectedOrder.customerInfo.phone}</p>
                <p className="text-slate-700">WhatsApp : {selectedOrder.customerInfo.whatsapp || selectedOrder.customerInfo.phone}</p>
                <p className="text-slate-600">Paiement : Espèces à la livraison</p>
                <p className="text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
                  Total : {selectedOrder.totalPrice} DH
                </p>
              </div>
            </div>

            {/* Files Attached */}
            {(selectedOrder.customerInfo.logoUrl || selectedOrder.customerInfo.oldCardPhotoUrl) && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Fichiers transmis par le client :</p>
                <div className="grid grid-cols-2 gap-3">
                  {selectedOrder.customerInfo.oldCardPhotoUrl && (
                    <div className="space-y-1 text-center">
                      <p className="text-[11px] text-slate-600 font-bold">Photo de l'ancienne carte :</p>
                      <a href={selectedOrder.customerInfo.oldCardPhotoUrl} target="_blank" rel="noreferrer">
                        <img
                          src={selectedOrder.customerInfo.oldCardPhotoUrl}
                          alt="Ancienne carte"
                          className="w-full h-32 object-cover rounded-xl border border-slate-200 hover:opacity-90 transition-opacity bg-white"
                        />
                      </a>
                    </div>
                  )}

                  {selectedOrder.customerInfo.logoUrl && (
                    <div className="space-y-1 text-center">
                      <p className="text-[11px] text-slate-600 font-bold">Logo d'entreprise :</p>
                      <a href={selectedOrder.customerInfo.logoUrl} target="_blank" rel="noreferrer">
                        <img
                          src={selectedOrder.customerInfo.logoUrl}
                          alt="Logo"
                          className="w-full h-32 object-contain rounded-xl border border-slate-200 bg-white p-2"
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Internal Notes */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Notes Internes d'Atelier :</p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs">
                {selectedOrder.adminNotes && selectedOrder.adminNotes.length > 0 ? (
                  selectedOrder.adminNotes.map((note, nIdx) => (
                    <div key={nIdx} className="p-2.5 rounded-xl bg-white text-slate-700 border border-slate-200">
                      • {note}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs italic">Aucune note enregistrée.</p>
                )}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ajouter une note de suivi..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  Ajouter
                </button>
              </form>
            </div>

            {/* Close Button */}
            <div className="text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
