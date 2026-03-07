const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware (Allow all origins for dynamic Vercel deployments)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Protected Routes (require authentication)
app.use("/api/transactions", authMiddleware, transactionRoutes);
app.use("/api/budgets", authMiddleware, budgetRoutes);

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
