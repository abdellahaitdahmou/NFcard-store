import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Zap, AlertCircle } from "lucide-react";

export const CardRedirectPage: React.FC = () => {
  const { cardSlug } = useParams<{ cardSlug: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolve = async () => {
      if (!cardSlug) return;
      try {
        const res = await api.resolveCard(cardSlug);
        if (res.success && res.data && res.data.targetProfileSlug) {
          // Instant redirect to customer's public profile
          navigate(`/p/${res.data.targetProfileSlug}`, { replace: true });
        } else {
          setError(res.message || "Carte NFC non reconnue ou désactivée.");
        }
      } catch (err) {
        setError("Erreur de connexion lors de la lecture de la carte NFC.");
      }
    };
    resolve();
  }, [cardSlug, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center space-y-4 border border-gray-200">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Carte NFC Non Reconnue</h2>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-900">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center animate-ping">
          <Zap className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold">Connexion NFC Sécurisée...</h2>
        <p className="text-xs text-gray-500">Ouverture de votre profil digital</p>
      </div>
    </div>
  );
};
