import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  categoryColors,
  getCategoryLabel,
  formatCurrency,
} from "../utils/helpers";
import "./Chart.css";

const CategoryDistribution = ({ data = [] }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartData = data.map((item) => ({
    name: getCategoryLabel(item.category),
    value: item.amount,
    category: item.category,
  }));

  const colors = chartData.map(
    (item) => categoryColors[item.category] || "#999999"
  );

  return (
    <div className="chart-container">
      <h3 className="chart-title">Category Distribution</h3>
      {chartData.length === 0 ? (
        <div className="chart-empty">No data available yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={!isMobile}
              label={
                isMobile
                  ? false
                  : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={isMobile ? "70%" : "60%"}
              fill="#8884d8"
              dataKey="value"
            >
              {colors.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                color: "var(--text-primary)",
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CategoryDistribution;
