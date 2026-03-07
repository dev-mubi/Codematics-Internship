import React from "react";
import { TrendingUp } from "lucide-react";
import "./PremiumLoader.css";

const PremiumLoader = ({ message = "Loading Onyx Wealth..." }) => {
  return (
    <div className="premium-loader-container">
      <div className="premium-loader-content">
        <div className="loader-logo-wrapper">
          <div className="loader-glow" />
          <TrendingUp className="loader-icon" size={48} />
        </div>
        <h2 className="loader-message">{message}</h2>
        <div className="loader-bar-container">
          <div className="loader-bar-fill" />
        </div>
      </div>
    </div>
  );
};

export default PremiumLoader;
