const fs = require('fs');
const path = require('path');

const demoComponent = `import React, { useState } from "react";
import {
  Smartphone,
  Zap,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Play
} from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

export const InteractiveNfcDemo: React.FC = () => {
  const { openWhatsAppChat } = useSettings();
  const [activePersona, setActivePersona] = useState<"immo" | "resto" | "salon">("immo");
  const [isTapped, setIsTapped] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  const personas = {
    immo: {
      name: "Ahmed Benali",
      role: "Consultant Immobilier de Prestige",
      company: "Atlas Prestige Real Estate",
      city: "Marrakech & Casablanca",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      themeColor: "from-amber-600 to-amber-800",
      accentBg: "bg-amber-500",
      bio: "Spécialiste de la vente de villas de luxe, riads d'exception et terrains d'investissement au Maroc.",
      phone: "+212 6 61 23 45 67",
      whatsapp: "+212 6 61 23 45 67",
      email: "ahmed@atlasprestige.ma",
      services: ["Villas à la Palmeraie", "Riads Médina", "Appartements Guéliz", "Investissement Locatif"]
    },
    resto: {
      name: "Chef Karim Tazi",
      role: "Maître Restaurateur & Chef Exécutif",
      company: "Le Jardin Secret Marrakech",
      city: "Guéliz, Marrakech",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80",
      themeColor: "from-orange-600 to-amber-700",
      accentBg: "bg-orange-500",
      bio: "Cuisine marocaine raffinée et saveurs méditerranéennes au cœur d'un riad historique.",
      phone: "+212 5 24 43 12 34",
      whatsapp: "+212 6 62 88 99 00",
      email: "reservation@lejardinsecret.ma",
      services: ["Menu Dégustation", "Réservation Table", "Événements Privés", "Avis Google 5★"]
    },
    salon: {
      name: "Sara Kabbaj",
      role: "Directrice Artistique & Coiffure",
      company: "Maison Kabbaj Beauté",
      city: "Triangle d'Or, Casablanca",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      themeColor: "from-pink-600 to-rose-700",
      accentBg: "bg-pink-500",
      bio: "Salon de haute coiffure, soins capillaires experts et maquillage événementiel.",
      phone: "+212 5 22 36 78 90",
      whatsapp: "+212 6 63 11 22 33",
      email: "contact@maisonkabbaj.ma",
      services: ["Balayage & Coloration", "Soins Botox Capillaire", "Coiffure Mariée", "Prise de RDV"]
    }
  };

  const current = personas[activePersona];

  const handleSimulateTap = () => {
    setShowAnimation(true);
    setIsTapped(false);
    setTimeout(() => {
      setIsTapped(true);
      setShowAnimation(false);
    }, 700);
  };

  return (
    <section className="py-24 bg-white border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-sm">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulateur en Direct</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Testez l'expérience client <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">sur smartphone virtuel.</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Cliquez sur "Simuler un Tap NFC" pour voir comment la carte connectée réagit instantanément sur un smartphone.
          </p>

          {/* Persona selector pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActivePersona("immo")}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activePersona === "immo"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }\`}
            >
              🏛️ Consultant Immobilier
            </button>
            <button
              onClick={() => setActivePersona("resto")}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activePersona === "resto"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }\`}
            >
              🍽️ Restaurant & Menu
            </button>
            <button
              onClick={() => setActivePersona("salon")}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activePersona === "salon"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }\`}
            >
              ✨ Studio Beauté & Soins
            </button>
          </div>
        </div>

        {/* Demo Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-5xl mx-auto">
          
          {/* Left instructions & trigger */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
              <h3 className="text-xl font-bold text-slate-900">Comment ça se passe ?</h3>
              
              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p><strong className="text-slate-900">Approchez votre carte NFC</strong> du haut d'un iPhone ou du dos d'un smartphone Android.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p><strong className="text-slate-900">Une notification apparaît</strong> automatiquement sans aucune application à installer.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p><strong className="text-slate-900">Le profil s'ouvre</strong> avec vos liens directs WhatsApp, vCard et itinéraire Maps.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSimulateTap}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Simuler un Tap NFC sur l'écran</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Smartphone Mockup */}
          <div className="lg:col-span-7 flex justify-center relative">
            
            {/* Phone Body */}
            <div className="w-[320px] sm:w-[360px] bg-slate-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-800 relative ring-1 ring-slate-950/20">
              
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-950 rounded-full z-30 flex items-center justify-end px-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              {/* Screen Canvas */}
              <div className="bg-slate-950 rounded-[38px] overflow-hidden text-white min-h-[580px] flex flex-col justify-between relative">
                
                {/* NFC Tap Animation Overlay */}
                {showAnimation && (
                  <div className="absolute inset-0 bg-black/80 z-40 flex items-center justify-center p-6 text-center space-y-3">
                    <div>
                      <div className="w-16 h-16 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center animate-ping mb-4">
                        <Zap className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-sm text-white">Lecture de la puce NFC...</p>
                      <p className="text-[11px] text-slate-400">Ouverture du profil {current.name}</p>
                    </div>
                  </div>
                )}

                {/* Profile View Inside Screen */}
                {isTapped ? (
                  <div className="p-5 space-y-4 pt-12">
                    
                    {/* Header profile info */}
                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 rounded-2xl mx-auto p-[2px] bg-gradient-to-tr from-amber-400 to-emerald-400 overflow-hidden shadow-lg">
                        <img src={current.avatar} alt={current.name} className="w-full h-full object-cover rounded-[14px]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{current.name}</h4>
                        <p className="text-xs text-amber-400 font-medium">{current.role}</p>
                        <p className="text-[11px] text-slate-400">{current.company} • {current.city}</p>
                      </div>
                    </div>

                    {/* Quick 3 Contact Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <a
                        href={\`https://wa.me/\${current.whatsapp.replace(/[^0-9]/g, "")}\`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-center text-[11px] font-bold text-white flex flex-col items-center gap-1 shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={\`tel:\${current.phone.replace(/[^0-9]/g, "")}\`}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-center text-[11px] font-bold text-white flex flex-col items-center gap-1 border border-slate-700"
                      >
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span>Appeler</span>
                      </a>
                      <a
                        href={\`mailto:\${current.email}\`}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-center text-[11px] font-bold text-white flex flex-col items-center gap-1 border border-slate-700"
                      >
                        <Mail className="w-4 h-4 text-amber-400" />
                        <span>Email</span>
                      </a>
                    </div>

                    {/* Big Save Contact Button */}
                    <button
                      onClick={() => alert("Le contact " + current.name + " a été téléchargé au format vCard (.vcf) !")}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Enregistrer dans mes contacts</span>
                    </button>

                    {/* Services Chips */}
                    <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 space-y-2 text-[11px]">
                      <span className="font-semibold text-slate-300 block">Services & Spécialités :</span>
                      <div className="flex flex-wrap gap-1.5">
                        {current.services.map((srv, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6 text-center text-slate-500 text-xs">
                    Approchez la carte NFC...
                  </div>
                )}

                {/* Footer bar */}
                <div className="p-3 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <Zap className="w-3 h-3 text-emerald-400" /> Powered by Tektap Maroc
                  </span>
                  <span>🇲🇦 NFC Pro</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
`;

fs.writeFileSync(path.join(__dirname, 'client', 'src', 'components', 'home', 'InteractiveNfcDemo.tsx'), demoComponent, 'utf8');
console.log('InteractiveNfcDemo.tsx updated');
