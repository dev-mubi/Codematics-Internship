import React, { useMemo } from "react";
import {
  DollarSign,
  Activity,
  TrendingUp,
  Target,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  formatCurrency,
  calculateTrendIndicator,
  getLargestCategory,
  getCategoryLabel,
  getAverageTransactionValue,
} from "../utils/helpers";
import "./DashboardSummary.css";

const DashboardSummary = ({
  stats,
  transactions = [],
  previousTransactions = [],
}) => {
  const metrics = useMemo(() => {
    const avgTransaction = getAverageTransactionValue(transactions);
    const largestCategory = getLargestCategory(transactions);

    // Calculate trend
    const currentTotal = stats.totalExpenses || 0;
    const previousTotal = previousTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const trend = calculateTrendIndicator(
      currentTotal,
      previousTotal || currentTotal
    );

    return {
      avgTransaction,
      largestCategory,
      trend,
    };
  }, [stats, transactions, previousTransactions]);

  const summaryCards = [
    {
      id: "total-spending",
      title: "Total Spending",
      value: formatCurrency(stats.totalExpenses || 0),
      icon: DollarSign,
      trend: metrics.trend,
      color: "primary",
    },
    {
      id: "transaction-count",
      title: "Transactions",
      value: stats.totalTransactions || 0,
      subtitle: "this month",
      icon: Activity,
      color: "secondary",
    },
    {
      id: "avg-transaction",
      title: "Avg Transaction",
      value: formatCurrency(metrics.avgTransaction || 0),
      icon: TrendingUp,
      color: "tertiary",
    },
    {
      id: "largest-category",
      title: "Largest Category",
      value: getCategoryLabel(metrics.largestCategory.category),
      subtitle: formatCurrency(metrics.largestCategory.amount),
      icon: Target,
      color: "quaternary",
    },
  ];

  return (
    <div className="dashboard-summary">
      {summaryCards.map((card) => (
        <SummaryCard key={card.id} card={card} />
      ))}
    </div>
  );
};

const SummaryCard = ({ card }) => {
  const Icon = card.icon;

  return (
    <div className={`summary-card summary-card--${card.color}`}>
      <div className="summary-card__header">
        <h3 className="summary-card__title">{card.title}</h3>
        <div className="summary-card__icon-wrapper">
          <Icon size={20} className="summary-card__icon" />
        </div>
      </div>

      <div className="summary-card__content">
        <p className="summary-card__value">{card.value}</p>
        {card.subtitle && (
          <p className="summary-card__subtitle">{card.subtitle}</p>
        )}
      </div>

      {card.trend && card.trend.percentage !== undefined && (
        <div
          className={`summary-card__trend summary-card__trend--${card.trend.direction}`}
        >
          {card.trend.direction === "up" ? (
            <ArrowUp size={14} />
          ) : (
            <ArrowDown size={14} />
          )}
          <span>{card.trend.percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default DashboardSummary;
