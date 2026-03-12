# Task 11 - Cinevia (Premium Cinematic Movie Platform)

**Date**: 10 March 2026  
**Author**: Mubashir Shahzaib

---

## Overview

Cinevia is a high-end cinematic movie exploration platform developed as **Task 11** of the internship programme. This project represents a shift towards **Premium UI/UX design philosophies**, focusing on sophisticated layout, negative space, and immersive media experiences. It is a full-stack integrated application that bridges the gap between a high-performance frontend and a robust cloud-based authentication and data persistence layer.

The application leverages the **TMDB (The Movie Database) API** to provide users with a deep catalog of real-time movie metadata, ranging from trending hits to all-time classics. Beyond mere discovery, Cinevia offers a personalized experience where users can manage their own watchlists, synced securely across devices via **Supabase**. The platform features a unique "Theater Mode" for mobile devices and a highly refined split-screen authentication flow, setting a new standard for internal project quality.

---

## Application Features

### 1. Immersive Media Experience
- **Cinematic Hero**: A dynamic, full-viewport hero section featuring trending movies with smooth gradient overlays and animated content.
- **Theater Mode (Mobile)**: A purpose-built "Theater Mode" for mobile trailers that fills the full width of the screen, removing UI clutter for a distraction-free viewing experience.
- **YouTube Disclaimer**: A strategically placed disclaimer below the player, ensuring compliance with YouTube's Terms of Service while maintaining a clean aesthetic.

### 2. Gallery & Catalog
- **Advanced Filtering**: A multi-faceted browsing system where users can filter by genre and sort by popularity, rating, or release date.
- **Infinite Discovery**: Seamless infinite scrolling that dynamically fetches more movie tiles as the user explores the catalog.
- **Real-time Search**: A debounced search bar that updates the gallery instantly as the user types.

### 3. Personalization & Identity
- **Cloud-Synced Watchlist**: A private collection of movies stored in Supabase with real-time CRUD (Create, Read, Update, Delete) capabilities.
- **Profile Security**: A streamlined profile page with clear identity management and a professional security statement regarding platform infrastructure.
- **Dual-Theme System**: A sophisticated Dark/Light mode implementation that persists across sessions and ensures consistent readability in all lighting conditions.

### 4. Authentication Flow (Split-Screen)
- **Cinematic Authentication**: A redesigned split-screen layout for Login, Signup, and OTP verification, featuring a rich "Brand Intro" section on one side and a clean, centered form on the other.
- **Email OTP & Google OAuth**: Support for both traditional email-based OTP verification and seamless Google Sign-In via Supabase.
- **Theme Consistency**: The authentication flow adapts perfectly to the user's theme preference, including localized styling for third-party icons.

---

## Project Structure

```
Task 11 - 10 March 2026/
|
|-- public/               # Favicons, Apple Touch Icons, and Web Manifest
|-- src/
|   |-- components/
|   |   |-- layout/       # Navbar, Footer, ProtectedRoute
|   |   |-- movie/        # MovieCard, MovieRow, RatingsBar
|   |   |-- ui/           # Reusable primitives (Button, Modal, Skeleton)
|   |-- hooks/            # Custom hooks for logic reuse
|   |-- lib/              # API clients (TMDB, QueryClient)
|   |-- pages/            # Core views (Home, Catalog, MovieDetail, Auth, Legal)
|   |-- services/         # Supabase and Data fetching logic
|   |-- store/            # Redux Toolkit (Auth, Theme)
|   |-- App.jsx           # Main routing and navigation
|   |-- index.css         # Global design system tokens
```

---

## Setup Instructions

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js**: Version 18.x or higher recommended.
- **npm**: Version 8.x or higher.

### 2. Environment Configuration
Create a `.env` file in the project root with the following keys:
```env
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Local Installation & Execution
```bash
# Navigate to the task folder
cd "Task 11 - 10 March 2026"

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm start
```
The app will run locally at `http://localhost:3000`.

---

## Technical Stack

| Category         | Technology                           |
| ---------------- | ------------------------------------ |
| **Framework**    | React.js 18                          |
| **Styling**      | Tailwind CSS (v3)                    |
| **Motion**       | Framer Motion                        |
| **State**        | Redux Toolkit                        |
| **Data Fetching**| TanStack Query (React Query)         |
| **Backend/Auth** | Supabase (PostgreSQL + Auth + RLS)   |
| **External API** | TMDB (The Movie Database)            |
| **Video Playback**| React Player (YouTube Integration)   |

---

## Ownership and Intellectual Property

This project was conceived, designed, and implemented by **Mubashir Shahzaib** as part of the Codematics internship. All architectural decisions, component design, and UI/UX refinements are personal work. While open for professional review, reproduction or repurposing of this codebase without permission is strictly prohibited.
