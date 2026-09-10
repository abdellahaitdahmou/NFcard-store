import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  UserCheck,
  Tag,
  Briefcase,
  Search,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Zap,
  ChevronRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  children
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navSections = [
    {
      title: "Général",
      items: [
        { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
        { id: "orders", label: "Commandes", icon: ShoppingBag, badge: "Live" },
        { id: "messages", label: "Messages & Devis", icon: MessageSquare }
      ]
    },
    {
      title: "Catalogue & Puces",
      items: [
        { id: "pricing", label: "Produits & Tarifs", icon: Tag },
        { id: "packages", label: "Packs Métiers", icon: Briefcase },
        { id: "cards", label: "Inventaire Cartes NFC", icon: CreditCard },
        { id: "profiles", label: "Profils Digitaux", icon: UserCheck }
      ]
    },
    {
      title: "Stratégie & Système",
      items: [
        { id: "competitors", label: "Étude de Marché Maroc", icon: Search },
        { id: "settings", label: "Paramètres du Site", icon: Settings }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row antialiased">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between flex-shrink-0 shadow-[2px_0_12px_rgba(0,0,0,0.02)] z-20">
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center p-1 shadow-md shadow-amber-500/20">
                <img src="/logo-icon.png" alt="NFcard Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 text-base tracking-tight block leading-tight">
                  NFCARD<span className="text-amber-600">.</span>MA
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links Grouped */}
          <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </p>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm shadow-slate-900/10"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-amber-400 text-slate-950"
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-2.5">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Directeur NFcard"}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || "admin@nfcard.ma"}</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="En ligne" />
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[11px] font-bold text-slate-700 border border-slate-200 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Voir le site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 transition-colors shadow-xs"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400">Administration</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-bold text-slate-900 capitalize">
              {activeTab === "dashboard" ? "Tableau de Bord" : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Système NFC Opérationnel</span>
            </div>

            <Link
              to="/commander"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
            >
              + Passer commande
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};
