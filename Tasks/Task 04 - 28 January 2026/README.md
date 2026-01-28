# Task 04 – Landing Page with Diagonal Cut Design

## Overview

This task focused on building a **landing page with diagonal cut sections** based on a provided design.  
The goal was to recreate the layout using **plain HTML and CSS**, matching the reference design pixel-perfectly with proper image usage and CSS clip-path techniques.

The page includes a header with diagonal cut, multiple club sections, and a footer with diagonal cut.

---

## Project Setup

This task is part of a larger repository and exists as a subfolder.

### To run this task locally:

1. Open the **main repository** on GitHub
2. Click **Code → Download ZIP**
3. Extract the ZIP file
4. Navigate to:
   Tasks/Task 04 - 28 January 2026/src/
5. Open `index.html` in a browser  
   _(Live Server can also be used)_

Make sure the **Images folder** remains in the correct relative path, as logos and icons are used throughout the layout.

---

## Features Implemented

- Complete landing page layout using HTML and CSS
- Header section with:
  - Person logo with circular white background
  - Main title and subtitle
  - Description paragraphs
  - Diagonal cut at bottom-right corner using CSS `clip-path`
- Five "Best Clubs" sections featuring:
  - Diagonal icon headers
  - Grid layout with 5 club logos per row
  - Club names below each logo
- Footer section with:
  - Announcement text
  - Diagonal cut at bottom-right corner
- Clean, simple class names for natural code appearance
- No responsive breakpoints (fixed-width design)
- External CSS file for better organization

---

## Image Usage

The design uses three main images provided with the task:

- `favicon.png` – Red diagonal triangle (used for section icons and page favicon)
- `1.png` – BVB logo (used for club grid items)
- `logo.png` – Person icon (used in header)

All images are stored in the `Images` directory and are linked using **relative paths** to ensure the design works correctly after download.

---

## Technologies Used

- HTML5
- CSS3

---

## Notes

- CSS `clip-path` polygon was used to create diagonal cuts on header and footer.
- Flexbox was used for grid layout and alignment.
- No external libraries or frameworks were used.
- All comments were removed from code for clean appearance.
- Class names were simplified to look naturally written (e.g., `top`, `container`, `clubs`, `grid`).
- The focus of this task was on pixel-perfect design matching and CSS shape techniques.

---

## Author

**Mubashir Shahzaib**
