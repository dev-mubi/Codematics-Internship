import React, { useState } from "react";
import "./BudgetForm.css";

const BudgetForm = ({
  onSubmit,
  initialData = null,
  categories = [
    "food",
    "transport",
    "entertainment",
    "utilities",
    "healthcare",
    "shopping",
    "other",
  ],
  onCancel,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      category: categories[0],
      monthlyLimit: "",
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.monthlyLimit || formData.monthlyLimit <= 0) {
      newErrors.monthlyLimit = "Monthly limit must be greater than 0";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      ...formData,
      monthlyLimit: parseFloat(formData.monthlyLimit),
    });
  };

  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={initialData !== null}
          className={errors.category ? "input-error" : ""}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="error-message">{errors.category}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="monthlyLimit">Monthly Limit *</label>
        <input
          type="number"
          id="monthlyLimit"
          name="monthlyLimit"
          value={formData.monthlyLimit}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className={errors.monthlyLimit ? "input-error" : ""}
        />
        {errors.monthlyLimit && (
          <span className="error-message">{errors.monthlyLimit}</span>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update Budget" : "Add Budget"}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
