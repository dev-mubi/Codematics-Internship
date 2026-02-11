# Task 07 – Utility Tools Web Application

## Overview

This task was focused on building a **single-page web application** that combines seven utility tools in one interface.  
The goal was to create a professional, minimal, and functional application that allows users to select and use different utility functions through a clean menu-based navigation system.

The application implements practical tools for everyday conversions and calculations, all accessible from a single page without reloading.

---

## Project Setup

This task is part of a larger repository and exists as a subfolder.

### To run this task locally:

1. Open the **main repository** on GitHub
2. Click **Code → Download ZIP**
3. Extract the ZIP file
4. Navigate to:
   Tasks/Task 07 - 9 February 2026/src/
5. Open `index.html` in a browser  
   _(Live Server can also be used)_

---

## Features Implemented

### Task 1: Age to Days Converter

- Convert birth date to number of days lived
- Uses HTML5 date input with calendar widget
- Calculates precise day count from past date to today

### Task 2: Hours to Seconds Converter

- Convert hours (including decimals) to seconds
- Simple multiplication-based calculation
- Supports floating-point inputs

### Task 3: Find Next Number (Two Scenarios)

- **Scenario 1**: Find next number in an array
  - Parse comma-separated values as array
  - Sort and find next number greater than target
- **Scenario 2**: Single value increment
  - Add 1 to input number
  - Supports both integers and decimals

### Task 4: Capitalize First Letter

- Convert lowercase name to capitalized format
- First letter uppercase, remaining letters preserved
- Simple string manipulation

### Task 5: BMI Calculator

- Calculate Body Mass Index from weight and height
- Provides BMI category classification (Underweight, Normal, Overweight, Obese)
- Formula: weight (kg) / height (m)²

### Task 6: Random Array Elements

- Generate random array of specified size
- Extract first and last elements
- Display all array values for reference

### Task 7: Real-Time Addition

- Two input fields with live calculation
- Sum updates automatically as user types
- Shows NaN until both inputs are provided
- Demonstrates event handling concept

---

## Technical Implementation

- **HTML Structure**: Semantic markup with proper form elements
- **CSS**: Minimal, professional styling in external stylesheet
- **JavaScript**: Simple, clean logic for each utility
  - No complex algorithms or unnecessary code
  - Clear function names and straightforward implementations
  - Event listeners for real-time calculations
- **Navigation**: Menu-based task selection without page reloads
- **Responsive Design**: Works on desktop and mobile devices

---

## File Structure

```
src/
├── index.html       (Main HTML file with structure)
├── styles.css       (External stylesheet)
└── script.js        (JavaScript functionality)
```

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- No external libraries or frameworks

---

## Key Concepts Demonstrated

- DOM manipulation and selection
- Event handling (oninput, onclick)
- Form inputs and validation
- Data type conversion and parsing
- String manipulation
- Mathematical calculations
- Responsive web design
- Separation of concerns (HTML, CSS, JS)

---
