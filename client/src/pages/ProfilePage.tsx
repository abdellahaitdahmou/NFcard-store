import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { DigitalProfileView } from "../components/profile/DigitalProfileView";
import { Loader2, AlertCircle, Lock, KeyRound, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    api.getProfile(slug)
      .then((res) => {
        if (res.success && res.data) {
          setProfile(res.data);
        } else {
          setError("Profil introuvable.");
        }
      })
      .catch(() => setError("Impossible de charger ce profil digital."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center shadow-sm">
          <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
        </div>
        <p className="text-slate-600 text-sm font-medium">Chargement du profil digital...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-rose-600" />
        </div>
        <h2 className="font-bold text-slate-900 text-xl">Profil introuvable</h2>
        <p className="text-slate-500 text-sm">{error || "Ce profil n'existe pas ou a été désactivé."}</p>
        <Link to="/" className="text-xs font-bold text-amber-600 hover:underline pt-2">← Retour à l'accueil</Link>
      </div>
    );
  }

  // Format profile data for DigitalProfileView
  const profileViewModel = {
    name: profile.ownerName || "Professionnel",
    title: profile.jobTitle || "Directeur",
    company: profile.companyName || "Entreprise",
    bio: profile.bio || "",
    avatar: profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    logo: profile.logoUrl || undefined,
    coverColor: profile.coverUrl || "from-amber-700 to-amber-900",
    phone: profile.phone || "",
    whatsapp: profile.whatsapp || profile.phone || "",
    email: profile.email || "",
    website: profile.website || undefined,
    instagram: profile.socials?.instagram || undefined,
    facebook: profile.socials?.facebook || undefined,
    linkedin: profile.socials?.linkedin || undefined,
    tiktok: profile.socials?.tiktok || undefined,
    googleMapsUrl: profile.googleMapsUrl || (profile.address || profile.city ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([profile.companyName, profile.address, profile.city].filter(Boolean).join(", "))}` : undefined),
    location: profile.city || profile.address || undefined,
    hours: profile.openingHours || undefined,
    theme: profile.theme || "luxury_gold",
    services: (profile.services || []).map((s: any) => ({ name: s.title, desc: s.description, price: s.price })),
    portfolio: (profile.portfolio || []).map((p: any) => ({ image: p.imageUrl, title: p.title })),
    slug: profile.slug
  };

  return <DigitalProfileView profile={profileViewModel} />;
};
