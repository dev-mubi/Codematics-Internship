import React from "react";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency, getCategoryLabel } from "../utils/helpers";
import "./BudgetProgressSection.css";

const BudgetProgressSection = ({ budgets = [] }) => {
  if (!budgets || budgets.length === 0) {
    return null;
  }

  return (
    <div className="budget-progress-section">
      <div className="budget-header">
        <h3 className="budget-title">Budget Progress</h3>
        <p className="budget-description">
          Track your category spending against budgets
        </p>
      </div>

      <div className="budget-items-container">
        {budgets.map((budget, index) => (
          <BudgetProgressItem key={budget._id || index} budget={budget} />
        ))}
      </div>
    </div>
  );
};

const BudgetProgressItem = ({ budget }) => {
  const { category, spent, limit } = budget;
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const isExceeded = spent > limit;
  const isNearLimit = percentage >= 80 && percentage < 100;
  const categoryLabel =
    typeof category === "string"
      ? getCategoryLabel(category)
      : category?.name || "Unknown";

  let statusClass = "under";
  let StatusIcon = TrendingDown;

  if (isExceeded) {
    statusClass = "exceeded";
    StatusIcon = AlertCircle;
  } else if (isNearLimit) {
    statusClass = "near-limit";
    StatusIcon = TrendingUp;
  }

  return (
    <div className={`budget-item budget-item--${statusClass}`}>
      <div className="budget-item-header">
        <div className="budget-item-label">
          <h4 className="budget-category">{categoryLabel}</h4>
          <p className="budget-amounts">
            {formatCurrency(spent)} / {formatCurrency(limit)}
          </p>
        </div>
        <div className="budget-item-status">
          <StatusIcon size={16} className="budget-status-icon" />
          <span className="budget-percentage">{Math.round(percentage)}%</span>
        </div>
      </div>

      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div
            className={`progress-fill progress-fill--${statusClass}`}
            style={{
              width: `${Math.min(percentage, 100)}%`,
            }}
          />
        </div>
      </div>

      {isExceeded && (
        <p className="budget-alert">
          Over budget by {formatCurrency(spent - limit)}
        </p>
      )}
      {isNearLimit && !isExceeded && (
        <p className="budget-warning">
          {formatCurrency(limit - spent)} remaining
        </p>
      )}
    </div>
  );
};

export default BudgetProgressSection;
