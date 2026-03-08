import React from "react";
import "./FinancialOverview.css";

const FinancialOverview = ({
  totalSpending = 0,
  transactionCount = 0,
  averageTransaction = 0,
  previousTotalSpending = 0,
}) => {
  // Calculate spending change
  const getChangeIndicator = (current, previous) => {
    if (previous === 0) return { value: "—", direction: "neutral" };
    const change = ((current - previous) / previous) * 100;
    const absValue = Math.abs(change).toFixed(0);
    if (change > 0) {
      return { value: `+${absValue}%`, direction: "up" };
    } else if (change < 0) {
      return { value: `${absValue}%`, direction: "down" };
    }
    return { value: "0%", direction: "neutral" };
  };

  const spendingChange = getChangeIndicator(
    totalSpending,
    previousTotalSpending
  );

  return (
    <div className="financial-overview">
      <div className="metric-card">
        <div className="metric-label">Total Spending</div>
        <div className="metric-value">
          ${totalSpending.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </div>
        <div className={`metric-change change-${spendingChange.direction}`}>
          {spendingChange.value}
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Transactions</div>
        <div className="metric-value">{transactionCount}</div>
        <div className="metric-subtext">entries</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Average Transaction</div>
        <div className="metric-value">
          $
          {averageTransaction.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="metric-subtext">per transaction</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Current Period</div>
        <div className="metric-value">
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </div>
        <div className="metric-subtext">month</div>
      </div>
    </div>
  );
};

export default FinancialOverview;
