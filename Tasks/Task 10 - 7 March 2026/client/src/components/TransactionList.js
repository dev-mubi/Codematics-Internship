import React from "react";
import { Trash2, Edit2 } from "lucide-react";
import { formatCurrency, formatDate, getCategoryLabel } from "../utils/helpers";
import "./TransactionList.css";

const TransactionList = ({
  transactions = [],
  onEdit,
  onDelete,
  isLoading = false,
  totalTransactions = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="transaction-list__loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list__empty">
        <p>No transactions found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      {/* Desktop: table view */}
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="transaction-row">
              <td className="date-cell">{formatDate(t.date)}</td>
              <td>
                <div className="transaction-title">{t.title}</div>
                {t.notes && <div className="transaction-notes">{t.notes}</div>}
              </td>
              <td>
                <span className="category-badge">
                  {getCategoryLabel(t.category)}
                </span>
              </td>
              <td className="amount-cell">{formatCurrency(t.amount)}</td>
              <td>
                <div className="actions-cell">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(t)}
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => {
                      if (window.confirm("Delete this transaction?")) {
                        onDelete(t._id);
                      }
                    }}
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: card view */}
      <div className="transaction-cards">
        {transactions.map((t) => (
          <div key={t._id} className="transaction-card">
            <div className="tc-header">
              <div className="tc-title-group">
                <span className="tc-title">{t.title}</span>
                {t.notes && <span className="tc-notes">{t.notes}</span>}
              </div>
              <span className="tc-amount">{formatCurrency(t.amount)}</span>
            </div>

            <div className="tc-footer">
              <div className="tc-meta">
                <span className="category-badge">
                  {getCategoryLabel(t.category)}
                </span>
                <span className="tc-date">{formatDate(t.date)}</span>
              </div>
              <div className="tc-actions">
                <button
                  className="action-btn edit-btn"
                  onClick={() => onEdit(t)}
                  aria-label="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => {
                    if (window.confirm("Delete this transaction?")) {
                      onDelete(t._id);
                    }
                  }}
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalTransactions > transactions.length && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
