// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper function to format date
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to get month-year string
export const getMonthYear = (date = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Helper function to get month-year display string
export const formatMonthYear = (date = new Date()) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};

// Category colors for consistency
export const categoryColors = {
  food: "#FF6B6B",
  transport: "#4ECDC4",
  entertainment: "#95E1D3",
  utilities: "#FFD93D",
  healthcare: "#FF6B9D",
  shopping: "#C44569",
  other: "#999999",
};

// Get category label
export const getCategoryLabel = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};
