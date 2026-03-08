/**
 * Professional Analytics Helpers
 * No gradients, no emoji, no color gradients
 * Data-driven, minimal aesthetic
 */

/**
 * Format number with proper spacing for readability
 * Example: 1234.56 -> "1,234.56"
 */
export const formatNumber = (value) => {
  if (typeof value !== "number") return "0";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Format currency with $ symbol
 * Example: 1234.56 -> "$1,234.56"
 */
export const formatCurrency = (amount) => {
  return `$${formatNumber(amount)}`;
};

/**
 * Calculate daily spending aggregates
 * Returns: [{ date: 'Mar 1', amount: 245.50 }, ...]
 */
export const calculateDailySpending = (transactions = []) => {
  if (!transactions || transactions.length === 0) return [];

  const dailyMap = {};
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getMonth() + 1}/${date.getDate()}`;
    dailyMap[key] = (dailyMap[key] || 0) + t.amount;
  });

  return Object.entries(dailyMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => {
      const [aMonth, aDay] = a.date.split("/").map(Number);
      const [bMonth, bDay] = b.date.split("/").map(Number);
      return aMonth === bMonth ? aDay - bDay : aMonth - bMonth;
    });
};

/**
 * Calculate category totals with percentages
 * Returns: [{ category: 'food', amount: 450.50, percentage: '35%' }, ...]
 */
export const calculateCategoryBreakdown = (transactions = []) => {
  if (!transactions || transactions.length === 0) return [];

  const categoryMap = {};
  let total = 0;

  transactions.forEach((t) => {
    const category = t.category.toLowerCase();
    categoryMap[category] = (categoryMap[category] || 0) + t.amount;
    total += t.amount;
  });

  const breakdown = Object.entries(categoryMap)
    .map(([category, amount]) => {
      const percentage = total > 0 ? ((amount / total) * 100).toFixed(0) : 0;
      return {
        category: capitalizeFirst(category),
        categoryKey: category,
        amount,
        percentage: `${percentage}%`,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return breakdown;
};

/**
 * Get highest spending category
 */
export const getHighestCategory = (transactions = []) => {
  const breakdown = calculateCategoryBreakdown(transactions);
  return breakdown.length > 0 ? breakdown[0] : null;
};

/**
 * Calculate average transaction value
 */
export const getAverageTransaction = (transactions = []) => {
  if (!transactions || transactions.length === 0) return 0;
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  return total / transactions.length;
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get percentage change between two values
 * Returns: { value: 12.5, direction: 'up' } or { value: -8.3, direction: 'down' }
 */
export const getPercentageChange = (current, previous) => {
  if (previous === 0) return { value: 0, direction: "flat" };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change).toFixed(1),
    direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
  };
};

/**
 * Format date for display
 * Example: "2025-03-15" -> "Mar 15"
 */
export const formatDateShort = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

/**
 * Get month-year string
 * Example: "March 2025"
 */
export const formatMonthYear = (date = new Date()) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

/**
 * Check if transaction is within budget
 */
export const getBudgetStatus = (spent, limit) => {
  if (limit === 0) return "no-budget";
  const percentage = (spent / limit) * 100;
  if (percentage > 100) return "exceeded";
  if (percentage >= 80) return "caution";
  return "ontrack";
};

/**
 * Format percentage for display
 * Example: 45 -> "45%"
 */
export const formatPercentage = (value) => {
  return `${Math.round(value)}%`;
};

/**
 * Get readable comparison text
 */
export const getComparisonText = (current, previous) => {
  const change = getPercentageChange(current, previous);
  if (change.direction === "flat") return "No change";
  const direction = change.direction === "up" ? "increase" : "decrease";
  return `${change.value}% ${direction}`;
};
