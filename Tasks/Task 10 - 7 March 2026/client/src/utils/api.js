import axios from "axios";
import { supabase } from "./supabase";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
});

// Attach the Supabase access token to every outgoing request
API.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transaction APIs
export const getTransactions = (filters = {}) =>
  API.get("/transactions", { params: filters });

export const getTransaction = (id) => API.get(`/transactions/${id}`);

export const createTransaction = (data) => API.post("/transactions", data);

export const updateTransaction = (id, data) =>
  API.put(`/transactions/${id}`, data);

export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

export const getTransactionStats = (filters = {}) =>
  API.get("/transactions/stats", { params: filters });

// Budget APIs
export const getBudgets = () => API.get("/budgets");

export const getCurrentMonthBudgets = () => API.get("/budgets/current-month");

export const createBudget = (data) => API.post("/budgets", data);

export const updateBudget = (id, data) => API.put(`/budgets/${id}`, data);

export const deleteBudget = (id) => API.delete(`/budgets/${id}`);

export default API;
