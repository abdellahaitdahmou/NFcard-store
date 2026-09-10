import React, { useState } from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { MessageCircle, X, Sparkles, Send } from "lucide-react";

export const WhatsAppFloat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");
  const { settings, openWhatsAppChat } = useSettings();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    openWhatsAppChat(customMsg);
    setIsOpen(false);
    setCustomMsg("");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Popover Window */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] xs:w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 text-slate-800 animate-in fade-in slide-in-from-bottom-5 right-0">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <MessageCircle className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">Conseiller Tektap Maroc</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  En ligne maintenant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-3 text-xs text-gray-600 leading-relaxed bg-gray-100/70 p-3 rounded-xl my-3 border border-gray-200">
            👋 Bonjour ! Vous souhaitez commander votre carte NFC ou transformer votre ancienne carte de visite ? Posez-nous votre question ici :
          </div>

          {/* Quick choices */}
          <div className="space-y-1.5 mb-3">
            <button
              onClick={() => openWhatsAppChat("Bonjour, je souhaite commander la carte NFC Business à 349 DH.")}
              className="w-full text-left text-xs px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              👉 Commander la carte NFC Business
            </button>
            <button
              onClick={() => openWhatsAppChat("Bonjour, j'ai une ancienne carte de visite à vous envoyer.")}
              className="w-full text-left text-xs px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              📸 Envoyer mon ancienne carte de visite
            </button>
            <button
              onClick={() => openWhatsAppChat("Bonjour, je souhaite un devis pour équiper notre entreprise/restaurant.")}
              className="w-full text-left text-xs px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              🏢 Devis Pack Entreprise / Restaurant
            </button>
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-gray-900 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-gray-900 shadow-emeraldGlow hover:scale-110 active:scale-95 transition-all"
        aria-label="Contacter sur WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-slate-900"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white/20" />
      </button>
    </div>
  );
};
