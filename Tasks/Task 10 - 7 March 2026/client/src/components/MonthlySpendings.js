import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../utils/helpers";
import "./Chart.css";

const MonthlySpendings = ({ data = [] }) => {
  const chartData = data.map((item) => ({
    month: item.month,
    spending: item.spending,
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">Monthly Spending Trend</h3>
      {chartData.length === 0 ? (
        <div className="chart-empty">No data available yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsLineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="month" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                color: "var(--text-primary)",
              }}
              formatter={(value) => formatCurrency(value)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="spending"
              stroke="var(--accent-color)"
              strokeWidth={2}
              dot={{ fill: "var(--accent-color)", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MonthlySpendings;
