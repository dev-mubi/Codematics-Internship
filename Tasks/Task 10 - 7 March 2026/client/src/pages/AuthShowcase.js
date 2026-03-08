import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import "./AuthShowcase.css";

/* ─── Mock demo data (no real user data) ────────────────── */

const MONTHLY_SPEND = [
  { month: "Aug", amount: 2100 },
  { month: "Sep", amount: 2850 },
  { month: "Oct", amount: 2400 },
  { month: "Nov", amount: 3200 },
  { month: "Dec", amount: 2950 },
  { month: "Jan", amount: 3600 },
];

const CATEGORY_SPEND = [
  { name: "Food",       value: 38, color: "#e4e4e7" },
  { name: "Transport",  value: 22, color: "#a1a1aa" },
  { name: "Shopping",   value: 20, color: "#71717a" },
  { name: "Utilities",  value: 12, color: "#52525b" },
  { name: "Health",     value: 8,  color: "#3f3f46" },
];

const BUDGETS = [
  { label: "Food & Dining",   spent: 380,  limit: 500,  pct: 76 },
  { label: "Transport",       spent: 145,  limit: 250,  pct: 58 },
  { label: "Shopping",        spent: 490,  limit: 400,  pct: 100 },
  { label: "Utilities",       spent: 112,  limit: 200,  pct: 56 },
];

const TRANSACTIONS = [
  { name: "Spotify Premium",    cat: "Subscriptions", amount: "-$9.99",  delta: -1 },
  { name: "Salary Deposit",     cat: "Income",         amount: "+$4,200", delta: +1 },
  { name: "Whole Foods Market", cat: "Groceries",      amount: "-$67.42", delta: -1 },
  { name: "Netflix",            cat: "Entertainment",  amount: "-$15.99", delta: -1 },
  { name: "Freelance Invoice",  cat: "Income",         amount: "+$850",   delta: +1 },
];

const SUMMARY_STATS = [
  { label: "Net Balance",   value: "$12,480",  trend: "+8.4%" },
  { label: "Total Spent",   value: "$3,240",   trend: "+5.2%" },
  { label: "Saved",         value: "$4,800",   trend: "+12.1%" },
];

/* ─── Story components ───────────────────────────────────── */

/** Story 1 — animated transaction feed */
const StoryTransactions = ({ isActive }) => (
  <div className={`story-card ${isActive ? "story-enter" : ""}`}>
    <div className="story-card-header">
      <span className="story-chip">Recent Transactions</span>
      <span className="story-chip-secondary">January 2026</span>
    </div>
    <div className="tx-list">
      {TRANSACTIONS.map((tx, i) => (
        <div
          key={i}
          className="tx-row"
          style={{ animationDelay: isActive ? `${i * 80}ms` : "0ms" }}
        >
          <div className="tx-icon-wrap">
            <span className="tx-initials">{tx.name[0]}</span>
          </div>
          <div className="tx-details">
            <span className="tx-name">{tx.name}</span>
            <span className="tx-cat">{tx.cat}</span>
          </div>
          <span className={`tx-amount ${tx.delta > 0 ? "positive" : "negative"}`}>
            {tx.amount}
          </span>
        </div>
      ))}
    </div>
  </div>
);

