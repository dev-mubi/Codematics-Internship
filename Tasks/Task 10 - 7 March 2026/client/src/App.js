import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { TrendingUp, LayoutDashboard, PieChart, LogOut } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
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
      <Analytics />
    </ToastProvider>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  // Apply theme to document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  // Check for an existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoading(false);
      navigate("/dashboard");
    }, 800);
  };

  const handleLogoutConfirm = async () => {
    setShowSignOutModal(false);
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
    toast.info("You have been signed out.");
    navigate("/login");
  };

  // Full-screen loader during initial session check or auth transitions
  if (isLoading) {
    return (
      <div className="premium-loader-container fullscreen">
        <PremiumLoader message="Initializing Onyx Wealth..." />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public root — redirect based on auth state */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
        />

        {/* Public auth route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Auth onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Protected application routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AppShell
                currentPage="dashboard"
                onSignOut={() => setShowSignOutModal(true)}
                isDark={isDark}
                toggleTheme={toggleTheme}
              >
                <Dashboard />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/budgets"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AppShell
                currentPage="budgets"
                onSignOut={() => setShowSignOutModal(true)}
                isDark={isDark}
                toggleTheme={toggleTheme}
              >
                <Budgets />
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Sign Out Confirmation Modal (shared across authenticated routes) */}
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

/**
 * AppShell — The authenticated layout wrapper.
 * Contains the sidebar and main content area.
 * Extracted from AppContent to be reused across protected routes.
 */
function AppShell({ currentPage, onSignOut, children }) {
  const navigate = useNavigate();

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
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button
            className={`sidebar-link ${currentPage === "budgets" ? "active" : ""}`}
            onClick={() => navigate("/budgets")}
          >
            <PieChart size={20} />
            <span>Budgets</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={onSignOut}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="app-main">
        <div className="app-content">{children}</div>
      </main>
    </div>
  );
}

export default App;
