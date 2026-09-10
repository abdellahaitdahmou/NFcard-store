import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, ShieldCheck, Sparkles, Truck, Users, Award, ArrowRight } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div className="bg-slate-50/60 min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Notre Histoire & Vision au Maroc</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Pionniers des Cartes Connectées <br />
            <span className="gold-gradient-text">au Royaume du Maroc.</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            NFcard Maroc a été fondée avec une mission claire : aider les commerçants, professionnels et entreprises marocaines à passer du papier jetable à une identité digitale prestigieuse, interactive et durable.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Excellence & Prestige</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Matériaux rigoureusement sélectionnés (PVC Soft-Touch, Métal brossé ou Bois noble) pour un impact mémorable lors de vos rencontres d'affaires.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Service Clé-en-main</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nous levons tous les freins techniques : nos graphistes conçoivent votre profil digital à partir de votre ancienne carte papier ou de vos coordonnées.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mx-auto flex items-center justify-center">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Proximité Locale</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Équipe basée au Maroc avec support WhatsApp 7j/7, paiement à la livraison et expédition rapide dans toutes les villes marocaines.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-amber-200 shadow-xl shadow-amber-500/5 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Rejoignez la Révolution Digitale</h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Plus de 850 professionnels au Maroc ont déjà adopté NFcard pour doubler leurs contacts utiles.
          </p>
          <div className="flex justify-center">
            <Link
              to="/commander"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all"
            >
              <span>Commander ma carte NFC</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
