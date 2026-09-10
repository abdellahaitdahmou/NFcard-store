import React from "react";
import { ShieldCheck } from "lucide-react";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-slate-50/60 min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Conformité Loi 09-08 & CNDP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Politique de Confidentialité</h1>
          <p className="text-xs text-slate-500">Dernière mise à jour : 2026 - Tektap NFC Maroc</p>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Collecte des Données Personnelles</h2>
            <p>
              Tektap NFC Maroc collecte uniquement les informations nécessaires au traitement de votre commande (nom, téléphone, adresse de livraison) et à la configuration de votre profil digital public (liens sociaux, coordonnées professionnelles, logo).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Utilisation & Confidentialité</h2>
            <p>
              Vos données ne sont jamais vendues, cédées ou louées à des tiers. Les informations affichées sur votre profil digital restent sous votre contrôle exclusif et peuvent être modifiées ou supprimées à tout moment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Hébergement Sécurisé</h2>
            <p>
              Nos serveurs et bases de données bénéficient d'un chiffrement SSL / HTTPS haute sécurité pour garantir la protection de vos échanges et de vos coordonnées.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