/** Story 2 — spending trend area chart */
const StoryChart = ({ isActive }) => (
  <div className={`story-card ${isActive ? "story-enter" : ""}`}>
    <div className="story-card-header">
      <span className="story-chip">Monthly Spending</span>
      <span className="story-chip-positive">↑ 8.4%</span>
    </div>
    <div className="chart-summary-row">
      <div>
        <p className="chart-big-number">$3,600</p>
        <p className="chart-big-label">January spend</p>
      </div>
    </div>
    <div style={{ width: "100%", height: 130 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={MONTHLY_SPEND} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"   stopColor="#ffffff" stopOpacity={0.18} />
              <stop offset="95%"  stopColor="#ffffff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fill: "#52525b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "#1a1a1a",
              border: "1px solid #262626",
              borderRadius: 8,
              fontSize: 12,
              color: "#fff",
            }}
            formatter={(v) => [`$${v.toLocaleString()}`, "Spent"]}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#ffffff"
            strokeWidth={1.5}
            fill="url(#areaGrad)"
            dot={false}
            isAnimationActive={isActive}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

/** Story 3 — budget progress bars */
const StoryBudgets = ({ isActive }) => (
  <div className={`story-card ${isActive ? "story-enter" : ""}`}>
    <div className="story-card-header">
      <span className="story-chip">Budget Tracker</span>
      <span className="story-chip-secondary">This month</span>
    </div>
    <div className="budget-list">
      {BUDGETS.map((b, i) => (
        <div key={i} className="budget-row" style={{ animationDelay: isActive ? `${i * 90}ms` : "0ms" }}>
          <div className="budget-row-top">
            <span className="budget-label">{b.label}</span>
            <span className={`budget-fraction ${b.pct >= 100 ? "over" : ""}`}>
              ${b.spent} <span className="budget-limit">/ ${b.limit}</span>
            </span>
          </div>
          <div className="budget-track">
            <div
              className={`budget-fill ${b.pct >= 100 ? "budget-fill-over" : ""}`}
              style={{
                width: isActive ? `${Math.min(b.pct, 100)}%` : "0%",
                transitionDelay: isActive ? `${i * 90 + 200}ms` : "0ms",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/** Story 4 — category distribution + summary stats */
const StoryOverview = ({ isActive }) => (
  <div className={`story-card ${isActive ? "story-enter" : ""}`}>
    <div className="story-card-header">
      <span className="story-chip">Financial Overview</span>
      <span className="story-chip-secondary">Q1 2026</span>
    </div>
    <div className="overview-body">
      {/* Pie chart */}
      <div style={{ width: 130, height: 130, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={CATEGORY_SPEND}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={60}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={isActive}
              animationBegin={200}
              animationDuration={900}
              animationEasing="ease-out"
            >
              {CATEGORY_SPEND.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="pie-legend">
        {CATEGORY_SPEND.map((c, i) => (
          <div key={i} className="pie-legend-row">
            <span className="pie-dot" style={{ background: c.color }} />
            <span className="pie-cat-name">{c.name}</span>
            <span className="pie-cat-pct">{c.value}%</span>
          </div>
        ))}
      </div>
    </div>
    {/* Summary stats row */}
    <div className="summary-stats-row">
      {SUMMARY_STATS.map((s, i) => (
        <div key={i} className="summary-stat">
          <span className="summary-stat-value">{s.value}</span>
          <span className="summary-stat-label">{s.label}</span>
          <span className="summary-stat-trend">{s.trend}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Story metadata ─────────────────────────────────────── */

const STORIES = [
  {
    id: "transactions",
    headline: "Track every transaction",
    subtext: "Every expense and income entry, organized and searchable.",
    Component: StoryTransactions,
  },
  {
    id: "chart",
    headline: "Visualize your spending",
    subtext: "Monthly trends and patterns, rendered in real time.",
    Component: StoryChart,
  },
  {
    id: "budgets",
    headline: "Control your budgets",
    subtext: "Set category limits and monitor exactly where you stand.",
    Component: StoryBudgets,
  },
  {
    id: "overview",
    headline: "Understand your finances",
    subtext: "A complete picture of your wealth, at a glance.",
    Component: StoryOverview,
  },
];

/* ─── Main export ─────────────────────────────────────────── */

const AuthShowcase = ({ activeSlide, onDotClick }) => {
  const story = STORIES[activeSlide] || STORIES[0];
  const { Component } = story;

  return (
    <div className="showcase-body">
      {/* Animated product preview card */}
      <div className="preview-window">
        <div className="preview-window-bar">
          <span className="window-dot red" />
          <span className="window-dot yellow" />
          <span className="window-dot green" />
          <span className="window-title">onyx — dashboard</span>
        </div>
        <div className="preview-content">
          <Component isActive key={activeSlide} />
        </div>
      </div>

      {/* Story headline + subtext */}
      <div className="story-meta" key={`meta-${activeSlide}`}>
        <p className="story-headline">{story.headline}</p>
        <p className="story-subtext">{story.subtext}</p>
      </div>

      {/* Progress dots */}
      <div className="story-dots" aria-label="Feature navigation">
        {STORIES.map((_, idx) => (
          <button
            key={idx}
            className={`story-dot ${idx === activeSlide ? "active" : ""}`}
            onClick={() => onDotClick && onDotClick(idx)}
            aria-label={`View ${STORIES[idx].headline}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthShowcase;
