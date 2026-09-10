import React from "react";
import {
  Users,
  CreditCard,
  UserCheck,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Award,
  Eye,
  Share2,
  MessageCircle,
  Download,
  ArrowUpRight,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { AnalyticsSummary } from "../../types";

interface StatsOverviewProps {
  stats: AnalyticsSummary | null;
  onNavigateTab: (tab: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, onNavigateTab }) => {
  if (!stats) {
    return (
      <div className="text-center py-16 text-slate-400">
        <div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-xs font-semibold">Chargement des indicateurs clés...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Chiffre d'Affaires Total",
      value: `${stats.totalRevenueDH.toLocaleString()} DH`,
      subtitle: "Ventes cumulées au Maroc",
      icon: DollarSign,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-200",
      accent: "from-amber-500/10 to-transparent"
    },
    {
      title: "Clients Enregistrés",
      value: stats.totalCustomers,
      subtitle: "Professionnels & Commerces",
      icon: Users,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-200",
      accent: "from-emerald-500/10 to-transparent"
    },
    {
      title: "Cartes NFC Déployées",
      value: stats.totalNfcCardsSold,
      subtitle: "Cartes & puces physiques actives",
      icon: CreditCard,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 border-blue-200",
      accent: "from-blue-500/10 to-transparent"
    },
    {
      title: "Profils Digitaux en Ligne",
      value: stats.activeProfilesCount,
      subtitle: "Pages /p/ sans contact",
      icon: UserCheck,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-200",
      accent: "from-purple-500/10 to-transparent"
    },
    {
      title: "Commandes en Traitement",
      value: stats.pendingOrdersCount,
      subtitle: "À préparer / expédier",
      icon: Clock,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50 border-orange-200",
      accent: "from-orange-500/10 to-transparent",
      onClick: () => onNavigateTab("orders"),
      isActionable: true
    },
    {
      title: "Commandes Livrées",
      value: stats.completedOrdersCount,
      subtitle: "Clôturées avec succès",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-200",
      accent: "from-emerald-500/10 to-transparent"
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Tableau de Bord Exécutif</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Performance & Activité Commerciale</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vue d'ensemble en temps réel des ventes, commandes et interactions sans contact.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab("orders")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Gérer les Commandes</span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={idx}
              onClick={c.onClick}
              className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden ${
                c.isActionable ? "cursor-pointer border-orange-300 hover:border-orange-400 ring-2 ring-orange-400/10" : ""
              }`}
            >
              <div className="space-y-1 relative z-10">
                <p className="text-xs font-bold text-slate-500">{c.title}</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{c.value}</p>
                <p className="text-[11px] text-slate-400 font-medium">{c.subtitle}</p>
              </div>

              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${c.iconBg} ${c.iconColor} flex-shrink-0 shadow-xs relative z-10`}>
                <Icon className="w-6 h-6" />
              </div>

              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${c.accent} rounded-full blur-xl pointer-events-none`} />
            </div>
          );
        })}
      </div>

      {/* Insights: Best Seller & Top Sector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 p-6 rounded-3xl border border-amber-200 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 flex-shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-amber-800 font-bold uppercase tracking-wider block">
              Produit N°1 des Ventes
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5 truncate">{stats.popularProduct}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Article le plus demandé et le plus rentable</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50/80 via-white to-orange-50/30 p-6 rounded-3xl border border-orange-200 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 flex-shrink-0">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-orange-800 font-bold uppercase tracking-wider block">
              Secteur d'Activité Leader
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-0.5 truncate">{stats.popularCategory}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Plus fort volume de commandes ce mois-ci</p>
          </div>
        </div>
      </div>

      {/* Global Digital Interactions Stats */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Interactions Sans Contact Globales</h3>
            <p className="text-xs text-slate-500">Statistiques d'engagement sur les cartes et profils clients actifs au Maroc</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <Eye className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
            <p className="text-xl font-black text-slate-900">{stats.totalViews.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-slate-500">Vues Totales</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <CreditCard className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
            <p className="text-xl font-black text-slate-900">{stats.totalNfcTaps.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-slate-500">Taps NFC Directs</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <Share2 className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
            <p className="text-xl font-black text-slate-900">{stats.totalQrScans.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-slate-500">Scans QR Code</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <MessageCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
            <p className="text-xl font-black text-slate-900">{stats.totalWhatsappClicks.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-slate-500">Clics WhatsApp</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 col-span-2 sm:col-span-1">
            <Download className="w-5 h-5 text-pink-600 mx-auto mb-1.5" />
            <p className="text-xl font-black text-slate-900">{stats.totalVcards.toLocaleString()}</p>
            <p className="text-[11px] font-semibold text-slate-500">vCards Enregistrées</p>
          </div>
        </div>
      </div>

    </div>
  );
};
