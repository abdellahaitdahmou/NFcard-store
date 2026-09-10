import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Search,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Mail,
  Zap
} from "lucide-react";
import { DigitalProfile, ProfileTheme } from "../../types";
import { api } from "../../services/api";

export const ProfileManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<DigitalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProf, setEditingProf] = useState<DigitalProfile | null>(null);

  const [formData, setFormData] = useState({
    slug: "",
    ownerName: "",
    companyName: "",
    jobTitle: "",
    bio: "",
    category: "Immobilier",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
    coverUrl: "",
    theme: "luxury_gold" as ProfileTheme,
    phone: "+212 6 ",
    whatsapp: "+212 6 ",
    email: "",
    website: "",
    city: "Casablanca",
    address: "",
    isActive: true
  });

  const fetchProfiles = async () => {
    try {
      const res = await api.getAllProfiles();
      if (res.success && res.data) setProfiles(res.data);
    } catch (err) {
      console.warn("Could not load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleOpenAdd = () => {
    setEditingProf(null);
    setFormData({
      slug: "",
      ownerName: "",
      companyName: "",
      jobTitle: "",
      bio: "",
      category: "Immobilier",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
      coverUrl: "",
      theme: "luxury_gold",
      phone: "+212 6 ",
      whatsapp: "+212 6 ",
      email: "",
      website: "",
      city: "Casablanca",
      address: "",
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prof: DigitalProfile) => {
    setEditingProf(prof);
    setFormData({
      slug: prof.slug,
      ownerName: prof.ownerName,
      companyName: prof.companyName,
      jobTitle: prof.jobTitle,
      bio: prof.bio,
      category: prof.category,
      avatarUrl: prof.avatarUrl,
      coverUrl: prof.coverUrl || "",
      theme: prof.theme,
      phone: prof.phone,
      whatsapp: prof.whatsapp,
      email: prof.email,
      website: prof.website || "",
      city: prof.city || "Casablanca",
      address: prof.address || "",
      isActive: prof.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer le profil /p/${slug} ?`)) return;
    try {
      await api.deleteProfile(slug);
      fetchProfiles();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProf) {
        await api.updateProfile(editingProf.slug, formData);
      } else {
        await api.createProfile(formData);
      }
      setIsModalOpen(false);
      fetchProfiles();
    } catch (err) {
      alert("Erreur lors de la sauvegarde du profil.");
    }
  };

  const filtered = profiles.filter(
    (p) =>
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.city && p.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Profils Digitaux & Liens NFC (/p/...)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez les {profiles.length} profils interactifs vCard avec compteurs de vues, taps et redirections WhatsApp.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Créer un Profil Digital</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par Titulaire, Société, Slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
        />
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((prof) => (
          <div
            key={prof.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Header preview */}
              <div className="h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 relative overflow-hidden">
                {prof.coverUrl ? (
                  <img src={prof.coverUrl} alt={prof.ownerName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-end pr-4 opacity-15">
                    <Sparkles className="w-20 h-20 text-amber-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-white/95 text-slate-800 shadow-xs uppercase tracking-wider">
                  {prof.theme.replace("_", " ")}
                </span>
              </div>

              {/* Body */}
              <div className="px-5 -mt-9 relative z-10 space-y-3 pb-4">
                <div className="w-16 h-16 rounded-2xl p-0.5 bg-white shadow-md overflow-hidden">
                  <img src={prof.avatarUrl} alt={prof.ownerName} className="w-full h-full object-cover rounded-[14px]" />
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-base group-hover:text-amber-700 transition-colors">
                    {prof.ownerName}
                  </h3>
                  <p className="text-xs text-amber-700 font-bold">{prof.jobTitle || "Professionnel"}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {prof.companyName} {prof.city ? `• ${prof.city}` : ""}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-2xl text-center text-[10px] border border-slate-100">
                  <div>
                    <span className="font-black text-slate-900 text-xs block">{prof.viewsCount}</span>
                    <p className="text-slate-500 font-medium">Vues</p>
                  </div>
                  <div>
                    <span className="font-black text-amber-600 text-xs block">{prof.nfcTapsCount}</span>
                    <p className="text-slate-500 font-medium">Taps NFC</p>
                  </div>
                  <div>
                    <span className="font-black text-emerald-600 text-xs block">{prof.whatsappClicksCount}</span>
                    <p className="text-slate-500 font-medium">WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
              <a
                href={`/p/${prof.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold shadow-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>Voir le profil</span>
              </a>

              <button
                onClick={() => handleOpenEdit(prof)}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                title="Modifier"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDelete(prof.slug)}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Profile Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {editingProf ? `Modifier le Profil : /p/${editingProf.slug}` : "Créer un Nouveau Profil Digital"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Slug URL unique * (/p/slug)</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: ahmed-immobilier"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nom Complet du Titulaire *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Entreprise / Société</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fonction / Titre</label>
                  <input
                    type="text"
                    placeholder="ex: Directeur Général, Consultant..."
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Thème Visuel</label>
                  <select
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value as ProfileTheme })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="luxury_gold">Or & Prestige</option>
                    <option value="warm_restaurant">Restaurant & Chaleureux</option>
                    <option value="purple_beauty">Beauté & Glamour</option>
                    <option value="emerald_corporate">Corporate Émeraude</option>
                    <option value="modern_dark">Sombre Moderne</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ville</label>
                  <input
                    type="text"
                    placeholder="Casablanca, Rabat, Marrakech..."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Site Web</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">URL Photo Profil / Avatar</label>
                <input
                  type="text"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Bio / Présentation</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
                >
                  Enregistrer le Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
