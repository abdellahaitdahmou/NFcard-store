import React from "react";
import { ServicesSection } from "../components/home/ServicesSection";
import { OldCardSection } from "../components/home/OldCardSection";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export const Services: React.FC = () => {
  return (
    <div className="space-y-0">
      <div className="py-12 bg-gray-100 border-b border-gray-200 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Expertise & Savoir-faire NFcard
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
            Nos Solutions & Services Digitaux
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Nous combinons matériel de pointe (cartes connectées NFC) et ingénierie logicielle pour créer une présence mobile instantanée pour votre activité.
          </p>
        </div>
      </div>

      <ServicesSection />

      <OldCardSection />
    </div>
  );
};
