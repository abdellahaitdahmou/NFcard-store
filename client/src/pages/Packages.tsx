import React from "react";
import { BusinessSolutionsGrid } from "../components/home/BusinessSolutionsGrid";
import { Link } from "react-router-dom";
import { Briefcase, ShoppingBag, MessageCircle, ShieldCheck, CheckCircle2, Zap, HelpCircle } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

export const Packages: React.FC = () => {
  const { openWhatsAppChat } = useSettings();

  const faqs = [
    {
      q: "Y a-t-il des frais mensuels ou un abonnement ?",
      a: "Non, aucun abonnement caché. Vous payez une seule fois à l'achat de votre carte NFC et votre profil digital reste actif et modifiable gratuitement à vie."
    },
    {
      q: "Comment se déroule le paiement ?",
      a: "Nous proposons le Paiement à la Livraison (Cash on Delivery) partout au Maroc. Vous réglez en espèces au livreur uniquement à réception de votre colis."
    },
    {
      q: "Quels sont les délais de livraison au Maroc ?",
      a: "La conception de votre profil digital se fait sous 24h. La livraison physique de votre carte NFC prend entre 24h et 48h selon votre ville (Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, etc.)."
    },
    {
      q: "Puis-je modifier mes informations après réception ?",
      a: "Oui, vous pouvez mettre à jour votre numéro, photos, adresse, liens sociaux ou catalogue à tout moment sans changer de carte physique."
    }
  ];

  return (
    <div className="bg-slate-50/60 min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-sm">
            <Briefcase className="w-3.5 h-3.5 text-orange-600" />
            <span>Packs Métiers Prêts à l'Emploi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Tarifs clairs & transparents. <br />
            <span className="gold-gradient-text">Sans abonnement, à vie.</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Chaque pack inclut votre carte physique NFC sans contact, votre profil digital complet, la conception par nos designers et la livraison au Maroc.
          </p>
        </div>

        {/* Business Solutions Grid Component */}
        <BusinessSolutionsGrid />

        {/* Custom Business Quote Banner */}
        <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50/40 p-8 sm:p-12 rounded-3xl border border-orange-200 shadow-xl shadow-orange-500/5 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold">
            <span>Solution Entreprises & Équipes</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Vous avez une équipe commerciale ou un réseau d'agences ?
          </h3>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Nous concevons des flottes de cartes NFC personnalisées avec charte graphique d'entreprise et gestion synchronisée de vos collaborateurs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => openWhatsAppChat("Bonjour, je souhaite un devis personnalisé pour équiper les collaborateurs de mon entreprise en cartes NFC.")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Demander un devis sur WhatsApp</span>
            </button>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs shadow-sm transition-all text-center"
            >
              Formulaire de contact entreprise
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-8 pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Questions Fréquentes sur les Tarifs</h3>
            <p className="text-xs text-slate-500">Tout ce que vous devez savoir avant de commander</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, fIdx) => (
              <div key={fIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{faq.q}</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
