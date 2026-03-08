import React, { useMemo } from "react";
import {
  Zap,
  Activity,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import { generateFinancialInsights } from "../utils/helpers";
import "./FinancialInsights.css";

const FinancialInsights = ({
  stats,
  transactions = [],
  isDarkTheme = false,
}) => {
  const insights = useMemo(() => {
    return generateFinancialInsights(stats, transactions, isDarkTheme);
  }, [stats, transactions, isDarkTheme]);

  const getIconComponent = (type) => {
    const iconMap = {
      category: TrendingUp,
      average: Zap,
      activity: Activity,
      alert: AlertCircle,
      success: CheckCircle,
      info: Lightbulb,
    };
    return iconMap[type] || Lightbulb;
  };

  return (
    <div className="financial-insights">
      <div className="insights-header">
        <h3 className="insights-title">Financial Insights</h3>
        <p className="insights-description">
          Smart observations about your spending
        </p>
      </div>

      <div className="insights-container">
        {insights.map((insight, index) => (
          <InsightItem
            key={index}
            insight={insight}
            index={index}
            IconComponent={getIconComponent(insight.type)}
          />
        ))}
      </div>
    </div>
  );
};

const InsightItem = ({ insight, index, IconComponent }) => {
  return (
    <div
      className={`insight-item insight-item--${insight.type}`}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="insight-icon-wrapper">
        <IconComponent size={18} className="insight-icon" />
      </div>
      <p className="insight-message">{insight.message}</p>
    </div>
  );
};

export default FinancialInsights;
