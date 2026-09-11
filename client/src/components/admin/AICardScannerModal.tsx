import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles, Upload, Scan, Loader2, CheckCircle2, AlertCircle, X,
  User, Building2, Briefcase, Phone, MessageCircle, Mail, Globe,
  MapPin, Tag, Palette, Link as LinkIcon, Key, ExternalLink, ArrowRight,
  Eye, RefreshCw, Layers, Instagram, Facebook, Linkedin, Youtube, Twitter,
  Plus, Trash2, Check
} from "lucide-react";
import { ExtractedCardData, scanCardWithGemini, scanCardWithOCR, formatSocialUrl } from "../../services/aiCardScanner";
import { api } from "../../services/api";

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.83a8.2 8.2 0 0 0 4.79 1.52V4.56a4.85 4.85 0 0 1-1.02-.13z"/>
  </svg>
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: ExtractedCardData, cardImageUrl?: string) => void;
  initialImageUrl?: string;
}

export const AICardScannerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApplyData,
  initialImageUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialImageUrl || "");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [extractedData, setExtractedData] = useState<ExtractedCardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [geminiKey, setGeminiKey] = useState<string>(
    localStorage.getItem("nfcard_gemini_api_key") || ""
  );
  const [showKeyConfig, setShowKeyConfig] = useState(false);

  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image (JPG, PNG, WebP).");
      return;
    }
    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setExtractedData(null);
  };

  const handleStartScan = async () => {
    if (!selectedFile && !imagePreview) {
      setError("Veuillez d'abord charger une photo de carte de visite.");
      return;
    }

    setIsScanning(true);
    setError(null);
    setScanProgress(15);
    setScanStep("Démarrage de l'analyse IA...");

    try {
      let uploadedUrl = imagePreview;

      if (selectedFile) {
        setScanStep("Téléversement de l'image de la carte...");
        setScanProgress(25);
        const upRes = await api.uploadFile(selectedFile);
        if (upRes.success && upRes.fileUrl) {
          uploadedUrl = upRes.fileUrl;
        }
      }

      let result: ExtractedCardData;
      if (geminiKey.trim()) {
        localStorage.setItem("nfcard_gemini_api_key", geminiKey.trim());
        result = await scanCardWithGemini(
          selectedFile || imagePreview,
          geminiKey.trim(),
          (step, pct) => {
            setScanStep(step);
            setScanProgress(pct);
          }
        );
      } else {
        result = await scanCardWithOCR(selectedFile || imagePreview, (step, pct) => {
          setScanStep(step);
          setScanProgress(pct);
        });
      }

      setExtractedData(result);
    } catch (err: any) {
      console.error("Scanning error:", err);
      setError(err?.message || "Erreur lors de l'analyse de la carte.");
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  const handleApply = () => {
    if (!extractedData) return;
    onApplyData(extractedData, imagePreview);
    onClose();
  };

  const addServiceItem = () => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      services: [
        ...extractedData.services,
        { title: "Nouveau Service", description: "Description du service proposé" }
      ]
    });
  };

  const removeServiceItem = (index: number) => {
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      services: extractedData.services.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-orange-50 via-white to-amber-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                Scanner IA : Carte de Visite & Flyer
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Réseaux + Services + Contacts
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Extrait automatiquement tous les réseaux sociaux, services, numéros, email et coordonnées.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key toggle banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>
                Moteur IA :{" "}
                <strong>
                  {geminiKey.trim() ? "Google Gemini 1.5 Flash Vision (Multimodal Ultra-Précis)" : "Moteur OCR Intelligent Intégré (Autonome & Gratuit)"}
                </strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className="text-orange-600 hover:text-orange-700 font-bold text-[11px] inline-flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" />
              {showKeyConfig ? "Masquer config" : "Activer Gemini Vision API"}
            </button>
          </div>

          {/* Optional Gemini Key Input */}
          {showKeyConfig && (
            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200 space-y-2 text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="font-bold text-orange-950">
                  Clé API Google Gemini (Optionnelle - 100% Gratuite)
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-600 hover:underline font-bold text-[10px] inline-flex items-center gap-0.5"
                >
                  Obtenir ma clé gratuite en 1 clic (Google AI Studio) <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                placeholder="Collez votre clé API Gemini ici..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <p className="text-[10px] text-orange-800 leading-relaxed">
                💡 Recommandé : avec une clé Gemini gratuite, l'IA reconnaît même les cartes froissées, les logos stylisés et toutes les polices avec 99.9% de précision.
              </p>
            </div>
          )}

          {/* Main 2-column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Card Upload / Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Photo de la carte / flyer :
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all text-center flex flex-col items-center justify-center min-h-[250px] overflow-hidden ${
                  imagePreview
                    ? "border-orange-300 bg-slate-50"
                    : "border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/20 cursor-pointer"
                }`}
                onClick={() => !imagePreview && fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-inner bg-slate-900/5 group">
                    <img
                      src={imagePreview}
                      alt="Carte de visite"
                      className="w-full h-full object-contain"
                    />

                    {/* Laser scanning animation */}
                    {isScanning && (
                      <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_20px_#fd6701] top-0 animate-bounce" />
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-lg shadow"
                      >
                        Remplacer
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview("");
                          setSelectedFile(null);
                          setExtractedData(null);
                        }}
                        className="p-1.5 bg-red-600 text-white rounded-lg shadow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 py-8">
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Glissez la photo de la carte ici
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        ou cliquez pour choisir un fichier (JPG, PNG)
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                />
              </div>

              {/* Scan Trigger Button */}
              <button
                type="button"
                disabled={!imagePreview || isScanning}
                onClick={handleStartScan}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{scanStep || "Analyse en cours..."}</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Lancer le Scan Complet de la Carte</span>
                  </>
                )}
              </button>

              {/* Progress bar */}
              {isScanning && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>{scanStep}</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Right: Extracted Data Review (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Informations Complètes Extraites :
              </label>

              {extractedData ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 max-h-[480px] overflow-y-auto text-xs">
                  {/* Status header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Carte analysée avec succès
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">
                      {extractedData.engineUsed === "gemini_vision" ? "Gemini 1.5 Flash Vision" : "Moteur OCR Intelligent"}
                    </span>
                  </div>

                  {/* Section 1: Identity */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      1. Identité & Société
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500">Nom / Titulaire :</span>
                        <input
                          type="text"
                          value={extractedData.ownerName}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, ownerName: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Société / Marque :</span>
                        <input
                          type="text"
                          value={extractedData.companyName}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, companyName: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500">Fonction / Titre :</span>
                        <input
                          type="text"
                          value={extractedData.jobTitle}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, jobTitle: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Slug URL (/p/...) :</span>
                        <input
                          type="text"
                          value={extractedData.slug}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, slug: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-orange-600"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500">Bio / Slogan extrait :</span>
                      <textarea
                        rows={2}
                        value={extractedData.bio}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, bio: e.target.value })
                        }
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Section 2: Contact Numbers */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      2. Contacts & Coordonnées
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500">WhatsApp (Direct) :</span>
                        <input
                          type="text"
                          value={extractedData.whatsapp}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, whatsapp: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-emerald-700"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Téléphone (Fixe / Appel) :</span>
                        <input
                          type="text"
                          value={extractedData.phone}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, phone: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500">Email :</span>
                        <input
                          type="email"
                          value={extractedData.email}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, email: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Ville :</span>
                        <input
                          type="text"
                          value={extractedData.city}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, city: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Social Media */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>3. Réseaux Sociaux Détectés</span>
                      <span className="text-[9px] text-orange-600 lowercase font-normal">
                        liens cliquables automatiques
                      </span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 flex-shrink-0">
                          <Facebook className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          placeholder="Lien Facebook..."
                          value={extractedData.socials.facebook || ""}
                          onChange={(e) =>
                            setExtractedData({
                              ...extractedData,
                              socials: { ...extractedData.socials, facebook: e.target.value }
                            })
                          }
                          className="w-full px-2 py-1.5 text-[11px] text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <span className="w-8 h-8 flex items-center justify-center bg-pink-50 text-pink-600 flex-shrink-0">
                          <Instagram className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          placeholder="Lien Instagram..."
                          value={extractedData.socials.instagram || ""}
                          onChange={(e) =>
                            setExtractedData({
                              ...extractedData,
                              socials: { ...extractedData.socials, instagram: e.target.value }
                            })
                          }
                          className="w-full px-2 py-1.5 text-[11px] text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <span className="w-8 h-8 flex items-center justify-center bg-slate-950 text-white flex-shrink-0">
                          <TikTokIcon className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          placeholder="Lien TikTok..."
                          value={extractedData.socials.tiktok || ""}
                          onChange={(e) =>
                            setExtractedData({
                              ...extractedData,
                              socials: { ...extractedData.socials, tiktok: e.target.value }
                            })
                          }
                          className="w-full px-2 py-1.5 text-[11px] text-slate-900 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-700 flex-shrink-0">
                          <Linkedin className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="text"
                          placeholder="Lien LinkedIn..."
                          value={extractedData.socials.linkedin || ""}
                          onChange={(e) =>
                            setExtractedData({
                              ...extractedData,
                              socials: { ...extractedData.socials, linkedin: e.target.value }
                            })
                          }
                          className="w-full px-2 py-1.5 text-[11px] text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Services */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        4. Services & Prestations ({extractedData.services.length})
                      </p>
                      <button
                        type="button"
                        onClick={addServiceItem}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Ajouter un service
                      </button>
                    </div>

                    {extractedData.services.length > 0 ? (
                      <div className="space-y-2">
                        {extractedData.services.map((svc, idx) => (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1.5 relative group"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={svc.title}
                                placeholder="Titre du service"
                                onChange={(e) => {
                                  const updated = [...extractedData.services];
                                  updated[idx].title = e.target.value;
                                  setExtractedData({ ...extractedData, services: updated });
                                }}
                                className="font-bold text-slate-900 text-xs bg-transparent border-b border-transparent focus:border-orange-400 focus:outline-none flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => removeServiceItem(idx)}
                                className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={svc.description}
                              placeholder="Description de la prestation..."
                              onChange={(e) => {
                                const updated = [...extractedData.services];
                                updated[idx].description = e.target.value;
                                setExtractedData({ ...extractedData, services: updated });
                              }}
                              className="text-[11px] text-slate-600 bg-transparent w-full focus:outline-none border-b border-transparent focus:border-slate-300"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        Aucun service spécifique détecté sur la carte. Cliquez sur "Ajouter un service" pour en insérer.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-80 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
                  <Scan className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                  <p className="text-xs font-medium max-w-xs">
                    Chargez la photo d'une carte de visite ou d'un flyer et lancez l'analyse pour pré-remplir automatiquement tous les champs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200"
          >
            Annuler
          </button>

          <button
            type="button"
            disabled={!extractedData}
            onClick={handleApply}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all disabled:opacity-40 disabled:pointer-events-none hover:-translate-y-0.5"
          >
            <span>🪄 Appliquer au Profil Digital</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
