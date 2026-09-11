import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles, Upload, Scan, Loader2, CheckCircle2, AlertCircle, X,
  User, Building2, Briefcase, Phone, MessageCircle, Mail, Globe,
  MapPin, Tag, Palette, Link as LinkIcon, Key, ExternalLink, ArrowRight,
  Eye, RefreshCw, Layers
} from "lucide-react";
import { ExtractedCardData, scanCardWithGemini, scanCardWithOCR } from "../../services/aiCardScanner";
import { api } from "../../services/api";

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
    setScanProgress(10);
    setScanStep("Démarrage de l'analyse IA...");

    try {
      let uploadedUrl = imagePreview;

      // If user uploaded a new file, upload it to the server first
      if (selectedFile) {
        setScanStep("Téléversement de l'image de la carte...");
        setScanProgress(25);
        const upRes = await api.uploadFile(selectedFile);
        if (upRes.success && upRes.fileUrl) {
          uploadedUrl = upRes.fileUrl;
        }
      }

      // Execute AI scanning
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
      setError(err?.message || "Erreur lors de l'analyse de la carte. Veuillez réessayer.");
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-orange-50 via-white to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                Scanner une Carte de Visite avec l'IA
                <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full border border-orange-200">
                  AI Auto-Fill
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Extrait automatiquement nom, entreprise, téléphone, WhatsApp, email et réseaux depuis une photo.
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
                  {geminiKey.trim() ? "Google Gemini Vision (Précision 99.9%)" : "Moteur OCR Intelligent Intégré (Gratuit)"}
                </strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className="text-orange-600 hover:text-orange-700 font-bold text-[11px] inline-flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" />
              {showKeyConfig ? "Fermer config" : "Configurer clé Gemini"}
            </button>
          </div>

          {/* Optional Gemini Key Input */}
          {showKeyConfig && (
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2 text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="font-bold text-orange-950">
                  Clé API Google Gemini (Optionnel)
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-600 hover:underline font-bold text-[10px] inline-flex items-center gap-0.5"
                >
                  Obtenir une clé gratuite (Google AI Studio) <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <p className="text-[10px] text-orange-800 leading-relaxed">
                💡 Si aucune clé n'est renseignée, le système utilise automatiquement le moteur OCR local intégré sans aucune configuration requise.
              </p>
            </div>
          )}

          {/* Image Upload / Dropzone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Left: Upload and Card Preview */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Photo de la carte physique :
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all text-center flex flex-col items-center justify-center min-h-[220px] overflow-hidden ${
                  imagePreview
                    ? "border-orange-300 bg-slate-50"
                    : "border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/20 cursor-pointer"
                }`}
                onClick={() => !imagePreview && fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-inner bg-slate-900/5 group">
                    <img
                      src={imagePreview}
                      alt="Carte de visite"
                      className="w-full h-full object-contain"
                    />

                    {/* Laser Scanner Effect when Scanning */}
                    {isScanning && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_15px_#fd6701] animate-pulse top-0 animate-[bounce_2s_infinite]" />
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
                  <div className="space-y-2 py-6">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Glissez la photo de la carte ici
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        ou cliquez pour parcourir vos fichiers (JPG, PNG)
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

              {/* Action Button */}
              <button
                type="button"
                disabled={!imagePreview || isScanning}
                onClick={handleStartScan}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{scanStep || "Analyse en cours..."}</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Lancer l'Analyse IA de la Carte</span>
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

            {/* Right: Extracted Data Review */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Informations extraites par l'IA :
              </label>

              {extractedData ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 max-h-[380px] overflow-y-auto text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Données extraites avec succès
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">
                      {extractedData.engineUsed === "gemini_vision" ? "Gemini 1.5 Flash" : "Smart OCR Engine"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Titulaire :</span>
                      <input
                        type="text"
                        value={extractedData.ownerName}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, ownerName: e.target.value })
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Société :</span>
                        <input
                          type="text"
                          value={extractedData.companyName}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, companyName: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Fonction :</span>
                        <input
                          type="text"
                          value={extractedData.jobTitle}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, jobTitle: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Téléphone :</span>
                        <input
                          type="text"
                          value={extractedData.phone}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, phone: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp :</span>
                        <input
                          type="text"
                          value={extractedData.whatsapp}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, whatsapp: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Email :</span>
                        <input
                          type="text"
                          value={extractedData.email}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, email: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Ville :</span>
                        <input
                          type="text"
                          value={extractedData.city}
                          onChange={(e) =>
                            setExtractedData({ ...extractedData, city: e.target.value })
                          }
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Site Web :</span>
                      <input
                        type="text"
                        value={extractedData.website}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, website: e.target.value })
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Adresse :</span>
                      <input
                        type="text"
                        value={extractedData.address}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, address: e.target.value })
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Slug URL généré :</span>
                      <input
                        type="text"
                        value={extractedData.slug}
                        onChange={(e) =>
                          setExtractedData({ ...extractedData, slug: e.target.value })
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-orange-600"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
                  <Scan className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                  <p className="text-xs font-medium">
                    Chargez la photo d'une carte de visite et cliquez sur "Lancer l'Analyse IA" pour visualiser les données extraites.
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
            Fermer
          </button>

          <button
            type="button"
            disabled={!extractedData}
            onClick={handleApply}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>🪄 Appliquer au Profil Digital</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
