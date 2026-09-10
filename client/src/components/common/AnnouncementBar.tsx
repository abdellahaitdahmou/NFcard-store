import React, { useState } from "react";
import { X, Truck } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="bg-emerald-600 text-white py-2.5 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
        <Truck className="w-4 h-4 flex-shrink-0" />
        <span>
          <span className="font-bold">Livraison gratuite</span> partout au Maroc
          <span className="hidden sm:inline mx-2 opacity-50">·</span>
          <span className="hidden sm:inline">Creation de profil offerte · Paiement a la livraison</span>
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-emerald-700 transition-colors"
        aria-label="Fermer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};