import React, { useState, useEffect } from "react";
import { TrendingUp, LayoutDashboard, PieChart, LogOut, Sun, Moon } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Auth from "./pages/Auth";
import { supabase } from "./utils/supabase";
import { useTheme } from "./hooks/useTheme";
import "./App.css";
import "./styles/global.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { isDark, toggleTheme } = useTheme();

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage("dashboard");
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Auth
        onLoginSuccess={() => {
          setIsLoggedIn(true);
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
          <button className="sidebar-logout" onClick={handleLogout}>
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
    </div>
  );
}

export default App;
