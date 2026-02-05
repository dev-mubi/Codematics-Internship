# Task 06 – Portfolio Website

## Overview

This task focused on building a **modern portfolio website** based on a provided design reference. The goal was to replicate the layout using **HTML, Tailwind CSS (via CDN), and JavaScript**, ensuring pixel-perfect accuracy with a functional dark mode toggle and responsive design.

The page includes a sticky navigation bar, hero section, about section, skills grid, work experience timeline, project showcase, testimonials, contact information, and a footer.

---

## Project Setup

This task is part of a larger repository and exists as a subfolder.

### To run this task locally:

1. Open the **main repository** on GitHub
2. Click **Code → Download ZIP**
3. Extract the ZIP file
4. Navigate to:
   `Tasks/Task 06 - 4 February 2026/src/`
5. Open `index.html` in a browser  
   _(Live Server can also be used)_

Make sure the **images folder** remains in the correct relative path (`../images/`), as profile photos, technology icons, and UI elements are used throughout the layout.

---

## Features Implemented

- Complete portfolio website layout using HTML, Tailwind CSS (CDN), and JavaScript
- Sticky navigation bar with:
  - Logo and navigation links
  - Dark mode toggle button with smooth transitions
  - Mobile hamburger menu for smaller screens
  - Download CV button
- Hero section featuring:
  - Professional introduction and profile image
  - Social media links (GitHub, Twitter, Figma)
  - Location indicator and availability status
- About section with:
  - Professional biography
  - Side-by-side layout with image
  - Quick facts list in a responsive grid
- Skills section displaying:
  - Grid of technology icons (JavaScript, TypeScript, React, Next.js, Node.js, etc.)
  - Hover effects with scale animations
- Work Experience section with:
  - Timeline-style cards showing job history
  - Responsive layout that adapts to screen sizes
- Projects section featuring:
  - Three project showcase cards
  - Consistent image-left, text-right layout
  - Technology stack badges for each project
- Testimonials section with:
  - Three testimonial cards in a responsive grid
  - Client quotes and attribution
- Contact section including:
  - Email and phone information
  - Social media links
- Footer with copyright information
- **Dark Mode functionality**:
  - Persistent theme storage using `localStorage`
  - System preference detection on first load
  - Smooth color transitions between themes
  - Separate toggles for desktop and mobile views

---

## Technologies Used

- HTML5
- Tailwind CSS (via CDN)
- JavaScript (Vanilla)
- Google Fonts (Inter font family)

---

## Notes

- Tailwind CSS was loaded via CDN with a custom configuration for dark mode (`darkMode: 'class'`).
- The JavaScript implements theme toggling, local storage persistence, and mobile menu functionality.
- The dark mode uses Tailwind's `dark:` variant extensively for seamless theme switching.
- Flexbox and CSS Grid were used for responsive layouts.
- All images are linked using **relative paths** (`../images/`) to ensure the design works correctly after download.
- No external CSS frameworks or libraries were used beyond Tailwind CDN.
- The focus of this task was on pixel-perfect design matching, responsive behavior, and implementing a functional dark mode.

---

## Author

**Mubashir Shahzaib**
