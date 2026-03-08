import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./SpendingTrendChart.css";

const SpendingTrendChart = ({ transactions = [] }) => {
  // Calculate daily spending
  const getDailySpending = () => {
    if (!transactions || transactions.length === 0) return [];

    const dailyMap = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = date.getDate();
      const dateStr = `Mar ${key}`;
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + t.amount;
    });

    // Sort by date
    return Object.entries(dailyMap)
      .map(([date, amount]) => ({
        date,
        amount: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => {
        const aDay = parseInt(a.date.split(" ")[1]);
        const bDay = parseInt(b.date.split(" ")[1]);
        return aDay - bDay;
      });
  };

  const data = getDailySpending();

  // Calculate statistics
  const getStats = () => {
    if (data.length === 0) {
      return {
        highest: 0,
        average: 0,
        total: 0,
        highestDay: "—",
      };
    }

    const total = data.reduce((sum, item) => sum + item.amount, 0);
    const average = (total / data.length).toFixed(2);
    const highest = Math.max(...data.map((d) => d.amount));
    const highestDay = data.find((d) => d.amount === highest)?.date || "—";

    return {
      highest: parseFloat(highest.toFixed(2)),
      average: parseFloat(average),
      total: parseFloat(total.toFixed(2)),
      highestDay,
    };
  };

  const stats = getStats();

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <div className="tooltip-date">{data.date}</div>
          <div className="tooltip-amount">
            ${data.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </div>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="spending-trend">
        <div className="trend-header">
          <h3>Spending Trend</h3>
        </div>
        <div className="empty-state">
          <p>No spending data available for this period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="spending-trend">
      <div className="trend-header">
        <h3>Spending Trend</h3>
        <div className="trend-period">{data.length} days</div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--text-primary)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--text-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-color, #e5e5e5)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="var(--text-secondary, #666)"
              style={{ fontSize: "11px" }}
              tick={{ fill: "var(--text-secondary, #666)" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--text-secondary, #666)"
              style={{ fontSize: "11px" }}
              tick={{ fill: "var(--text-secondary, #666)" }}
              tickFormatter={(value) => `$${value}`}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip content={renderCustomTooltip} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--text-primary)"
              strokeWidth={2.5}
              fill="url(#spendingGradient)"
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="trend-stats">
        <div className="stat-item">
          <div className="stat-label">Highest Day</div>
          <div className="stat-text">{stats.highestDay}</div>
          <div className="stat-value">
            $
            {stats.highest.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">Daily Average</div>
          <div className="stat-text">per day</div>
          <div className="stat-value">
            $
            {stats.average.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">Period Total</div>
          <div className="stat-text">{data.length} days</div>
          <div className="stat-value">
            ${stats.total.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingTrendChart;
