import React, { useEffect, useState, useCallback } from "react";
import { Download, RotateCcw, Activity, DollarSign, Search, Filter, Plus } from "lucide-react";
import Header from "../components/Header";
import Modal from "../components/Modal";
import PremiumLoader from "../components/PremiumLoader";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import { useTheme } from "../hooks/useTheme";
import { useCommandHistory } from "../hooks/useUndoRedo";
import { useDebounce } from "../hooks/useDebounce";
import * as api from "../utils/api";
import { useToast } from "../hooks/useToast";
import {
  formatDate,
  formatCurrency,
  formatMonthYear,
} from "../utils/helpers";
import "./Dashboard.css";

const Dashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("current-month");
  const [stats, setStats] = useState({
    totalExpenses: 0,
    categoryBreakdown: {},
    totalTransactions: 0,
  });

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

  const refreshStats = useCallback(async (filters = {}) => {
    const statsResponse = await api.getTransactionStats(filters);
    setStats(statsResponse.data);
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      let filters = {};

      if (dateFilter === "current-month") {
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        filters.startDate = startDate.toISOString().split("T")[0];
        filters.endDate = endDate.toISOString().split("T")[0];
      } else if (dateFilter === "last-3-months") {
        const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        filters.startDate = startDate.toISOString().split("T")[0];
        filters.endDate = now.toISOString().split("T")[0];
      }

      if (categoryFilter) {
        filters.category = categoryFilter;
      }

      const response = await api.getTransactions(filters);
      const data = Array.isArray(response.data) ? response.data : [];
      setTransactions(data);

      await refreshStats(filters);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error fetching transactions. Please check server connection.");
    } finally {
      setIsLoading(false);
    }
  }, [dateFilter, categoryFilter, refreshStats]);

  // Filter transactions based on search query
  useEffect(() => {
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      setFilteredTransactions(
        transactions.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query) ||
            (t.notes && t.notes.toLowerCase().includes(query))
        )
      );
    } else {
      setFilteredTransactions(transactions);
    }
  }, [transactions, debouncedSearchQuery]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  // -------------------------------------------------------
  // Add transaction — with undo (deletes it) / redo (re-creates)
  // -------------------------------------------------------
  const handleAddTransaction = async (data) => {
    try {
      const response = await api.createTransaction(data);
      const created = response.data;
      let currentId = created._id; // Mutable ID tracker for the closure

      setTransactions((prev) => [created, ...prev]);
      setStats((prev) => ({
        ...prev,
        totalExpenses: prev.totalExpenses + created.amount,
        totalTransactions: prev.totalTransactions + 1,
      }));
      setShowAddModal(false);
      toast.success("Transaction added successfully!");

      push({
        description: `Add "${created.title}"`,
        undo: async () => {
          await api.deleteTransaction(currentId);
          setTransactions((prev) => prev.filter((t) => t._id !== currentId));
          setStats((prev) => ({
            ...prev,
            totalExpenses: prev.totalExpenses - created.amount,
            totalTransactions: prev.totalTransactions - 1,
          }));
        },
        redo: async () => {
          const res = await api.createTransaction(data);
          const recreated = res.data;
          currentId = recreated._id; // Update ID for next Undo
          setTransactions((prev) => [recreated, ...prev]);
          setStats((prev) => ({
            ...prev,
            totalExpenses: prev.totalExpenses + recreated.amount,
            totalTransactions: prev.totalTransactions + 1,
          }));
        },
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Error adding transaction");
    }
  };

  // -------------------------------------------------------
  // Update transaction — undo restores original, redo re-applies new
  // -------------------------------------------------------
  const handleUpdateTransaction = async (data) => {
    try {
      const original = editingTransaction;
      const response = await api.updateTransaction(original._id, data);
      const updated = response.data;

      setTransactions((prev) =>
        prev.map((t) => (t._id === original._id ? updated : t))
      );
      setStats((prev) => ({
        ...prev,
        totalExpenses: prev.totalExpenses - original.amount + updated.amount,
      }));
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
          setStats((prev) => ({
            ...prev,
            totalExpenses: prev.totalExpenses - updated.amount + original.amount,
          }));
        },
        redo: async () => {
          const res = await api.updateTransaction(original._id, data);
          const reapplied = res.data;
          setTransactions((prev) =>
            prev.map((t) => (t._id === original._id ? reapplied : t))
          );
          setStats((prev) => ({
            ...prev,
            totalExpenses: prev.totalExpenses - original.amount + reapplied.amount,
          }));
        },
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Error updating transaction");
    }
  };

  // -------------------------------------------------------
  // Delete transaction — undo re-creates it, redo deletes again
  // -------------------------------------------------------
  const handleDeleteTransaction = async (id) => {
    try {
      const target = transactions.find((t) => t._id === id);
      await api.deleteTransaction(id);
      let currentId = id; // Mutable ID tracker for the redo action

      setTransactions((prev) => prev.filter((t) => t._id !== id));
      setStats((prev) => ({
        ...prev,
        totalExpenses: prev.totalExpenses - target.amount,
        totalTransactions: prev.totalTransactions - 1,
      }));
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
          currentId = recreated._id; // Update ID for next Redo
          setTransactions((prev) => [recreated, ...prev]);
          setStats((prev) => ({
            ...prev,
            totalExpenses: prev.totalExpenses + recreated.amount,
            totalTransactions: prev.totalTransactions + 1,
          }));
        },
        redo: async () => {
          await api.deleteTransaction(currentId);
          setTransactions((prev) => prev.filter((t) => t._id !== currentId));
          setStats((prev) => ({
            ...prev,
            totalExpenses: prev.totalExpenses - target.amount,
            totalTransactions: prev.totalTransactions - 1,
          }));
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

  return (
    <div className="dashboard">
      <Header isDark={isDark} onToggleTheme={toggleTheme} title="Overview" />

      <div className="dashboard__container">
        {/* Render Premium Loader overlay when fetching initial data */}
        {isLoading && transactions.length === 0 ? (
          <div className="dashboard-content">
            <PremiumLoader message="Fetching your financial data..." />
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="summary-stats">
              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-label">Total Expenses {formatMonthYear()}</h3>
                  <div className="stat-icon-wrapper">
                    <DollarSign size={20} className="stat-icon" />
                  </div>
                </div>
                <p className="stat-value">{formatCurrency(stats.totalExpenses)}</p>
              </div>
              <div className="stat-card">
                <div className="stat-card-header">
                  <h3 className="stat-label">Transactions</h3>
                  <div className="stat-icon-wrapper">
                    <Activity size={20} className="stat-icon" />
                  </div>
                </div>
                <p className="stat-value">{stats.totalTransactions}</p>
              </div>
            </div>

            {/* Filters and Actions */}
            <div className="controls">
              <div className="search-bar">
            <div className="input-wrapper search-wrapper">
              <Search size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filters">
            <div className="input-wrapper select-wrapper">
              <Filter size={18} className="input-icon" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
              >
                <option value="current-month">Current Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div className="input-wrapper select-wrapper">
              <Filter size={18} className="input-icon" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
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

          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} /> Add Transaction
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleExportCSV}
              title="Export as CSV"
            >
              <Download size={16} /> Export
            </button>
            <div className="history-actions">
              <button
                className="btn btn-secondary btn-undo"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
              >
                <div className="btn-icon-wrapper">
                  <RotateCcw size={16} style={{ transform: "rotate(-45deg)" }} />
                </div>
                <span>Undo</span>
              </button>
              <button
                className="btn btn-secondary btn-redo"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
              >
                <div className="btn-icon-wrapper">
                  <RotateCcw size={16} style={{ transform: "scaleX(-1) rotate(-45deg)" }} />
                </div>
                <span>Redo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="transactions-section">
          <h2 className="section-title">Recent Transactions</h2>
          <TransactionList
            transactions={filteredTransactions}
            onEdit={(transaction) => setEditingTransaction(transaction)}
            onDelete={handleDeleteTransaction}
            isLoading={isLoading}
          />
        </div>
        </>
        )}
      </div>

      {/* Modals */}
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
