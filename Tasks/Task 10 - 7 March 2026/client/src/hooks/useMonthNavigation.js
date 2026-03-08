import { useState, useCallback } from "react";

/**
 * Hook for managing month navigation across the dashboard
 * Handles month state, navigation between months, and formatting
 */
export const useMonthNavigation = (initialMonth = null) => {
  const now = new Date();
  
  // Initialize with current month if not provided
  const defaultMonth = `${now.getUTCFullYear()}-${String(
    now.getUTCMonth() + 1
  ).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(initialMonth || defaultMonth);

  /**
   * Parse month string (YYYY-MM) into year and month
   */
  const parseMonth = useCallback((monthStr) => {
    const [year, month] = monthStr.split("-").map(Number);
    return { year, month };
  }, []);

  /**
   * Format year and month into string (YYYY-MM)
   */
  const formatMonth = useCallback((year, month) => {
    return `${year}-${String(month).padStart(2, "0")}`;
  }, []);

  /**
   * Go to previous month
   */
  const previousMonth = useCallback(() => {
    const { year, month } = parseMonth(selectedMonth);
    let newMonth = month - 1;
    let newYear = year;

    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setSelectedMonth(formatMonth(newYear, newMonth));
  }, [selectedMonth, parseMonth, formatMonth]);

  /**
   * Go to next month
   */
  const nextMonth = useCallback(() => {
    const { year, month } = parseMonth(selectedMonth);
    let newMonth = month + 1;
    let newYear = year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    setSelectedMonth(formatMonth(newYear, newMonth));
  }, [selectedMonth, parseMonth, formatMonth]);

  /**
   * Go to current month
   */
  const goToCurrentMonth = useCallback(() => {
    setSelectedMonth(defaultMonth);
  }, [defaultMonth]);

  /**
   * Check if selected month is current month
   */
  const isCurrentMonth = useCallback(() => {
    return selectedMonth === defaultMonth;
  }, [selectedMonth, defaultMonth]);

  /**
   * Get human-readable month name
   */
  const getMonthName = useCallback((monthStr = selectedMonth) => {
    const { year, month } = parseMonth(monthStr);
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }, [parseMonth, selectedMonth]);

  /**
   * Get list of past N months for navigation dropdown
   */
  const getPastMonths = useCallback((count = 12) => {
    const months = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getUTCFullYear(), now.getUTCMonth() - i);
      const month = formatMonth(date.getUTCFullYear(), date.getUTCMonth() + 1);
      months.push(month);
    }

    return months;
  }, [formatMonth]);

  /**
   * Set month directly
   */
  const setMonth = useCallback((monthStr) => {
    // Validate month format
    if (!/^\d{4}-\d{2}$/.test(monthStr)) {
      console.error("Invalid month format. Expected YYYY-MM");
      return;
    }
    setSelectedMonth(monthStr);
  }, []);

  return {
    selectedMonth,
    setMonth,
    previousMonth,
    nextMonth,
    goToCurrentMonth,
    isCurrentMonth,
    getMonthName,
    getPastMonths,
    parseMonth,
    formatMonth,
  };
};

export default useMonthNavigation;
