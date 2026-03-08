import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./CategoryAnalysis.css";

const CategoryAnalysis = ({ transactions = [] }) => {
  // Calculate category breakdown
  const getCategoryBreakdown = () => {
    if (!transactions || transactions.length === 0) return [];

    const categoryMap = {};
    let total = 0;

    transactions.forEach((t) => {
      const category = t.category.toLowerCase();
      categoryMap[category] = (categoryMap[category] || 0) + t.amount;
      total += t.amount;
    });

    return Object.entries(categoryMap)
      .map(([category, amount]) => {
        const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
        return {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          value: parseFloat(amount.toFixed(2)),
          percentage: parseFloat(percentage),
          amount: amount.toLocaleString("en-US", { maximumFractionDigits: 2 }),
        };
      })
      .sort((a, b) => b.value - a.value);
  };

  const categories = getCategoryBreakdown();
  const totalSpending = categories.reduce((sum, cat) => sum + cat.value, 0);

  // Neutral color palette for professional aesthetics
  const COLORS = [
    "#1f2937",
    "#4b5563",
    "#6b7280",
    "#9ca3af",
    "#d1d5db",
    "#e5e7eb",
  ];

  const renderCustomLabel = ({ percentage }) => {
    return `${percentage}%`;
  };

  const renderTooltip = ({ payload }) => {
    if (payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="category-tooltip">
          <div className="tooltip-name">{data.name}</div>
          <div className="tooltip-value">${data.amount}</div>
          <div className="tooltip-percentage">{data.percentage}%</div>
        </div>
      );
    }
    return null;
  };

  if (categories.length === 0) {
    return (
      <div className="category-analysis">
        <div className="analysis-header">
          <h3>Category Breakdown</h3>
        </div>
        <div className="empty-state">
          <p>No spending data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-analysis">
      <div className="analysis-header">
        <h3>Category Breakdown</h3>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">
              $
              {totalSpending.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Categories</span>
            <span className="stat-value">{categories.length}</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={({ percentage }) => percentage > 5 ? `${percentage}%` : ""}
              outerRadius={window.innerWidth < 480 ? 60 : 70}
              innerRadius={window.innerWidth < 480 ? 35 : 40}
              paddingAngle={2}
              dataKey="value"
            >
              {categories.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span className="legend-text">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="category-list">
        <div className="list-header">
          <div className="list-col category-name">Category</div>
          <div className="list-col category-amount">Amount</div>
          <div className="list-col category-percent">Percentage</div>
        </div>
        {categories.map((category, index) => (
          <div key={category.name} className="list-row">
            <div className="list-col category-name">
              <span
                className="category-indicator"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              {category.name}
            </div>
            <div className="list-col category-amount">${category.amount}</div>
            <div className="list-col category-percent">
              {category.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryAnalysis;
