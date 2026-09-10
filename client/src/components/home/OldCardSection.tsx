import React, { useState } from "react";
import { Camera, ArrowRight, MessageCircle, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { Link } from "react-router-dom";

export const OldCardSection: React.FC = () => {
  const { openWhatsAppChat } = useSettings();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-slate-50 border-y border-amber-200/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-amber-200/80 shadow-xl shadow-amber-500/5 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/80 text-amber-900 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Service de Numérisation Clé-en-main Maroc</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Vous avez déjà une <br />
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">ancienne carte de visite papier ?</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Pas besoin de ressaisir vos coordonnées. Prenez simplement une photo de votre carte papier actuelle ou de votre flyer : nos graphistes se chargent de concevoir votre profil digital complet gratuitement avec votre commande.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Extraction automatique de votre logo, téléphone, WhatsApp et adresse</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Création & mise en page par nos designers qualifiés en 24h</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>Validation sur WhatsApp avant impression et expédition de votre carte NFC</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/commander"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Créer ma carte digitale</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button
                onClick={() => openWhatsAppChat("Bonjour, voici la photo de mon ancienne carte de visite pour créer ma carte NFC :")}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Envoyer ma carte sur WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Upload Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50/80 rounded-3xl p-8 border-2 border-dashed border-amber-300 hover:border-amber-400 transition-colors text-center space-y-5">
              <div className="w-20 h-20 rounded-3xl bg-amber-100 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center shadow-inner">
                <Camera className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">Photo de votre ancienne carte</h3>
                <p className="text-xs text-slate-500 mt-1">Glissez votre fichier ici ou prenez une photo depuis votre mobile</p>
              </div>

              <label className="inline-block cursor-pointer px-6 py-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-800 font-bold text-xs shadow-sm transition-all">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <span>{selectedFile ? `✅ ${selectedFile.name}` : "Choisir une photo (JPG, PNG)"}</span>
              </label>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Vos informations restent 100% confidentielles</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
