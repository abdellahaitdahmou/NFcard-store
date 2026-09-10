import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, Mail, Globe, MessageCircle, Instagram, Facebook, Linkedin,
  MapPin, Share2, Download, ChevronDown, ChevronUp, Star, Clock,
  Briefcase, Image, Check, X, ExternalLink, Zap, QrCode
} from "lucide-react";

// TikTok icon (lucide does not have it)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.83a8.2 8.2 0 0 0 4.79 1.52V4.56a4.85 4.85 0 0 1-1.02-.13z"/>
  </svg>
);

export interface ProfileData {
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar: string;
  logo?: string;
  coverColor?: string;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  location?: string;
  hours?: string;
  theme?: string;
  services?: { name: string; desc?: string; price?: string }[];
  portfolio?: { image: string; title: string }[];
  slug?: string;
}

interface Props { profile: ProfileData; }

function SocialBtn({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl font-semibold text-sm text-white transition-all ${color}`}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
    >
      {icon}
      {label}
    </motion.a>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

export const DigitalProfileView: React.FC<Props> = ({ profile }) => {
  const [showShare, setShowShare]   = useState(false);
  const [copied, setCopied]         = useState(false);
  const [showAllSvc, setShowAllSvc] = useState(false);

  const profileUrl = window.location.href;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVCard = () => {
    const vcard = [
      "BEGIN:VCARD", "VERSION:3.0",
      `FN:${profile.name}`,
      `ORG:${profile.company}`,
      `TITLE:${profile.title}`,
      profile.phone   ? `TEL;TYPE=CELL:${profile.phone}` : "",
      profile.email   ? `EMAIL:${profile.email}` : "",
      profile.website ? `URL:${profile.website}` : "",
      "END:VCARD",
    ].filter(Boolean).join("\r\n");
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${profile.name.replace(/\s+/g, "_")}.vcf`; a.click();
    URL.revokeObjectURL(url);
  };

  const cover = profile.coverColor || "from-emerald-600 to-teal-700";
  const displayed = showAllSvc ? profile.services : profile.services?.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pb-20">
      <div className="w-full max-w-md relative">

        {/* ── COVER GRADIENT ── */}
        <div className={`h-44 bg-gradient-to-br ${cover} relative overflow-hidden`}>
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          {/* Top NFcard badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
            <Zap className="w-3 h-3 text-white" />
            <span className="text-white text-[10px] font-bold tracking-wider">NFCARD</span>
          </div>

          {/* Share button */}
          <button
            onClick={() => setShowShare(true)}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* ── AVATAR + LOGO ── */}
        <div className="relative px-5 -mt-14 mb-4">
          <motion.div className="flex items-end justify-between" {...fadeUp(0.05)}>
            {/* Avatar ring */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl ring-4 ring-white shadow-xl overflow-hidden bg-white">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              {/* Online dot */}
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            {/* Logo badge */}
            {profile.logo && (
              <motion.div
                className="w-14 h-14 rounded-xl bg-white shadow-lg border border-gray-100 p-1.5 overflow-hidden mb-1"
                whileHover={{ scale: 1.08 }}
              >
                <img src={profile.logo} alt={profile.company} className="w-full h-full object-contain" />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ── IDENTITY ── */}
        <motion.div className="px-5 mb-5" {...fadeUp(0.1)}>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{profile.name}</h1>
          <p className="text-emerald-600 font-semibold text-sm mt-0.5">{profile.title}</p>
          <p className="text-gray-500 text-xs font-medium flex items-center gap-1 mt-1">
            <Briefcase className="w-3.5 h-3.5" /> {profile.company}
            {profile.location && <><span className="mx-1">·</span><MapPin className="w-3.5 h-3.5" />{profile.location}</>}
          </p>

          {profile.bio && (
            <p className="text-gray-600 text-sm leading-relaxed mt-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
              {profile.bio}
            </p>
          )}

          {profile.hours && (
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span>{profile.hours}</span>
            </div>
          )}
        </motion.div>

        {/* ── PRIMARY ACTIONS ── */}
        <motion.div className="px-5 space-y-2.5 mb-5" {...fadeUp(0.18)}>
          {profile.whatsapp && (
            <SocialBtn
              href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}?text=Bonjour, j'ai scanné votre carte NFC NFcard.`}
              icon={<MessageCircle className="w-5 h-5" />}
              label={`WhatsApp — ${profile.whatsapp}`}
              color="bg-[#25D366] hover:bg-[#1da851] shadow-md shadow-green-500/20"
            />
          )}
          <div className="grid grid-cols-2 gap-2.5">
            {profile.phone && (
              <SocialBtn
                href={`tel:${profile.phone.replace(/\D/g, "")}`}
                icon={<Phone className="w-4 h-4" />}
                label={profile.phone}
                color="bg-gray-900 hover:bg-gray-800 shadow-md shadow-gray-900/20"
              />
            )}
            {profile.email && (
              <SocialBtn
                href={`mailto:${profile.email}`}
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                color="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
              />
            )}
          </div>

          {/* Save contact CTA */}
          <motion.button
            onClick={handleVCard}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Enregistrer dans mes contacts (.vcf)
          </motion.button>
        </motion.div>

        {/* ── SOCIAL LINKS ── */}
        {(profile.instagram || profile.facebook || profile.linkedin || profile.tiktok || profile.website) && (
          <motion.div className="px-5 mb-5" {...fadeUp(0.26)}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Retrouvez-moi sur</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {profile.instagram && (
                <motion.a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm shadow-md shadow-pink-500/20"
                  whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                >
                  <Instagram className="w-4 h-4 flex-shrink-0" />
                  Instagram
                </motion.a>
              )}
              {profile.facebook && (
                <motion.a
                  href={profile.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#1565d8] text-white font-semibold text-sm shadow-md shadow-blue-500/20"
                  whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                >
                  <Facebook className="w-4 h-4 flex-shrink-0" />
                  Facebook
                </motion.a>
              )}
              {profile.linkedin && (
                <motion.a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0A66C2] hover:bg-[#0952a5] text-white font-semibold text-sm shadow-md shadow-blue-500/20"
                  whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                >
                  <Linkedin className="w-4 h-4 flex-shrink-0" />
                  LinkedIn
                </motion.a>
              )}
              {profile.tiktok && (
                <motion.a
                  href={profile.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gray-950 hover:bg-gray-800 text-white font-semibold text-sm shadow-md"
                  whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                >
                  <TikTokIcon />
                  TikTok
                </motion.a>
              )}
              {profile.website && (
                <motion.a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm shadow-md col-span-2"
                  whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{profile.website.replace(/https?:\/\//, "")}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-auto flex-shrink-0 opacity-60" />
                </motion.a>
              )}
            </div>
          </motion.div>
        )}

        {/* ── SERVICES / PORTFOLIO ── */}
        {profile.services && profile.services.length > 0 && (
          <motion.div className="px-5 mb-5" {...fadeUp(0.34)}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Services & Offres</h3>
            <div className="space-y-2">
              {displayed?.map((s, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-start justify-between gap-3"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                    {s.desc && <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{s.desc}</p>}
                  </div>
                  {s.price && (
                    <span className="text-amber-600 font-extrabold text-sm whitespace-nowrap">{s.price}</span>
                  )}
                </motion.div>
              ))}
            </div>
            {(profile.services?.length ?? 0) > 3 && (
              <button onClick={() => setShowAllSvc(!showAllSvc)} className="mt-3 w-full text-center text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                {showAllSvc ? <><ChevronUp className="w-3.5 h-3.5" />Voir moins</> : <><ChevronDown className="w-3.5 h-3.5" />Voir tout ({profile.services?.length})</>}
              </button>
            )}
          </motion.div>
        )}

        {/* ── PORTFOLIO PHOTOS ── */}
        {profile.portfolio && profile.portfolio.length > 0 && (
          <motion.div className="px-5 mb-5" {...fadeUp(0.4)}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              <Image className="inline w-3.5 h-3.5 mr-1.5" />Portfolio
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {profile.portfolio.map((p, i) => (
                <motion.div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer relative group"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                    <p className="text-white text-[10px] font-semibold leading-tight">{p.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── POWERED BY NFCARD ── */}
        <motion.div className="px-5 mt-4" {...fadeUp(0.5)}>
          <div className="flex items-center justify-center gap-2 py-3 text-center text-gray-400 text-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Propulsé par <a href="/" className="font-bold text-amber-600 hover:underline">NFcard Maroc (NFcard.ma)</a></span>
          </div>
        </motion.div>

      </div>

      {/* ── SHARE MODAL ── */}
      <AnimatePresence>
        {showShare && (
          <>
            <motion.div className="fixed inset-0 bg-black/50 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowShare(false)} />
            <motion.div
              className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl p-6 shadow-2xl max-w-md mx-auto"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6" />
              <h3 className="font-bold text-gray-900 text-lg mb-4">Partager ce profil</h3>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                <span className="text-gray-600 text-xs flex-1 truncate">{profileUrl}</span>
                <motion.button onClick={handleCopy} className="text-emerald-600 font-bold text-xs whitespace-nowrap" whileTap={{ scale: 0.95 }}>
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : "Copier"}
                </motion.button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <motion.a href={`https://wa.me/?text=${encodeURIComponent(profileUrl)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#25D366]/10 text-[#25D366] text-xs font-semibold" whileHover={{ scale: 1.05 }}>
                  <MessageCircle className="w-6 h-6" />WhatsApp
                </motion.a>
                <motion.a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-50 text-blue-600 text-xs font-semibold" whileHover={{ scale: 1.05 }}>
                  <Facebook className="w-6 h-6" />Facebook
                </motion.a>
                <motion.button onClick={handleCopy} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-gray-100 text-gray-700 text-xs font-semibold" whileHover={{ scale: 1.05 }}>
                  <QrCode className="w-6 h-6" />Lien
                </motion.button>
              </div>
              <button onClick={() => setShowShare(false)} className="mt-4 w-full py-3 rounded-2xl text-gray-500 font-semibold text-sm bg-gray-50 hover:bg-gray-100">
                Fermer
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};