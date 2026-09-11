import React, { useState, useEffect } from "react";
import {
  UserCheck, Plus, Edit, Trash2, Eye, Search, Sparkles,
  Phone, Globe, Mail, Zap, Instagram, Facebook, Linkedin,
  Youtube, Twitter, Camera, Building2, Tag, Clock, AlignLeft,
  Image, CheckCircle, X, Save, MapPin, Share2, Palette, User,
  Briefcase
} from "lucide-react";
import { DigitalProfile, ProfileTheme } from "../../types";
import { api } from "../../services/api";
import { ImageUploader } from "./ImageUploader";
import { AICardScannerModal } from "./AICardScannerModal";
import { ExtractedCardData } from "../../services/aiCardScanner";

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.83a8.2 8.2 0 0 0 4.79 1.52V4.56a4.85 4.85 0 0 1-1.02-.13z"/>
  </svg>
);
const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const GoogleMapsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const THEMES: { value: ProfileTheme; label: string; preview: string }[] = [
  { value: "luxury_gold",       label: "Or & Prestige",         preview: "from-amber-700 to-amber-900" },
  { value: "modern_dark",       label: "Sombre Moderne",        preview: "from-slate-800 to-slate-950" },
  { value: "emerald_corporate", label: "Corporate Emeraude",    preview: "from-emerald-600 to-teal-800" },
  { value: "warm_restaurant",   label: "Restaurant Chaleureux", preview: "from-orange-600 to-red-700" },
  { value: "purple_beauty",     label: "Beaute & Glamour",      preview: "from-purple-600 to-pink-600" },
  { value: "sky_realestate",    label: "Immobilier Ciel",       preview: "from-sky-600 to-blue-700" },
  { value: "slate_tech",        label: "Tech & Startup",        preview: "from-slate-600 to-indigo-700" },
  { value: "minimal_light",     label: "Minimal & Clair",       preview: "from-gray-300 to-gray-500" },
];

const CATEGORIES = [
  "Immobilier","Restaurant & Cafe","Medical & Sante","Avocat & Notaire",
  "Architecture & Design","Beaute & Bien-etre","Coach & Formateur",
  "Freelance & Consultant","Tech & Startup","Commerce & Retail",
  "Association & ONG","Artiste & Creatif","Finance & Banque","Autre"
];

interface FormData {
  slug: string; ownerName: string; companyName: string; jobTitle: string;
  bio: string; category: string;
  avatarUrl: string; coverUrl: string; logoUrl: string;
  theme: ProfileTheme;
  phone: string; whatsapp: string; email: string;
  website: string; city: string; address: string;
  googleMapsUrl: string; openingHours: string;
  instagram: string; facebook: string; linkedin: string;
  tiktok: string; youtube: string; twitter: string;
  isActive: boolean;
}

const defaultForm: FormData = {
  slug:"",ownerName:"",companyName:"",jobTitle:"",bio:"",category:"Immobilier",
  avatarUrl:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
  coverUrl:"",logoUrl:"",theme:"luxury_gold",
  phone:"+212 6 ",whatsapp:"+212 6 ",email:"",
  website:"",city:"Casablanca",address:"",googleMapsUrl:"",openingHours:"",
  instagram:"",facebook:"",linkedin:"",tiktok:"",youtube:"",twitter:"",
  isActive:true
};

type TabId = "identity"|"contact"|"social"|"design"|"media";
const TABS: {id:TabId;label:string;icon:React.ReactNode}[] = [
  {id:"identity",label:"Identite",   icon:<User className="w-4 h-4"/>},
  {id:"contact", label:"Contact",    icon:<Phone className="w-4 h-4"/>},
  {id:"social",  label:"Reseaux",    icon:<Share2 className="w-4 h-4"/>},
  {id:"design",  label:"Design",     icon:<Palette className="w-4 h-4"/>},
  {id:"media",   label:"Medias",     icon:<Image className="w-4 h-4"/>},
];

const inp = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-all placeholder-slate-400";

