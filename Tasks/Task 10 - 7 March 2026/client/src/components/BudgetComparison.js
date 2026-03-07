import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getCategoryLabel, formatCurrency } from "../utils/helpers";
import "./Chart.css";

const BudgetComparison = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    category: getCategoryLabel(item.category),
    Budget: item.budget,
    Actual: item.actual,
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">Budget vs Actual Spending</h3>
      {chartData.length === 0 ? (
        <div className="chart-empty">No data available yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="category" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                color: "var(--text-primary)",
              }}
            />
            <Legend />
            <Bar dataKey="Budget" fill="var(--accent-color)" opacity={0.8} />
            <Bar dataKey="Actual" fill="#10b981" />
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BudgetComparison;
