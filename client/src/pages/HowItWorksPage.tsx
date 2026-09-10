import React from "react";
import { HowItWorks } from "../components/home/HowItWorks";
import { InteractiveNfcDemo } from "../components/home/InteractiveNfcDemo";
import { OldCardSection } from "../components/home/OldCardSection";
import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="bg-slate-50/60 min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Processus Simple & Rapide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Comment fonctionne <br />
            <span className="gold-gradient-text">votre Carte NFC NFcard ?</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            De votre commande jusqu'à votre première rencontre professionnelle, découvrez chaque étape du fonctionnement.
          </p>
        </div>

        {/* How It Works Component */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8">
          <HowItWorks />
        </div>

        {/* Interactive Demo */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8">
          <InteractiveNfcDemo />
        </div>

        {/* Old Card Section */}
        <OldCardSection />

      </div>
    </div>
  );
};
