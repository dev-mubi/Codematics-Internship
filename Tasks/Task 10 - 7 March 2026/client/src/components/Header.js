import React from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import "./Header.css";

const Header = ({ isDark, onToggleTheme, title = "Overview" }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <h1 className="header__title">{title}</h1>
        </div>
        <div className="header__right">
          <button
            className="header__theme-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            className="header__logout-btn mobile-only"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
