import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

export const FaqPage: React.FC = () => {
  const { openWhatsAppChat } = useSettings();

  const faqItems = [
    {
      q: "Comment fonctionne une carte de visite NFC NFcard ?",
      a: "La carte contient une puce NFC intégrée. Lorsque vous approchez votre carte du haut d'un iPhone ou du dos d'un smartphone Android, une notification s'affiche automatiquement sans aucune application à installer, ouvrant votre profil digital complet."
    },
    {
      q: "Et si le smartphone de mon interlocuteur n'a pas le NFC ?",
      a: "Toutes nos cartes incluent au dos un QR Code personnalisé haute définition relié exactement au même profil digital, permettant une compatibilité à 100% sur tous les téléphones équipés d'un appareil photo."
    },
    {
      q: "Puis-je modifier mes coordonnées et mes photos après avoir reçu ma carte ?",
      a: "Oui, à tout moment ! Vous pouvez mettre à jour vos numéros de téléphone, vos liens Instagram, votre catalogue de produits ou votre logo sans changer de carte physique."
    },
    {
      q: "Quels sont les délais et modes de livraison au Maroc ?",
      a: "La création graphique de votre profil est effectuée sous 24h ouvrées. La carte physique est expédiée et livrée en 24h à 48h dans toutes les villes du Maroc (Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, etc.)."
    },
    {
      q: "Comment fonctionne le paiement à la livraison ?",
      a: "Vous réglez en espèces (Cash on Delivery) directement auprès du livreur à la réception de votre colis. Aucun paiement bancaire préalable n'est obligatoire."
    },
    {
      q: "La carte nécessite-t-elle une batterie ou une recharge ?",
      a: "Non, la puce NFC fonctionne passivement grâce aux ondes radio émises par le smartphone qui la lit. Elle ne nécessite aucune pile ni recharge et a une durée de vie illimitée."
    }
  ];

  return (
    <div className="bg-slate-50/60 min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Foire Aux Questions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Tout ce que vous devez savoir sur <br />
            <span className="gold-gradient-text">les Cartes NFC NFcard.</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Retrouvez les réponses aux questions les plus fréquemment posées par les professionnels au Maroc.
          </p>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-start gap-3">
                <span className="text-amber-600 font-extrabold">Q.</span>
                <span>{item.q}</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed pl-6">{item.a}</p>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-sm text-center space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">Vous avez une autre question ?</h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Notre équipe d'assistance est joignable 7j/7 sur WhatsApp pour vous conseiller sur le choix de votre pack.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openWhatsAppChat("Bonjour, j'ai une question concernant les cartes NFC NFcard.")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Poser ma question sur WhatsApp</span>
            </button>
            <Link
              to="/commander"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Commander ma carte</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