function FL({children,req}:{children:React.ReactNode;req?:boolean}){
  return <label className="block text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">{children}{req&&<span className="text-orange-500 ml-0.5">*</span>}</label>;
}

function SF({icon,label,placeholder,value,onChange}:{
  icon:React.ReactNode;label:string;placeholder:string;
  value:string;onChange:(v:string)=>void;
}){
  return (
    <div>
      <FL>{label}</FL>
      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/30 transition-all overflow-hidden">
        <div className="flex items-center justify-center w-10 py-2.5 border-r border-slate-200 bg-white flex-shrink-0 text-slate-500">{icon}</div>
        <input type="text" placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} className="flex-1 bg-transparent px-3 py-2.5 text-xs text-slate-900 focus:outline-none placeholder-slate-400"/>
      </div>
    </div>
  );
}

export const ProfileManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<DigitalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<DigitalProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("identity");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const set = (patch: Partial<FormData>) => setFormData(prev => ({ ...prev, ...patch }));

  const handleApplyAiData = (data: ExtractedCardData, cardImageUrl?: string) => {
    setFormData((prev) => ({
      ...prev,
      slug: data.slug || prev.slug,
      ownerName: data.ownerName || prev.ownerName,
      companyName: data.companyName || prev.companyName,
      jobTitle: data.jobTitle || prev.jobTitle,
      bio: data.bio || prev.bio,
      category: data.category || prev.category,
      coverUrl: cardImageUrl || prev.coverUrl,
      theme: data.theme || prev.theme,
      phone: data.phone || prev.phone,
      whatsapp: data.whatsapp || prev.whatsapp,
      email: data.email || prev.email,
      website: data.website || prev.website,
      city: data.city || prev.city,
      address: data.address || prev.address,
      instagram: data.socials?.instagram || prev.instagram,
      facebook: data.socials?.facebook || prev.facebook,
      linkedin: data.socials?.linkedin || prev.linkedin,
      tiktok: data.socials?.tiktok || prev.tiktok,
      twitter: data.socials?.twitter || prev.twitter,
      isActive: true,
    }));
    setEditingProf(null);
    setActiveTab("identity");
    setIsModalOpen(true);
  };

  const fetchProfiles = async () => {
    try { const res = await api.getAllProfiles(); if(res.success&&res.data) setProfiles(res.data); }
    catch { console.warn("Could not load profiles"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchProfiles(); }, []);

  const openAdd = () => {
    setEditingProf(null); setFormData(defaultForm); setActiveTab("identity"); setIsModalOpen(true);
  };
  const openEdit = (prof: DigitalProfile) => {
    setEditingProf(prof);
    setFormData({
      slug:prof.slug,ownerName:prof.ownerName,companyName:prof.companyName,
      jobTitle:prof.jobTitle,bio:prof.bio,category:prof.category,
      avatarUrl:prof.avatarUrl,coverUrl:prof.coverUrl||"",logoUrl:prof.logoUrl||"",
      theme:prof.theme,phone:prof.phone,whatsapp:prof.whatsapp,email:prof.email,
      website:prof.website||"",city:prof.city||"Casablanca",address:prof.address||"",
      googleMapsUrl:prof.googleMapsUrl||"",openingHours:prof.openingHours||"",
      instagram:prof.socials?.instagram||"",facebook:prof.socials?.facebook||"",
      linkedin:prof.socials?.linkedin||"",tiktok:prof.socials?.tiktok||"",
      youtube:prof.socials?.youtube||"",twitter:prof.socials?.twitter||"",
      isActive:prof.isActive
    });
    setActiveTab("identity"); setIsModalOpen(true);
  };
  const handleDelete = async (slug: string) => {
    if(!confirm(`Supprimer /p/${slug} ?`)) return;
    try { await api.deleteProfile(slug); fetchProfiles(); }
    catch { alert("Erreur lors de la suppression."); }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload = {
      ...formData,
      socials:{
        instagram:formData.instagram||undefined,facebook:formData.facebook||undefined,
        linkedin:formData.linkedin||undefined,tiktok:formData.tiktok||undefined,
        youtube:formData.youtube||undefined,twitter:formData.twitter||undefined,
      }
    };
    try {
      if(editingProf) await api.updateProfile(editingProf.slug,payload);
      else await api.createProfile(payload);
      setIsModalOpen(false); fetchProfiles();
    } catch { alert("Erreur lors de la sauvegarde."); }
    finally { setSaving(false); }
  };

  const filtered = profiles.filter(p =>
    p.ownerName.toLowerCase().includes(searchTerm.toLowerCase())||
    p.companyName.toLowerCase().includes(searchTerm.toLowerCase())||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())||
    (p.city&&p.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const selectedTheme = THEMES.find(t=>t.value===formData.theme)||THEMES[0];

  const renderIdentity = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FL req>Slug URL (/p/...)</FL>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/30 overflow-hidden">
            <span className="px-2.5 py-2.5 text-slate-400 text-xs border-r border-slate-200">/p/</span>
            <input type="text" required placeholder="ahmed-immobilier" value={formData.slug}
              onChange={e=>set({slug:e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"-")})}
              className="flex-1 bg-transparent px-3 py-2.5 text-xs text-slate-900 focus:outline-none font-mono font-bold placeholder-slate-400"
              disabled={!!editingProf}/>
          </div>
          {editingProf&&<p className="text-[10px] text-slate-400 mt-1">Slug immuable apres creation.</p>}
        </div>
        <div>
          <FL req>Nom complet du titulaire</FL>
          <input type="text" required className={inp} value={formData.ownerName} onChange={e=>set({ownerName:e.target.value})} placeholder="Ahmed Benali"/>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FL>Entreprise / Societe</FL>
          <div className="relative"><Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
            <input type="text" className={inp+" pl-9"} value={formData.companyName} onChange={e=>set({companyName:e.target.value})} placeholder="Benali Immobilier..."/>
          </div>
        </div>
        <div>
          <FL>Fonction / Titre</FL>
          <div className="relative"><Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
            <input type="text" className={inp+" pl-9"} value={formData.jobTitle} onChange={e=>set({jobTitle:e.target.value})} placeholder="Directeur General, Consultant..."/>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FL>Secteur d'activite</FL>
          <div className="relative"><Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
            <select className={inp+" pl-9 appearance-none"} value={formData.category} onChange={e=>set({category:e.target.value})}>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <FL>Horaires d'ouverture</FL>
          <div className="relative"><Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
            <input type="text" className={inp+" pl-9"} value={formData.openingHours} onChange={e=>set({openingHours:e.target.value})} placeholder="Lun-Sam 9h-18h"/>
          </div>
        </div>
      </div>
      <div>
        <FL>Bio / Presentation</FL>
        <div className="relative"><AlignLeft className="w-4 h-4 text-slate-400 absolute left-3 top-3"/>
          <textarea rows={3} className={inp+" pl-9 resize-none"} value={formData.bio} onChange={e=>set({bio:e.target.value})} placeholder="Decrivez votre activite, expertise..."/>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">{formData.bio.length}/300 caracteres</p>
      </div>
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <div>
          <p className="text-xs font-bold text-slate-800">Profil Actif</p>
          <p className="text-[11px] text-slate-500">Visible sur /p/{formData.slug||"slug"}</p>
        </div>
        <button type="button" onClick={()=>set({isActive:!formData.isActive})}>
          {formData.isActive
            ?<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold"><CheckCircle className="w-3.5 h-3.5"/>Actif</div>
            :<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200 text-slate-500 text-xs font-bold"><X className="w-3.5 h-3.5"/>Inactif</div>
          }
        </button>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SF icon={<Phone className="w-4 h-4"/>} label="Telephone mobile" placeholder="+212 6 XX XX XX XX" value={formData.phone} onChange={v=>set({phone:v})}/>
        <SF icon={<WhatsAppIcon/>} label="Numero WhatsApp" placeholder="+212 6 XX XX XX XX" value={formData.whatsapp} onChange={v=>set({whatsapp:v})}/>
      </div>
      <SF icon={<Mail className="w-4 h-4"/>} label="Email professionnel" placeholder="contact@entreprise.ma" value={formData.email} onChange={v=>set({email:v})}/>
      <SF icon={<Globe className="w-4 h-4"/>} label="Site Web officiel" placeholder="https://www.monsite.ma" value={formData.website} onChange={v=>set({website:v})}/>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SF icon={<MapPin className="w-4 h-4"/>} label="Ville" placeholder="Casablanca, Rabat..." value={formData.city} onChange={v=>set({city:v})}/>
        <SF icon={<Building2 className="w-4 h-4"/>} label="Adresse complete" placeholder="123 Rue Mohammed V..." value={formData.address} onChange={v=>set({address:v})}/>
      </div>
      <SF icon={<GoogleMapsIcon/>} label="Lien Google Maps" placeholder="https://maps.google.com/..." value={formData.googleMapsUrl} onChange={v=>set({googleMapsUrl:v})}/>
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-700">
        <strong>Astuce WhatsApp :</strong> Format international obligatoire (+212XXXXXXXXX). Pour Google Maps: cliquez Partager puis Copier le lien.
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="space-y-4">
      <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-[11px] text-orange-700">
        Collez le lien complet (https://instagram.com/...) pour chaque reseau.
      </div>
      <SF icon={<Instagram className="w-4 h-4 text-pink-600"/>} label="Instagram" placeholder="https://instagram.com/username" value={formData.instagram} onChange={v=>set({instagram:v})}/>
      <SF icon={<Facebook className="w-4 h-4 text-blue-600"/>} label="Facebook (Page ou Profil)" placeholder="https://facebook.com/page" value={formData.facebook} onChange={v=>set({facebook:v})}/>
      <SF icon={<Linkedin className="w-4 h-4 text-blue-700"/>} label="LinkedIn" placeholder="https://linkedin.com/in/username" value={formData.linkedin} onChange={v=>set({linkedin:v})}/>
      <SF icon={<TikTokIcon className="w-4 h-4"/>} label="TikTok" placeholder="https://tiktok.com/@username" value={formData.tiktok} onChange={v=>set({tiktok:v})}/>
      <SF icon={<Youtube className="w-4 h-4 text-red-600"/>} label="YouTube" placeholder="https://youtube.com/@channel" value={formData.youtube} onChange={v=>set({youtube:v})}/>
      <SF icon={<Twitter className="w-4 h-4 text-sky-500"/>} label="X / Twitter" placeholder="https://x.com/username" value={formData.twitter} onChange={v=>set({twitter:v})}/>
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-3">Reseaux actifs</p>
        <div className="flex flex-wrap gap-2">
          {formData.instagram&&<span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold"><Instagram className="w-3 h-3"/>Instagram</span>}
          {formData.facebook&&<span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold"><Facebook className="w-3 h-3"/>Facebook</span>}
          {formData.linkedin&&<span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-blue-700 text-white text-[10px] font-bold"><Linkedin className="w-3 h-3"/>LinkedIn</span>}
          {formData.tiktok&&<span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gray-950 text-white text-[10px] font-bold"><TikTokIcon className="w-3 h-3"/>TikTok</span>}
          {formData.youtube&&<span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold"><Youtube className="w-3 h-3"/>YouTube</span>}
          {formData.twitter&&<span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-sky-500 text-white text-[10px] font-bold"><Twitter className="w-3 h-3"/>X</span>}
          {formData.website&&<span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-700 text-white text-[10px] font-bold"><Globe className="w-3 h-3"/>Site Web</span>}
          {!formData.instagram&&!formData.facebook&&!formData.linkedin&&!formData.tiktok&&!formData.youtube&&!formData.twitter&&!formData.website&&(
            <span className="text-slate-400 text-[11px] italic">Aucun reseau configure</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderDesign = () => (
    <div className="space-y-5">
      <div>
        <FL>Theme visuel de la carte digitale</FL>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-1">
          {THEMES.map(t=>(
            <button key={t.value} type="button" onClick={()=>set({theme:t.value})}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all ${formData.theme===t.value?"border-orange-500 shadow-lg shadow-orange-500/20 scale-105":"border-slate-200 hover:border-slate-300"}`}>
              <div className={`h-14 bg-gradient-to-br ${t.preview} flex items-center justify-center`}>
                {formData.theme===t.value&&<div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-white"/></div>}
              </div>
              <div className="bg-white px-1.5 py-1.5 text-center">
                <p className="text-[10px] font-bold text-slate-700 leading-tight">{t.label}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedTheme.preview} flex-shrink-0`}/>
          <div>
            <p className="text-xs font-bold text-slate-900">Theme: {selectedTheme.label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Applique a la couleur de fond du profil /p/{formData.slug||"slug"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedia = () => (
    <div className="space-y-4">
      <ImageUploader
        label="Photo de profil / Avatar"
        value={formData.avatarUrl}
        onChange={(url) => set({ avatarUrl: url })}
        type="avatar"
        recommendedSize="400 × 400 px"
        hint="Photo portrait professionnelle, nette et bien cadrée. Apparaît au centre du profil NFC."
      />

      <ImageUploader
        label="Logo de l'entreprise"
        value={formData.logoUrl}
        onChange={(url) => set({ logoUrl: url })}
        type="logo"
        recommendedSize="PNG transparent"
        hint="Logo officiel de votre entreprise ou marque. Apparaît en badge à côté de la photo."
      />

      <ImageUploader
        label="Photo de couverture / Bannière"
        value={formData.coverUrl}
        onChange={(url) => set({ coverUrl: url })}
        type="cover"
        recommendedSize="1200 × 400 px"
        hint="Bannière d'en-tête du profil. Si vide, le dégradé du thème sélectionné sera affiché."
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Profils Digitaux NFC</h2>
          <p className="text-xs text-slate-500 mt-0.5">{profiles.length} profil{profiles.length>1?"s":""} actif{profiles.length>1?"s":""} - Gerez identite, contact, reseaux et design</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAiScannerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all hover:-translate-y-0.5 border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Scanner Carte avec l'IA</span>
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Profil Digital</span>
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
        <input type="text" placeholder="Rechercher par nom, societe, slug..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-400 shadow-sm"/>
      </div>

      {loading?(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i=><div key={i} className="h-64 rounded-3xl bg-white border border-slate-200 animate-pulse"/>)}
        </div>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(prof=>{
            const theme=THEMES.find(t=>t.value===prof.theme)||THEMES[0];
            const socials=prof.socials||{};
            return (
              <div key={prof.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
                <div className={`h-20 bg-gradient-to-br ${theme.preview} relative overflow-hidden`}>
                  {prof.coverUrl&&<img src={prof.coverUrl} alt="" className="w-full h-full object-cover"/>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
                  <div className="absolute top-2 right-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/95 text-slate-700 uppercase tracking-wider">{theme.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${prof.isActive?"bg-emerald-500 text-white":"bg-slate-300 text-slate-600"}`}>{prof.isActive?"Actif":"Inactif"}</span>
                  </div>
                </div>
                <div className="px-4 -mt-8 relative z-10 pb-3 flex-1">
                  <div className="flex items-end justify-between mb-2">
                    <div className="w-14 h-14 rounded-2xl ring-4 ring-white shadow-md overflow-hidden bg-white">
                      <img src={prof.avatarUrl} alt={prof.ownerName} className="w-full h-full object-cover"/>
                    </div>
                    {prof.logoUrl&&<div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm p-1.5 mb-1"><img src={prof.logoUrl} alt="logo" className="w-full h-full object-contain"/></div>}
                  </div>
                  <h3 className="font-black text-slate-900 text-sm group-hover:text-orange-600 transition-colors">{prof.ownerName}</h3>
                  <p className="text-[11px] text-orange-600 font-bold mt-0.5">{prof.jobTitle||"Professionnel"}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{prof.companyName}{prof.city?` - ${prof.city}`:""}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {socials.instagram&&<span className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"><Instagram className="w-2.5 h-2.5 text-white"/></span>}
                    {socials.facebook&&<span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center"><Facebook className="w-2.5 h-2.5 text-white"/></span>}
                    {socials.linkedin&&<span className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center"><Linkedin className="w-2.5 h-2.5 text-white"/></span>}
                    {socials.tiktok&&<span className="w-5 h-5 rounded-full bg-gray-950 flex items-center justify-center"><TikTokIcon className="w-2.5 h-2.5 text-white"/></span>}
                    {socials.youtube&&<span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center"><Youtube className="w-2.5 h-2.5 text-white"/></span>}
                    {socials.twitter&&<span className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center"><Twitter className="w-2.5 h-2.5 text-white"/></span>}
                    {prof.website&&<span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center"><Globe className="w-2.5 h-2.5 text-white"/></span>}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mt-3 py-2 px-2 bg-slate-50 rounded-xl border border-slate-100 text-center text-[10px]">
                    <div><span className="font-black text-slate-900 text-xs block">{prof.viewsCount}</span><p className="text-slate-500">Vues</p></div>
                    <div><span className="font-black text-orange-600 text-xs block">{prof.nfcTapsCount}</span><p className="text-slate-500">NFC</p></div>
                    <div><span className="font-black text-emerald-600 text-xs block">{prof.whatsappClicksCount}</span><p className="text-slate-500">WA</p></div>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2">
                  <a href={`/p/${prof.slug}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors">
                    <Eye className="w-3.5 h-3.5 text-orange-500"/>Voir
                  </a>
                  <button onClick={()=>openEdit(prof)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold transition-colors">
                    <Edit className="w-3.5 h-3.5"/>Modifier
                  </button>
                  <button onClick={()=>handleDelete(prof.slug)} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen&&(
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" onClick={e=>e.target===e.currentTarget&&setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="text-base font-black text-slate-900">{editingProf?`Modifier : /p/${editingProf.slug}`:"Creer un Profil Digital NFC"}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{editingProf?`${editingProf.ownerName} - ${editingProf.companyName}`:"Remplissez les informations du nouveau profil"}</p>
              </div>
              <button onClick={()=>setIsModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"><X className="w-5 h-5"/></button>
            </div>

            <div className="flex border-b border-slate-100 flex-shrink-0 px-2 pt-1 gap-0.5 overflow-x-auto no-scrollbar">
              {TABS.map(tab=>(
                <button key={tab.id} type="button" onClick={()=>setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-t-xl whitespace-nowrap transition-all flex-shrink-0 ${activeTab===tab.id?"bg-orange-50 text-orange-600 border-b-2 border-orange-500":"text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}>
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              {/* Quick AI Fill banner */}
              <div className="mx-6 mt-3 p-2.5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 flex items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 text-xs text-orange-950 font-bold">
                  <Sparkles className="w-4 h-4 text-orange-600 animate-pulse flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs">Remplir automatiquement depuis une photo de carte de visite</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiScannerOpen(true)}
                  className="px-3 py-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] shadow-xs transition-all whitespace-nowrap"
                >
                  Scanner avec l'IA
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {activeTab==="identity"&&renderIdentity()}
                {activeTab==="contact"&&renderContact()}
                {activeTab==="social"&&renderSocial()}
                {activeTab==="design"&&renderDesign()}
                {activeTab==="media"&&renderMedia()}
              </div>
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-1.5">
                  {TABS.map(tab=>(
                    <button key={tab.id} type="button" onClick={()=>setActiveTab(tab.id)}
                      className={`h-2 rounded-full transition-all ${activeTab===tab.id?"w-5 bg-orange-500":"w-2 bg-slate-300"}`}/>
                  ))}
                </div>
                <div className="flex items-center gap-2.5">
                  <button type="button" onClick={()=>setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">Annuler</button>
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 disabled:opacity-50">
                    {saving?<><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Sauvegarde...</>:<><Save className="w-3.5 h-3.5"/>Enregistrer</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Card Scanner Modal */}
      <AICardScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        onApplyData={handleApplyAiData}
      />
    </div>
  );
};
