import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Header from "../components/Header";
import Modal from "../components/Modal";
import BudgetForm from "../components/BudgetForm";
import BudgetCard from "../components/BudgetCard";
import BudgetComparison from "../components/BudgetComparison";
import MonthlySpendings from "../components/MonthlySpendings";
import CategoryDistribution from "../components/CategoryDistribution";
import { useTheme } from "../hooks/useTheme";
import * as api from "../utils/api";
import {
  formatCurrency,
  getMonthYear,
  getCategoryLabel,
} from "../utils/helpers";
import "./Budgets.css";

const Budgets = () => {
  const { isDark, toggleTheme } = useTheme();
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState({});
  const [chartData, setChartData] = useState([]);

  const categories = [
    "food",
    "transport",
    "entertainment",
    "utilities",
    "healthcare",
    "shopping",
    "other",
  ];

  // Fetch budgets and transactions
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      // Fetch budgets
      const budgetsResponse = await api.getBudgets();
      setBudgets(budgetsResponse.data);

      // Fetch transactions for current month
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const transactionsResponse = await api.getTransactions({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });

      setTransactions(transactionsResponse.data);

      // Calculate spending by category
      const breakdown = {};
      categories.forEach((cat) => {
        breakdown[cat] = 0;
      });

      transactionsResponse.data.forEach((t) => {
        if (breakdown.hasOwnProperty(t.category)) {
          breakdown[t.category] += t.amount;
        }
      });

      setCategoryBreakdown(breakdown);

      // Prepare chart data
      const comparisonData = budgetsResponse.data.map((budget) => ({
        category: budget.category,
        budget: budget.monthlyLimit,
        actual: breakdown[budget.category] || 0,
      }));

      setChartData(comparisonData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add budget
  const handleAddBudget = async (data) => {
    try {
      const response = await api.createBudget(data);
      setBudgets([...budgets, response.data]);
      setShowAddModal(false);
      await fetchData();
    } catch (error) {
      console.error("Error adding budget:", error);
      alert("Error adding budget. Category may already have a budget.");
    }
  };

  // Update budget
  const handleUpdateBudget = async (data) => {
    try {
      const budgetId = budgets.find((b) => b.category === editingCategory)?._id;
      if (!budgetId) return;

      const response = await api.updateBudget(budgetId, data);
      setBudgets(budgets.map((b) => (b._id === budgetId ? response.data : b)));
      setEditingCategory(null);
      await fetchData();
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Error updating budget");
    }
  };

  // Delete budget
  const handleDeleteBudget = async (category) => {
    try {
      const budget = budgets.find((b) => b.category === category);
      if (!budget) return;

      await api.deleteBudget(budget._id);
      setBudgets(budgets.filter((b) => b.category !== category));
      await fetchData();
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Error deleting budget");
    }
  };

  // Apply theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  // Prepare data for category distribution chart
  const categoryChartData = categories
    .filter((cat) => categoryBreakdown[cat] > 0)
    .map((cat) => ({
      category: cat,
      amount: categoryBreakdown[cat],
    }));

  return (
    <div className="budgets">
      <Header isDark={isDark} onToggleTheme={toggleTheme} title="Budgets" />

      <div className="budgets__container">
        <div className="budgets__header">
          <h2 className="section-title">Budget Management</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} /> Add Budget
          </button>
        </div>

        {/* Budget Cards Grid */}
        <div className="budgets__grid">
          {isLoading ? (
            <div className="loading-spinner">Loading budgets...</div>
          ) : budgets.length === 0 ? (
            <div className="empty-state">
              <p>No budgets set yet. Create one to get started!</p>
            </div>
          ) : (
            budgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                category={budget.category}
                budget={budget}
                spent={categoryBreakdown[budget.category] || 0}
                onEdit={(cat) => setEditingCategory(cat)}
                onDelete={handleDeleteBudget}
              />
            ))
          )}
        </div>

        {/* Charts */}
        <div className="charts-section">
          <h2 className="section-title">Analytics</h2>
          <div className="charts-grid">
            <div className="chart-container">
              <BudgetComparison data={chartData} />
            </div>
            <div className="chart-container">
              <CategoryDistribution data={categoryChartData} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAddModal}
        title="Add Budget"
        onClose={() => setShowAddModal(false)}
      >
        <BudgetForm
          onSubmit={handleAddBudget}
          categories={categories}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={editingCategory !== null}
        title={`Edit ${
          editingCategory ? getCategoryLabel(editingCategory) : ""
        } Budget`}
        onClose={() => setEditingCategory(null)}
      >
        {editingCategory && (
          <BudgetForm
            onSubmit={(data) => {
              handleUpdateBudget(data);
            }}
            initialData={{
              category: editingCategory,
              monthlyLimit:
                budgets.find((b) => b.category === editingCategory)
                  ?.monthlyLimit || "",
            }}
            categories={categories}
            onCancel={() => setEditingCategory(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Budgets;
