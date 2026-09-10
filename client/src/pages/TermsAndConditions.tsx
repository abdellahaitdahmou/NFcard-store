import React from "react";
import { FileText } from "lucide-react";

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="bg-slate-50/60 min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Conditions de Vente au Maroc</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Conditions Générales de Vente</h1>
          <p className="text-xs text-slate-500">Applicables au Royaume du Maroc - NFcard Maroc (NFcard.ma)</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Commandes & Tarifs</h2>
            <p>
              Les prix de nos cartes et packs sont indiqués en Dirhams marocains (DH) toutes taxes comprises. La commande devient effective dès sa validation sur le site web ou par confirmation WhatsApp.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Livraison & Paiement</h2>
            <p>
              La livraison est assurée dans toutes les villes du Maroc sous 24h à 48h ouvrées. Le règlement s'effectue en espèces à la livraison (Cash on Delivery) auprès du livreur.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Garantie Puce NFC</h2>
            <p>
              Toutes nos puces NFC bénéficient d'une garantie de fonctionnement de 2 ans. En cas de défaillance technique avérée, la carte est remplacée gratuitement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
