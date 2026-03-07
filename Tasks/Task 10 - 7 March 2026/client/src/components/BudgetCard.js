import React from "react";
import { Edit2, Trash2, AlertCircle } from "lucide-react";
import {
  formatCurrency,
  categoryColors,
  getCategoryLabel,
} from "../utils/helpers";
import "./BudgetCard.css";

const BudgetCard = ({ category, budget, spent = 0, onEdit, onDelete }) => {
  const remaining = budget.monthlyLimit - spent;
  const percentageUsed = (spent / budget.monthlyLimit) * 100;
  const isOverBudget = spent > budget.monthlyLimit;

  return (
    <div className={`budget-card ${isOverBudget ? "budget-card--over" : ""}`}>
      <div className="budget-card__header">
        <h3 className="budget-card__title">{getCategoryLabel(category)}</h3>
        <div className="budget-card__actions">
          <button
            className="budget-card__action-btn edit"
            onClick={() => onEdit(category)}
            title="Edit budget"
            aria-label="Edit budget"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="budget-card__action-btn delete"
            onClick={() => {
              if (window.confirm(`Delete budget for ${category}?`)) {
                onDelete(category);
              }
            }}
            title="Delete budget"
            aria-label="Delete budget"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="budget-card__progress">
        <div
          className="budget-card__progress-bar"
          style={{
            width: `${Math.min(percentageUsed, 100)}%`,
            backgroundColor: categoryColors[category] || "var(--accent-color)",
          }}
        />
      </div>

      <div className="budget-card__stats">
        <div className="stat">
          <span className="stat__label">Spent</span>
          <span className={`stat__value ${isOverBudget ? "over-budget" : ""}`}>
            {formatCurrency(spent)}
          </span>
        </div>
        <div className="stat">
          <span className="stat__label">Budget</span>
          <span className="stat__value">
            {formatCurrency(budget.monthlyLimit)}
          </span>
        </div>
        <div className="stat">
          <span className="stat__label">Remaining</span>
          <span
            className={`stat__value ${
              isOverBudget ? "over-budget" : "remaining"
            }`}
          >
            {formatCurrency(Math.max(remaining, 0))}
          </span>
        </div>
      </div>

      {isOverBudget && (
        <div className="budget-card__warning">
          <AlertCircle size={14} className="warning-icon" /> 
          <span>Budget exceeded by {formatCurrency(spent - budget.monthlyLimit)}</span>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
