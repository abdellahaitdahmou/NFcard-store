import React, { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone, Clock, CheckCircle2, MessageCircle, Search } from "lucide-react";
import { ContactMessage } from "../../types";
import { api } from "../../services/api";

export const MessagesAdmin: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await api.getMessages();
      if (res.success && res.data) setMessages(res.data);
    } catch (err) {
      console.warn("Could not load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id: string, status: "new" | "read" | "replied") => {
    try {
      await api.updateMessageStatus(id, status);
      fetchMessages();
    } catch (err) {
      alert("Erreur de mise à jour");
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Messages & Demandes de Devis</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Messages reçus depuis le formulaire de contact du site Tektap Maroc.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
          />
        </div>
      </div>

      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
            Aucun message reçu pour le moment.
          </div>
        ) : (
          filtered.map((msg) => (
            <div key={msg.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                    {msg.serviceInterest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {msg.serviceInterest}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{msg.email}</span>
                    {msg.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{msg.phone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    msg.status === "new"
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : msg.status === "replied"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {msg.status === "new" ? "Nouveau" : msg.status === "replied" ? "Répondu" : "Lu"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 mb-1">{msg.subject}</p>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(msg.id, "read")}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                  >
                    Marquer Lu
                  </button>
                  <button
                    onClick={() => handleStatusChange(msg.id, "replied")}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold"
                  >
                    Marquer Répondu
                  </button>
                </div>

                {msg.phone && (
                  <a
                    href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour ${msg.name}, suite à votre message sur Tektap Maroc concernant "${msg.subject}" :`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Répondre sur WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
