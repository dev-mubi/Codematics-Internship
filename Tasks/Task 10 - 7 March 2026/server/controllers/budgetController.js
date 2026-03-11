const Budget = require("../models/Budget");

// Get all budgets
exports.getBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const budgets = await Budget.find({ userId }).sort({ category: 1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single budget
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    if (budget.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this budget" });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new budget
exports.createBudget = async (req, res) => {
  const { category, monthlyLimit, month } = req.body;
  const userId = req.userId;

  if (!category || !monthlyLimit) {
    return res
      .status(400)
      .json({ message: "Please provide category and monthlyLimit" });
  }

  const budget = new Budget({
    userId,
    category,
    monthlyLimit,
    month,
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Budget for this category already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    if (req.body.monthlyLimit) budget.monthlyLimit = req.body.monthlyLimit;
    if (req.body.month) budget.month = req.body.month;

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    if (budget.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this budget" });
    }
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get budgets for current month
exports.getCurrentMonthBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    const budgets = await Budget.find({ userId, month: currentMonth });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
