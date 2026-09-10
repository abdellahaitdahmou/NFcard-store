const fs = require('fs');
const path = require('path');

// 1. OldCardSection.tsx
const oldCardSection = `import React, { useState } from "react";
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
                <span>{selectedFile ? \`✅ \${selectedFile.name}\` : "Choisir une photo (JPG, PNG)"}</span>
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
`;

fs.writeFileSync(path.join(__dirname, 'client', 'src', 'components', 'home', 'OldCardSection.tsx'), oldCardSection, 'utf8');
console.log('OldCardSection.tsx updated');

// 2. Footer.tsx
const footer = `import React from "react";
import { Link } from "react-router-dom";
import { Zap, Phone, Mail, MapPin, MessageCircle, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

export const Footer: React.FC = () => {
  const { settings, openWhatsAppChat } = useSettings();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      
      {/* Top Value Badges */}
      <div className="border-b border-slate-800/80 py-10 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Livraison Express Maroc</h4>
                <p className="text-xs text-slate-400">24h à 48h dans toutes les villes</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Paiement à la Livraison</h4>
                <p className="text-xs text-slate-400">Réglez en espèces à la réception</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Garantie Puce 2 Ans</h4>
                <p className="text-xs text-slate-400">Sans contact haute sensibilité</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Support Local 7j/7</h4>
                <p className="text-xs text-slate-400">Assistance WhatsApp continue</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight">
                Tek<span className="text-emerald-400">tap</span> <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Maroc</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              La solution de référence au Royaume du Maroc pour créer, gérer et partager vos cartes de visite NFC intelligentes et profils professionnels sans contact.
            </p>

            <div className="pt-2">
              <button
                onClick={() => openWhatsAppChat()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuter sur WhatsApp ({settings.whatsappDisplay})</span>
              </button>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/products" className="hover:text-emerald-400 transition-colors">Nos Cartes NFC</Link></li>
              <li><Link to="/packs" className="hover:text-emerald-400 transition-colors">Packs Métiers</Link></li>
              <li><Link to="/solutions" className="hover:text-emerald-400 transition-colors">Solutions par Secteur</Link></li>
              <li><Link to="/templates" className="hover:text-emerald-400 transition-colors">Galerie de Modèles</Link></li>
              <li><Link to="/demo" className="hover:text-emerald-400 transition-colors">Démonstration Live</Link></li>
              <li><Link to="/comment-ca-marche" className="hover:text-emerald-400 transition-colors">Comment ça marche</Link></li>
            </ul>
          </div>

          {/* Col 4: Solutions Métiers */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Packs Métiers</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/packs" className="hover:text-emerald-400 transition-colors">Pack Restaurant & Café</Link></li>
              <li><Link to="/packs" className="hover:text-emerald-400 transition-colors">Pack Agent Immobilier</Link></li>
              <li><Link to="/packs" className="hover:text-emerald-400 transition-colors">Pack Beauté & Salons</Link></li>
              <li><Link to="/packs" className="hover:text-emerald-400 transition-colors">Pack Freelance & Tech</Link></li>
              <li><Link to="/packs" className="hover:text-emerald-400 transition-colors">Pack Flotte Entreprise</Link></li>
              <li><Link to="/commander" className="hover:text-emerald-400 transition-colors">Commander ma carte</Link></li>
            </ul>
          </div>

          {/* Col 5: Coordonnées Maroc */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Contact & Support</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {settings.supportPhone}</p>
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-amber-400" /> {settings.supportEmail}</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-blue-400" /> Casablanca & Marrakech, Maroc</p>
              <p className="text-[11px] text-slate-500 pt-1">🇲🇦 Expédition dans tout le Royaume</p>
            </div>
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Tektap NFC Maroc. Tous droits réservés. Conforme CNDP loi 09-08.</p>
          <div className="flex gap-6">
            <Link to="/politique-confidentialite" className="hover:text-slate-400">Confidentialité</Link>
            <Link to="/conditions-generales" className="hover:text-slate-400">Conditions de Vente</Link>
            <Link to="/admin/login" className="hover:text-emerald-400">Accès Admin</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
`;

fs.writeFileSync(path.join(__dirname, 'client', 'src', 'components', 'common', 'Footer.tsx'), footer, 'utf8');
console.log('Footer.tsx updated');

// 3. Products.tsx
const productsPage = `import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Product } from "../types";
import { useSettings } from "../contexts/SettingsContext";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Zap,
  MessageCircle,
  Layers,
  Star
} from "lucide-react";

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { openWhatsAppChat } = useSettings();

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const res = await api.getProducts();
        if (res.success && res.data) setProducts(res.data);
      } catch (err) {
        console.warn("Could not load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProds();
  }, []);

  return (
    <div className="py-16 sm:py-24 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-sm">
            <CreditCard className="w-3.5 h-3.5 text-amber-500" />
            <span>Gamme Cartes Physiques & Puces NFC</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Cartes de Visite NFC Premium. <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">Finitions Luxe & Haute Technologie.</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Chaque modèle est équipé de notre puce sans contact haute vitesse et inclut la création offerte de votre profil digital par nos graphistes.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((prod) => (
            <div
              key={prod.id}
              className={\`bg-white rounded-3xl p-7 border flex flex-col justify-between transition-all duration-300 relative \${
                prod.isPopular
                  ? "border-amber-400 shadow-xl shadow-amber-500/10 ring-2 ring-amber-400/30 md:-translate-y-2"
                  : "border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
              }\`}
            >
              {prod.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md">
                  Le Plus Populaire
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {prod.category}
                  </span>
                  {prod.badge && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{prod.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{prod.description}</p>

                {/* Price Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">Prix TTC</span>
                  <div>
                    <span className="text-3xl font-black text-slate-900">{prod.price}</span>
                    <span className="text-sm font-bold text-amber-600 ml-1">DH</span>
                    {prod.comparePrice && (
                      <span className="text-xs text-slate-400 line-through ml-2">
                        {prod.comparePrice} DH
                      </span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                  {prod.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <Link
                  to={\`/commander?product=\${prod.slug}\`}
                  className={\`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs shadow-sm transition-all \${
                    prod.isPopular
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/20"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }\`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Commander maintenant</span>
                </Link>

                <button
                  onClick={() => openWhatsAppChat(\`Bonjour, je souhaite commander la carte \${prod.name} à \${prod.price} DH.\`)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Commander sur WhatsApp</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Value Prop Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-2xl font-bold text-slate-900">Qualité Matériaux & Garantie Sans Contact</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Toutes nos cartes sont conçues avec des puces NFC haute portée conformes à la norme ISO/IEC 14443 Type A. Elles sont 100% compatibles sans contact avec tous les modèles d'iPhone et smartphones Android récents, sans aucune pile ni batterie.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Garantie 2 ans puces</h4>
                <p className="text-[11px] text-slate-500">Remplacement immédiat si défaut</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Profil digital modifiable</h4>
                <p className="text-[11px] text-slate-500">Mises à jour gratuites à vie</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
`;

fs.writeFileSync(path.join(__dirname, 'client', 'src', 'pages', 'Products.tsx'), productsPage, 'utf8');
console.log('Products.tsx updated');
