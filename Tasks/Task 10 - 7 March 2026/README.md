# Task 10 - Onyx Wealth (Full-Stack Personal Finance Dashboard)

**Date**: 7 March 2026
**Author**: Mubashir Shahzaib

---

## Overview

Onyx Wealth is a full-stack personal finance management application developed as Task 10 of the internship programme. Beyond serving as an academic exercise, this project stands as a fully deployed, production-ready application accessible to real users. It represents the culmination of concepts explored across prior tasks, integrated into a cohesive, polished system built to professional standards.

The application provides individuals with a powerful, intuitive platform to manage their financial activity. Users can register securely, record and track expense transactions, define monthly budget limits across multiple spending categories, and view dynamic visual representations of their financial data. The interface is designed with significant attention to user experience, featuring a responsive dual-theme design system that adapts seamlessly between dark and light modes.

The system is architecturally separated into an independent React frontend and an Express-powered backend API, both deployed to dedicated cloud platforms and communicating over a secure HTTP interface.

---

## Application Features

### Authentication
- User registration via email, verified through an 8-digit One-Time Passcode (OTP) delivered securely by Supabase.
- Persistent session management using Supabase JWT tokens, which are validated on every API request.
- Automated session invalidation and redirection to the login screen when a token becomes invalid or expires, handled at the API layer without user disruption.

### Dashboard
- An overview of total spending, transaction volume, and category breakdowns displayed through summary statistics cards.
- A filterable, paginated transaction table with support for searching, filtering by category, filtering by date range, and downloading data as a CSV export.
- Real-time chart visualizations powered by Recharts, providing a graphical breakdown of spending patterns.
- Ability to create, edit, and delete financial transactions with inline loading indicators that prevent duplicate submissions.
- Undo-redo support for recent transaction actions.

### Budgets
- Definition of monthly budget limits for any spending category.
- Visual comparison of actual spending against defined monthly limits through bar charts.
- Category distribution pie chart illustrating the proportional share of spending across categories.
- Immediate synchronization of budget modifications across all dependent chart data.

### User Experience
- Premium fullscreen loading state displayed during initial data retrieval, preventing the display of empty or zero-value statistics.
- Custom sign-out confirmation modal in place of native browser dialogs.
- Non-blocking toast notification system for all success, error, and informational feedback.
- Vercel Analytics instrumented natively at the application root, tracking page views across production deployments.

---

## Project Structure

```
Task 10 - 7 March 2026/
|
|-- client/             # React frontend application
|   |-- public/         # Static assets, favicon, and web manifest
|   |-- src/
|       |-- components/ # Reusable UI components
|       |-- hooks/      # Custom React hooks (theme, toast, undo-redo)
|       |-- pages/      # Core page components (Auth, Dashboard, Budgets)
|       |-- styles/     # Global CSS and theming
|       |-- utils/      # Axios API client and Supabase client
|
|-- server/             # Node.js Express backend API
|   |-- config/         # Database connection configuration
|   |-- controllers/    # Route handler logic
|   |-- middleware/     # Authentication and request middleware
|   |-- models/         # Mongoose schemas (Transaction, Budget)
|   |-- routes/         # Express route definitions
|   |-- server.js       # Application entry point
```

---

## Setup Instructions

### 1. Prerequisites

Ensure the following are installed on your local development machine before proceeding:

- **Node.js**: Version 16.x or higher
- **npm**: Comes bundled with Node.js

### 2. Clone or Navigate to the Project

```bash
cd "Task 10 - 7 March 2026"
```

### 3. Configure Environment Variables

This application relies on environment variable files in both the `server` and `client` directories. These files are excluded from version control and must be created manually.

#### Server Environment File (`/server/.env`)

Create a file named `.env` inside the `server/` directory with the following variable names:

```env
# MongoDB Atlas Connection String
MONGODB_URI=your_mongodb_atlas_connection_string

# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Project Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

> Note: The `SUPABASE_JWT_SECRET` is used to verify JWT tokens attached to incoming API requests. It is found in your Supabase Project dashboard under Settings > API.

#### Client Environment File (`/client/.env`)

Create a file named `.env` inside the `client/` directory with the following variable names:

```env
# Supabase Project Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API Base URL
# For local development, use: http://localhost:5000/api
# For production, point to your deployed server URL
REACT_APP_API_BASE_URL=your_backend_api_url

# Optional: Disable ESLint plugin during development if needed
DISABLE_ESLINT_PLUGIN=true
```

> Note: For local development, ensure `REACT_APP_API_BASE_URL` points to your locally running Express server (`http://localhost:5000/api`). For production builds deployed to Vercel, this should point to the Railway-hosted backend deployment URL.

---

### 4. Install Server Dependencies

Open a terminal, navigate to the `server/` directory, and install the required packages:

```bash
cd server
npm install
```

### 5. Start the Backend Server

Once dependencies are installed, start the development server:

```bash
npm run dev
```

The server will connect to your MongoDB Atlas cluster and begin listening on the configured port (default: `5000`). Keep this terminal session open.

### 6. Install Client Dependencies

Open a separate terminal window, navigate to the `client/` directory, and install the frontend dependencies. The `--legacy-peer-deps` flag is required due to specific peer dependency resolution requirements in the existing React environment:

```bash
cd client
npm install --legacy-peer-deps
```

### 7. Start the Frontend Application

Once the installation is complete, launch the React development server:

```bash
npm start
```

The application will open automatically in your browser at `http://localhost:3000`. Ensure the backend server from Step 5 is still running in a separate terminal, as the frontend depends on it to load and mutate financial data.

---

## Deployment

The application has been deployed to production and is accessible online.

| Layer    | Platform | Notes                                        |
|----------|----------|----------------------------------------------|
| Frontend | Vercel   | Automatic deployments on every commit        |
| Backend  | Railway  | Always-on server with environment isolation  |
| Database | MongoDB Atlas | Cloud-hosted cluster with persistent storage |
| Auth     | Supabase | Email OTP and JWT session management         |

The Vercel deployment has Vercel Analytics enabled, providing real-time visibility into traffic and user behaviour directly within the Vercel project dashboard.

---

## Technical Stack

| Category        | Technology                           |
|-----------------|--------------------------------------|
| Frontend        | React.js (Create React App)          |
| Styling         | Vanilla CSS, Custom Theme System     |
| Icons           | Lucide React                         |
| Charts          | Recharts                             |
| Analytics       | Vercel Analytics                     |
| Backend         | Node.js, Express.js                  |
| Database        | MongoDB (Mongoose ODM)               |
| Authentication  | Supabase Auth (Email/OTP + JWT)      |
| HTTP Client     | Axios (with interceptors)            |

---

## Ownership and Intellectual Property

This project was independently conceptualised, designed, and developed by Mubashir Shahzaib as part of the Codematics internship programme. While the application is publicly deployed, the underlying source code, architectural decisions, component structure, and overall system design remain the intellectual property of the author.

Reproduction, redistribution, or repurposing of any portion of this codebase without explicit written permission from the author is strongly discouraged. Academic and professional integrity is expected of anyone who accesses or references this work. Plagiarism, whether in whole or in part, does a disservice to the effort invested and undermines one's own growth as a developer.
