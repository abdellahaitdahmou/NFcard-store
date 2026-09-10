import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { AdminLayout } from "../components/admin/AdminLayout";
import { StatsOverview } from "../components/admin/StatsOverview";
import { OrderManagement } from "../components/admin/OrderManagement";
import { CardManagement } from "../components/admin/CardManagement";
import { ProfileManagement } from "../components/admin/ProfileManagement";
import { DynamicPricing } from "../components/admin/DynamicPricing";
import { PackagesManagement } from "../components/admin/PackagesManagement";
import { CompetitorResearch } from "../components/admin/CompetitorResearch";
import { MessagesAdmin } from "../components/admin/MessagesAdmin";
import { SiteSettingsAdmin } from "../components/admin/SiteSettingsAdmin";
import { Order, AnalyticsSummary } from "../types";

export const AdminDashboard: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.getAnalyticsSummary(),
        api.getOrders()
      ]);
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
    } catch (err) {
      console.warn("Could not load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (authLoading || (!isAuthenticated && authLoading)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">
        Vérification de la session...
      </div>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === "dashboard" && (
        <StatsOverview stats={stats} onNavigateTab={setActiveTab} />
      )}

      {activeTab === "orders" && (
        <OrderManagement orders={orders} onRefresh={loadData} />
      )}

      {activeTab === "cards" && (
        <CardManagement />
      )}

      {activeTab === "profiles" && (
        <ProfileManagement />
      )}

      {activeTab === "pricing" && (
        <DynamicPricing />
      )}

      {activeTab === "packages" && (
        <PackagesManagement />
      )}

      {activeTab === "competitors" && (
        <CompetitorResearch />
      )}

      {activeTab === "messages" && (
        <MessagesAdmin />
      )}

      {activeTab === "settings" && (
        <SiteSettingsAdmin />
      )}
    </AdminLayout>
  );
};
