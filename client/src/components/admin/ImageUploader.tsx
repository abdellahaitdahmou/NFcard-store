import React, { useRef, useState, useCallback } from "react";
import { Upload, Camera, X, Loader2, CheckCircle, AlertCircle, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { api } from "../../services/api";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label: string;
  hint?: string;
  type?: "avatar" | "logo" | "cover";
  recommendedSize?: string;
}

export const ImageUploader: React.FC<Props> = ({
  value,
  onChange,
  label,
  hint,
  type = "avatar",
  recommendedSize,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const doUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Format non valide. Veuillez choisir une image (JPG, PNG, WEBP, SVG).");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image trop volumineuse. La taille maximale est de 10 MB.");
        return;
      }

      setUploading(true);
      setError(null);
      setSuccess(false);
      setProgress(20);

      const timer = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      try {
        const res = await api.uploadFile(file);
        clearInterval(timer);
        if (res.success && res.fileUrl) {
          setProgress(100);
          onChange(res.fileUrl);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError("Échec de l'upload. Veuillez réessayer.");
        }
      } catch (err) {
        setError("Erreur de connexion au serveur lors de l'upload.");
      } finally {
        clearInterval(timer);
        setUploading(false);
        setTimeout(() => setProgress(0), 800);
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      doUpload(file);
    }
    // reset input so same file can be re-selected if needed
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        doUpload(file);
      }
    },
    [doUpload]
  );

  const isAvatar = type === "avatar";
  const isLogo = type === "logo";
  const isCover = type === "cover";

  return (
    <div className="space-y-2 bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200">
      {/* Label and optional specs */}
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        {recommendedSize && (
          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
            {recommendedSize}
          </span>
        )}
      </div>

      {/* Main Container */}
      <div className={isCover ? "space-y-3" : "flex flex-col sm:flex-row items-start gap-4"}>
        {/* Visual Preview */}
        {isCover ? (
          <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-slate-200 border-2 border-slate-300 group flex items-center justify-center">
            {value ? (
              <>
                <img
                  src={value}
                  alt="Couverture"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold rounded-lg shadow transition-all"
                  >
                    Changer l'image
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition-all"
                    title="Supprimer l'image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-slate-400 gap-1.5 p-4 text-center">
                <ImageIcon className="w-7 h-7 text-slate-300" />
                <span className="text-xs font-medium">Aucune bannière (le thème visuel sera affiché)</span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex-shrink-0 group mx-auto sm:mx-0">
            <div
              className={`overflow-hidden border-2 border-slate-300 bg-white shadow-sm flex items-center justify-center ${
                isAvatar
                  ? "w-20 h-20 rounded-2xl"
                  : "w-20 h-20 rounded-2xl p-2 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:8px_8px]"
              }`}
            >
              {value ? (
                <img
                  src={value}
                  alt="Aperçu"
                  className={`w-full h-full ${isAvatar ? "object-cover" : "object-contain"}`}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <Camera className="w-8 h-8 text-slate-300" />
              )}
            </div>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
                title="Supprimer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Action / Upload Area */}
        <div className="flex-1 w-full space-y-2.5">
          {/* Dropzone button */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 sm:p-3.5 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
              dragging
                ? "border-orange-500 bg-orange-50/80 scale-[0.99]"
                : "border-slate-300 hover:border-orange-400 bg-white hover:bg-orange-50/20"
            }`}
          >
            {uploading ? (
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs py-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Téléversement en cours... ({progress}%)</span>
              </div>
            ) : success ? (
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs py-1">
                <CheckCircle className="w-4 h-4" />
                <span>Image téléversée avec succès !</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span>Cliquez pour choisir un fichier ou glissez-déposez ici</span>
                </div>
                <p className="text-[10px] text-slate-400">JPG, PNG, WebP, SVG · Max 10 Mo</p>
              </>
            )}

            {/* Progress bar */}
            {uploading && (
              <div className="w-full max-w-xs h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Toggle URL input */}
          <div className="flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-orange-600 font-semibold transition-colors"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? "Masquer le champ URL" : "Ou coller une URL d'image existante"}</span>
            </button>

            {value && (
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                {value.startsWith("/uploads/") ? "Fichier hébergé localement" : value}
              </span>
            )}
          </div>

          {/* Optional URL input */}
          {showUrlInput && (
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  setError(null);
                }}
                placeholder="https://exemple.com/image.png"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Hint */}
          {hint && <p className="text-[10px] text-slate-500 leading-relaxed">{hint}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
