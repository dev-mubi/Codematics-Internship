# Task 09 - Library Management System (Full-Stack)

**Date**: 23 February 2026

## Overview
This task focuses on building a professional, full-stack Library Management System. 
The application separates concerns strictly between a Vanilla JavaScript/HTML frontend and a Node.js API backend, without any frontend bundlers or complex UI frameworks.

## Features
- Complete CRUD operations for Books, Members, and Book Issues.
- Stark, monolithic dark/light theme supporting modern UI principles.
- Local Storage persisted state alongside an Express/MongoDB Backend.
- JWT-based authorization locking down API routes and managing frontend redirect paths.

---

## 🛠️ Setup Instructions

### 1. Prerequisites
Ensure you have the following installed on your PC:
- **Node.js**: [Download Here](https://nodejs.org/)
- **MongoDB**: [Download or use MongoDB Atlas](https://www.mongodb.com/)

### 2. Environment Variables (.env)
The backend server relies on an `.env` file to manage ports and database secrets.
Navigate into the `task9/server/` directory and create an `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/library
JWT_SECRET=your_super_secret_jwt_key_here
```
> **Note**: Modify `MONGO_URI` if your MongoDB service runs on a different port or if you are using a cloud-based cluster.

### 3. Install Backend Dependencies
Open your terminal, navigate to the `task9/server/` folder and install the dependencies:
```bash
cd task9/server
npm install
```

### 4. Seed Admin Credentials (Database Initialization)
Before you can log into the frontend, you must seed the database with an initial Admin user.
Run the seeding script from the `task9/server/` folder:
```bash
node seedAdmin.js
```
This will automatically connect to the MongoDB instance and create an admin user:
- **Email**: `admin@library.local`
- **Password**: `admin123`

### 5. Running the Backend Server
Start the Express server in development mode using `nodemon` (or simply `node server.js`):
```bash
npm run dev
```
The server will start, typically on `http://localhost:5000`. Keep this terminal window open.

### 6. Starting the Frontend
The frontend requires no build steps or local servers such as Vite or Webpack.
Simply open `task9/frontend/index.html` (or `task9/frontend/login.html`) in your modern web browser.
- Login with the seeded admin credentials.
- Ensure your backend server is running in the background, otherwise the login attempt will fail.

---

## Technical Stack
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Tailwind CSS (via CDN proxy).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT (JSON Web Tokens), bcryptjs for password hashing.
