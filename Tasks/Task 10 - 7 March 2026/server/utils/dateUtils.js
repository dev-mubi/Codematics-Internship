/**
 * UTC Date Utilities
 *
 * All functions in this module handle dates exclusively in UTC.
 * This ensures consistent behavior regardless of server or client timezone.
 *
 * Key principles:
 * - All dates stored/returned are JavaScript Date objects (always in UTC)
 * - All date calculations use UTC methods (getUTC*, Date.UTC)
 * - Avoid local timezone methods (getMonth, getFullYear, etc.)
 */

/**
 * Create a UTC date for a given year, month, day
 * @param {number} year - 4-digit year
 * @param {number} month - Month (1-12, not 0-11)
 * @param {number} day - Day of month
 * @returns {Date} Date object set to UTC midnight of given date
 */
function createUTCDate(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Parse a date string and ensure it's treated as UTC
 * Accepts formats: "YYYY-MM-DD", "YYYY-MM-DDTHH:MM:SS.sssZ", etc.
 * @param {string} dateStr - ISO 8601 date string
 * @returns {Date} Date object in UTC
 */
function parseUTCDate(dateStr) {
  if (!dateStr) return null;
  // Ensure we parse as UTC by appending Z if not present
  const normalized =
    dateStr.includes("Z") || dateStr.includes("+") || dateStr.includes("-")
      ? dateStr
      : `${dateStr}T00:00:00Z`;
  return new Date(normalized);
}

/**
 * Get start of current UTC month
 * @returns {Date} First day of current month at 00:00:00 UTC
 */
function getUTCMonthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/**
 * Get end of current UTC month
 * @returns {Date} Last day of current month at 23:59:59.999 UTC
 */
function getUTCMonthEnd() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)
  );
}

/**
 * Get start of given UTC month
 * @param {number} year - 4-digit year
 * @param {number} month - Month (1-12, not 0-11)
 * @returns {Date} First day of given month at 00:00:00 UTC
 */
function getUTCMonthStartForYearMonth(year, month) {
  return new Date(Date.UTC(year, month - 1, 1));
}

/**
 * Get end of given UTC month
 * @param {number} year - 4-digit year
 * @param {number} month - Month (1-12, not 0-11)
 * @returns {Date} Last day of given month at 23:59:59.999 UTC
 */
function getUTCMonthEndForYearMonth(year, month) {
  return new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
}

/**
 * Get start of UTC today
 * @returns {Date} Today at 00:00:00 UTC
 */
function getUTCDayStart() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

/**
 * Get end of UTC today
 * @returns {Date} Today at 23:59:59.999 UTC
 */
function getUTCDayEnd() {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
}

/**
 * Get start of UTC N days ago
 * @param {number} daysAgo - Number of days to go back
 * @returns {Date} Date at 00:00:00 UTC
 */
function getUTCDaysAgoStart(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

/**
 * Get end of UTC N days ago
 * @param {number} daysAgo - Number of days to go back (0 = today, 1 = yesterday)
 * @returns {Date} Date at 23:59:59.999 UTC
 */
function getUTCDaysAgoEnd(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
}

/**
 * Get month string in UTC (YYYY-MM format)
 * @param {Date} date - Date object (if not provided, uses current UTC time)
 * @returns {string} Month string: "YYYY-MM"
 */
function getUTCMonthString(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Convert date to ISO date string (YYYY-MM-DD)
 * Uses UTC methods to ensure consistency
 * @param {Date} date - Date object
 * @returns {string} Date string in YYYY-MM-DD format (UTC)
 */
function toUTCDateString(date) {
  return date.toISOString().split("T")[0];
}

/**
 * Get current UTC timestamp
 * @returns {Date} Current time in UTC
 */
function getCurrentUTC() {
  return new Date();
}

/**
 * Verify that a date is truly in UTC
 * (All JavaScript Date objects are internally UTC, but use this for documentation)
 * @param {Date} date - Date object
 * @returns {boolean} Always true (JavaScript Dates are always UTC internally)
 */
function isUTC(date) {
  return date instanceof Date;
}

module.exports = {
  createUTCDate,
  parseUTCDate,
  getUTCMonthStart,
  getUTCMonthEnd,
  getUTCMonthStartForYearMonth,
  getUTCMonthEndForYearMonth,
  getUTCDayStart,
  getUTCDayEnd,
  getUTCDaysAgoStart,
  getUTCDaysAgoEnd,
  getUTCMonthString,
  toUTCDateString,
  getCurrentUTC,
  isUTC,
};
