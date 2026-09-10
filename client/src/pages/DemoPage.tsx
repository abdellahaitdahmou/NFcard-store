import React from "react";
import { InteractiveNfcDemo } from "../components/home/InteractiveNfcDemo";
import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag, Eye, ArrowRight } from "lucide-react";

export const DemoPage: React.FC = () => {
  return (
    <div className="bg-slate-50/60 min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold shadow-sm">
            <Eye className="w-3.5 h-3.5 text-brand-500" />
            <span>Simulateur & Démonstration Interactive</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Vivez l'expérience sans contact <br />
            <span className="gold-gradient-text">comme vos futurs clients.</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Testez l'ouverture instantanée d'un profil digital sur smartphone virtuel et découvrez la fluidité du partage de vos coordonnées.
          </p>
        </div>

        {/* Demo simulator component */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8">
          <InteractiveNfcDemo />
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-slate-900">Convaincu par l'expérience ?</h3>
          <div className="flex justify-center gap-4">
            <Link
              to="/commander"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Commander ma carte NFC</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
