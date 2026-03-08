const Transaction = require("../models/Transaction");
const {
  parseUTCDate,
  getUTCMonthStartForYearMonth,
  getUTCMonthEndForYearMonth,
  getUTCMonthString,
  getUTCDayEnd,
} = require("../utils/dateUtils");

// Get all transactions with filtering
exports.getTransactions = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const userId = req.userId;
    let query = { userId };

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      // Parse dates as UTC - they come from frontend as ISO date strings (YYYY-MM-DD)
      if (startDate) {
        // Ensure we treat this as UTC midnight
        query.date.$gte = parseUTCDate(startDate);
      }
      if (endDate) {
        // For end date, include the entire day by going to 23:59:59.999 UTC
        const parsedEndDate = parseUTCDate(endDate);
        // Set to end of day in UTC
        parsedEndDate.setUTCHours(23, 59, 59, 999);
        query.date.$lte = parsedEndDate;
      }
    }

    const transactions = await Transaction.find(query).sort({
      date: -1,
      createdAt: -1,
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single transaction
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  const { title, amount, category, date, notes } = req.body;
  const userId = req.userId;

  if (!title || !amount || !category) {
    return res
      .status(400)
      .json({ message: "Please provide title, amount, and category" });
  }

  // UTC-safe date creation
  // If date provided, parse as UTC. Otherwise use current UTC time.
  const transactionDate = date ? parseUTCDate(date) : new Date();

  // Future date check (in UTC)
  if (transactionDate > getUTCDayEnd()) {
    return res
      .status(400)
      .json({ message: "Cannot create transactions for future dates" });
  }

  const transaction = new Transaction({
    userId,
    title,
    amount,
    category,
    date: transactionDate,
    notes,
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (req.body.title) transaction.title = req.body.title;
    if (req.body.amount) transaction.amount = req.body.amount;
    if (req.body.category) transaction.category = req.body.category;
    // UTC-safe date parsing
    if (req.body.date) {
      const updatedDate = parseUTCDate(req.body.date);
      // Future date check (in UTC)
      if (updatedDate > getUTCDayEnd()) {
        return res
          .status(400)
          .json({ message: "Cannot update transaction to a future date" });
      }
      transaction.date = updatedDate;
    }
    if (req.body.notes !== undefined) transaction.notes = req.body.notes;

    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this transaction" });
    }
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transaction statistics
exports.getStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.userId;
    let query = { userId };

    if (month && year) {
      // Use UTC-safe month boundary calculation
      const startDate = getUTCMonthStartForYearMonth(
        parseInt(year),
        parseInt(month)
      );
      const endDate = getUTCMonthEndForYearMonth(
        parseInt(year),
        parseInt(month)
      );
      query.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await Transaction.find(query);

    const stats = {
      totalExpenses: 0,
      categoryBreakdown: {},
      totalTransactions: transactions.length,
    };

    transactions.forEach((transaction) => {
      stats.totalExpenses += transaction.amount;
      if (!stats.categoryBreakdown[transaction.category]) {
        stats.categoryBreakdown[transaction.category] = 0;
      }
      stats.categoryBreakdown[transaction.category] += transaction.amount;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
