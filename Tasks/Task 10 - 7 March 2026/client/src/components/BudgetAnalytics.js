import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency, getCategoryLabel } from "../utils/helpers";
import "./BudgetAnalytics.css";

const BudgetAnalytics = ({ velocityData, varianceData }) => {
  return (
    <div className="budget-analytics">
      <div className="analytics-section main-chart">
        <h3 className="analytics-title">Spending Velocity</h3>
        <p className="analytics-subtitle">Cumulative actual spending vs. ideal monthly pace</p>
        <div className="chart-container velocity-chart">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={velocityData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 10 }} 
                stroke="var(--text-secondary)"
                label={{ value: 'Day of Month', position: 'insideBottom', offset: -10, fontSize: 10 }}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                stroke="var(--text-secondary)"
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: "var(--bg-secondary)", 
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Cumulative"
                stroke="var(--accent-color)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorActual)"
              />
              <Area
                type="monotone"
                dataKey="ideal"
                name="Ideal Pace"
                stroke="var(--text-secondary)"
                strokeDasharray="5 5"
                strokeWidth={1}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics-section">
        <h3 className="analytics-title">Budget Variance</h3>
        <p className="analytics-subtitle">Utilization per category</p>
        <div className="chart-container bar-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={varianceData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
              <XAxis type="number" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
              <YAxis 
                dataKey="category" 
                type="category" 
                stroke="var(--text-secondary)" 
                tick={{ fontSize: 10 }}
                width={80}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ 
                   backgroundColor: "var(--bg-secondary)", 
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px"
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar 
                dataKey="budget" 
                name="Budget Limit" 
                fill="var(--text-secondary)" 
                opacity={0.15} 
                radius={[0, 4, 4, 0]}
              />
              <Bar 
                dataKey="actual" 
                name="Actual Spent" 
                fill="var(--accent-color)" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalytics;
