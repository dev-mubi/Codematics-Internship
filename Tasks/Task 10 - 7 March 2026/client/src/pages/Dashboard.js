import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import { Plus, Download, Undo2, Redo2 } from "lucide-react";
import Modal from "../components/Modal";
import PremiumLoader from "../components/PremiumLoader";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import FinancialOverview from "../components/FinancialOverview";
import SpendingTrendChart from "../components/SpendingTrendChart";
import CategoryAnalysis from "../components/CategoryAnalysis";
import { useTheme } from "../hooks/useTheme";
import { useCommandHistory } from "../hooks/useUndoRedo";
import useDebounce from "../hooks/useDebounce";
import * as api from "../utils/api";
import { useToast } from "../hooks/useToast";
import { formatDate } from "../utils/helpers";
import "./Dashboard.css";

const Dashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [paginatedTransactions, setPaginatedTransactions] = useState([]);
  const [previousTransactions, setPreviousTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("current-month");
  const [budgets, setBudgets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 20;

  const { push, undo, redo, canUndo, canRedo } = useCommandHistory();
  const toast = useToast();

  const categories = [
    "food",
    "transport",
    "entertainment",
    "utilities",
    "healthcare",
    "shopping",
    "other",
  ];

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Calculate statistics from transactions
  const calculateStats = (txns) => {
    if (!txns || txns.length === 0) {
      return {
        totalExpenses: 0,
        totalTransactions: 0,
        averageTransaction: 0,
      };
    }
    const total = txns.reduce((sum, t) => sum + t.amount, 0);
    return {
      totalExpenses: total,
      totalTransactions: txns.length,
      averageTransaction: total / txns.length,
    };
  };

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      let filters = {};

      if (dateFilter === "current-month") {
        // Calculate month boundaries using UTC
        // Important: Use getUTC* methods to avoid local timezone issues
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth(); // 0-11

        // First day of month at 00:00:00 UTC
        const startDate = new Date(Date.UTC(year, month, 1));
        // Last day of month at 23:59:59.999 UTC
        const endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

        filters.startDate = startDate.toISOString().split("T")[0];
        filters.endDate = endDate.toISOString().split("T")[0];
      } else if (dateFilter === "last-3-months") {
        // Calculate 3-month range using UTC
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth(); // 0-11

        // Start: 3 months ago on the 1st at 00:00:00 UTC
        const startDate = new Date(Date.UTC(year, month - 2, 1));
        // End: today at 23:59:59.999 UTC
        const endDate = new Date(
          Date.UTC(year, month, now.getUTCDate(), 23, 59, 59, 999)
        );

        filters.startDate = startDate.toISOString().split("T")[0];
        filters.endDate = endDate.toISOString().split("T")[0];
      }

      if (categoryFilter) {
        filters.category = categoryFilter;
      }

      const response = await api.getTransactions(filters);
      const data = Array.isArray(response.data) ? response.data : [];
      setTransactions(data);

      // Fetch previous period for trend calculation
      if (dateFilter === "current-month") {
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth(); // 0-11

        // Previous month start and end
        const prevStartDate = new Date(Date.UTC(year, month - 1, 1));
        const prevEndDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        const prevResponse = await api.getTransactions({
          startDate: prevStartDate.toISOString().split("T")[0],
          endDate: prevEndDate.toISOString().split("T")[0],
        });
        setPreviousTransactions(
          Array.isArray(prevResponse.data) ? prevResponse.data : []
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(
        "Error fetching transactions. Please check server connection."
      );
    } finally {
      setIsLoading(false);
    }
  }, [dateFilter, categoryFilter]);

  // Fetch budgets
  const fetchBudgets = useCallback(async () => {
    try {
      const response = await api.getBudgets?.();
      if (response?.data) {
        setBudgets(response.data);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  }, []);

  // Filter transactions based on search query and implement pagination
  useEffect(() => {
    let filtered = transactions;

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = transactions.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          (t.notes && t.notes.toLowerCase().includes(query))
      );
    }

    setFilteredTransactions(filtered);
    // Reset to page 1 when filters change
    setCurrentPage(1);

    // Paginate the filtered results (20 per page)
    const startIndex = 0;
    const endIndex = transactionsPerPage;
    setPaginatedTransactions(filtered.slice(startIndex, endIndex));
  }, [transactions, debouncedSearchQuery]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    setPaginatedTransactions(filteredTransactions.slice(startIndex, endIndex));
  }, [currentPage, filteredTransactions]);

  // Calculate total pages
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, [fetchTransactions, fetchBudgets]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  // Add transaction with undo/redo
  const handleAddTransaction = async (data) => {
    try {
      const response = await api.createTransaction(data);
      const created = response.data;
      let currentId = created._id;

      setTransactions((prev) => [created, ...prev]);
      setShowAddModal(false);
      toast.success("Transaction added successfully!");

      push({
        description: `Add "${created.title}"`,
        undo: async () => {
          await api.deleteTransaction(currentId);
          setTransactions((prev) => prev.filter((t) => t._id !== currentId));
        },
        redo: async () => {
          const res = await api.createTransaction(data);
          const recreated = res.data;
          currentId = recreated._id;
          setTransactions((prev) => [recreated, ...prev]);
        },
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Error adding transaction");
    }
  };

  // Update transaction with undo/redo
  const handleUpdateTransaction = async (data) => {
    try {
      const original = editingTransaction;
      const response = await api.updateTransaction(original._id, data);
      const updated = response.data;

      setTransactions((prev) =>
        prev.map((t) => (t._id === original._id ? updated : t))
      );
      setEditingTransaction(null);
      toast.success("Transaction updated successfully!");

      push({
        description: `Edit "${original.title}"`,
        undo: async () => {
          const res = await api.updateTransaction(original._id, {
            title: original.title,
            amount: original.amount,
            category: original.category,
            date: original.date.split("T")[0],
            notes: original.notes,
          });
          const restored = res.data;
          setTransactions((prev) =>
            prev.map((t) => (t._id === original._id ? restored : t))
          );
        },
        redo: async () => {
          const res = await api.updateTransaction(original._id, data);
          const reapplied = res.data;
          setTransactions((prev) =>
            prev.map((t) => (t._id === original._id ? reapplied : t))
          );
        },
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Error updating transaction");
    }
  };

  // Delete transaction with undo/redo
  const handleDeleteTransaction = async (id) => {
    try {
      const target = transactions.find((t) => t._id === id);
      await api.deleteTransaction(id);
      let currentId = id;

      setTransactions((prev) => prev.filter((t) => t._id !== id));
      toast.info("Transaction deleted");

      push({
        description: `Delete "${target.title}"`,
        undo: async () => {
          const res = await api.createTransaction({
            title: target.title,
            amount: target.amount,
            category: target.category,
            date: target.date.split("T")[0],
            notes: target.notes,
          });
          const recreated = res.data;
          currentId = recreated._id;
          setTransactions((prev) => [recreated, ...prev]);
        },
        redo: async () => {
          await api.deleteTransaction(currentId);
          setTransactions((prev) => prev.filter((t) => t._id !== currentId));
        },
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Error deleting transaction");
    }
  };

  // Export as CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const headers = ["Date", "Title", "Category", "Amount", "Notes"];
    const rows = filteredTransactions.map((t) => [
      formatDate(t.date),
      t.title,
      t.category,
      t.amount,
      t.notes || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = calculateStats(transactions);
  const previousStats = calculateStats(previousTransactions);

  return (
    <div className="dashboard">
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        title="Wealth Analysis"
      />

      <div className="dashboard__container">
        {isLoading && transactions.length === 0 ? (
          <div className="dashboard-content">
            <PremiumLoader message="Loading financial analysis..." />
          </div>
        ) : (
          <>
            {/* Professional Metrics Overview */}
            <FinancialOverview
              totalSpending={stats.totalExpenses}
              transactionCount={stats.totalTransactions}
              averageTransaction={stats.averageTransaction}
              previousTotalSpending={previousStats.totalExpenses}
            />

            {/* Spending Trend Visualization */}
            <SpendingTrendChart transactions={transactions} />

            {/* Category Analysis */}
            <CategoryAnalysis transactions={transactions} />

            {/* Control Panel */}
            <div className="dashboard-controls">
              <div className="controls-section search-section">
                <label className="control-label">Search</label>
                <input
                  type="text"
                  placeholder="Search by title, category, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="control-input search-input"
                />
              </div>

              <div className="controls-section filter-section">
                <div className="filter-group">
                  <label className="control-label">Time Period</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="control-select"
                  >
                    <option value="current-month">Current Month</option>
                    <option value="last-3-months">Last 3 Months</option>
                    <option value="all">All Time</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="control-label">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="control-select"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="controls-section action-section">
                <button
                  className="control-button button-add"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Transaction
                </button>
                <button
                  className="control-button button-export"
                  onClick={handleExportCSV}
                >
                  Export CSV
                </button>
                <button
                  className="control-button button-undo"
                  onClick={undo}
                  disabled={!canUndo}
                  title="Undo last action"
                >
                  Undo
                </button>
                <button
                  className="control-button button-redo"
                  onClick={redo}
                  disabled={!canRedo}
                  title="Redo last action"
                >
                  Redo
                </button>
              </div>
            </div>

            <div className="transactions-section">
              <h2 className="section-title">
                Transactions{" "}
                {filteredTransactions.length > 0 &&
                   `(${filteredTransactions.length})`}
              </h2>
              <TransactionList
                transactions={paginatedTransactions}
                onEdit={(transaction) => setEditingTransaction(transaction)}
                onDelete={handleDeleteTransaction}
                isLoading={isLoading}
                totalTransactions={filteredTransactions.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Quick Actions Bar */}
            <div className="quick-actions">
              <button 
                className="quick-actions__btn add" 
                onClick={() => setShowAddModal(true)}
                title="Add Transaction"
              >
                <Plus size={20} />
                <span>Add</span>
              </button>
              
              <div className="quick-actions__divider" />
              
              <button 
                className="quick-actions__btn" 
                onClick={handleExportCSV}
                title="Export CSV"
              >
                <Download size={18} />
              </button>
              
              <button 
                className="quick-actions__btn" 
                onClick={undo}
                disabled={!canUndo}
                title="Undo"
              >
                <Undo2 size={18} />
              </button>
              
              <button 
                className="quick-actions__btn" 
                onClick={redo}
                disabled={!canRedo}
                title="Redo"
              >
                <Redo2 size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        title="Add Transaction"
        onClose={() => setShowAddModal(false)}
      >
        <TransactionForm
          onSubmit={handleAddTransaction}
          categories={categories}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        isOpen={editingTransaction !== null}
        title="Edit Transaction"
        onClose={() => setEditingTransaction(null)}
      >
        {editingTransaction && (
          <TransactionForm
            onSubmit={(data) => {
              handleUpdateTransaction(data);
            }}
            initialData={{
              title: editingTransaction.title,
              amount: editingTransaction.amount,
              category: editingTransaction.category,
              date: editingTransaction.date.split("T")[0],
              notes: editingTransaction.notes,
            }}
            categories={categories}
            onCancel={() => setEditingTransaction(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
