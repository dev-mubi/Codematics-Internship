import React, { useState, useEffect } from "react";
import { TrendingUp, LayoutDashboard, PieChart, LogOut, Sun, Moon } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Auth from "./pages/Auth";
import SignOutModal from "./components/SignOutModal";
import PremiumLoader from "./components/PremiumLoader";
import { supabase } from "./utils/supabase";
import { useTheme } from "./hooks/useTheme";
import { ToastProvider, useToast } from "./hooks/useToast";
import "./App.css";
import "./styles/global.css";

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  useEffect(() => {
    // Check for an existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogoutConfirm = async () => {
    setShowSignOutModal(false);
    setIsLoading(true); // Show loader briefly before state clears
    await supabase.auth.signOut();
    setCurrentPage("dashboard");
    setIsLoading(false);
    toast.info("You have been signed out.");
  };

  if (isLoading) {
    return (
      <div className="premium-loader-container fullscreen">
        <PremiumLoader message="Initializing Onyx Wealth..." />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Auth
        onLoginSuccess={() => {
          setIsLoading(true); // Trigger loader for smooth transition
          setTimeout(() => {
            setIsLoggedIn(true);
            setIsLoading(false);
          }, 800); // Artificial sleek delay
        }}
      />
    );
  }

  return (
    <div className="app">
      {/* Sidebar Navigation */}
      <nav className="app-sidebar">
        <div className="sidebar-brand">
          <TrendingUp className="brand-icon" size={24} />
          <span className="brand-text">Onyx Wealth</span>
        </div>

        <div className="sidebar-links">
          <button
            className={`sidebar-link ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => setCurrentPage("dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          
          <button
            className={`sidebar-link ${currentPage === "budgets" ? "active" : ""}`}
            onClick={() => setCurrentPage("budgets")}
          >
            <PieChart size={20} />
            <span>Budgets</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={() => setShowSignOutModal(true)}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="app-main">
        <div className="app-content">
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "budgets" && <Budgets />}
        </div>
      </main>

      {/* Sign Out Confirmation Modal */}
      <SignOutModal 
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

export default App;
