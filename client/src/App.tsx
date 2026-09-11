import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { WhatsAppFloat } from "./components/common/WhatsAppFloat";
import { MobileBottomNav } from "./components/common/MobileBottomNav";

import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { Services } from "./pages/Services";
import { Packages } from "./pages/Packages";
import { Solutions } from "./pages/Solutions";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { TemplatesGallery } from "./pages/TemplatesGallery";
import { DemoPage } from "./pages/DemoPage";
import { OrderPage } from "./pages/OrderPage";
import { Contact } from "./pages/Contact";
import { FaqPage } from "./pages/FaqPage";
import { About } from "./pages/About";
import { ProfilePage } from "./pages/ProfilePage";
import { CardRedirectPage } from "./pages/CardRedirectPage";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PortfolioExemple } from "./pages/PortfolioExemple";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isSpecial =
    location.pathname.startsWith("/p/") ||
    location.pathname.startsWith("/card/") ||
    location.pathname.startsWith("/admin");

  if (isSpecial) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 selection:bg-amber-400 selection:text-slate-950">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <MobileBottomNav />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SettingsProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/services" element={<Services />} />
                <Route path="/packs" element={<Packages />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
                <Route path="/templates" element={<TemplatesGallery />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/commander" element={<OrderPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
                <Route path="/conditions-generales" element={<TermsAndConditions />} />

                {/* Profile & Card Dynamic Endpoints */}
                <Route path="/p/:slug" element={<ProfilePage />} />
                <Route path="/card/:cardSlug" element={<CardRedirectPage />} />
                <Route path="/portfolio-exemple" element={<PortfolioExemple />} />

                {/* Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </SettingsProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
