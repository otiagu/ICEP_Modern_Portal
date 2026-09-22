# ICEP Modern Ecosystem: System Architecture & Developer Guide

This document provides a comprehensive outline of the **ICEP Modern** portal ecosystem. It is designed to be ingested by AI assistants or read by developers to instantly understand the project's structure, data flow, styling paradigms, and interaction logic.

## 1. Project Overview & Philosophy

**ICEP Modern** is a responsive, role-based academic management portal built using pure web technologies (Vanilla HTML, CSS, JavaScript) without relying on heavy frameworks (like React or Vue) or build steps (Webpack/Vite). 

### Core Philosophies:
* **Zero Build Pipeline:** Everything runs directly in the browser.
* **Neumorphic / Soft UI:** The design relies heavily on soft shadows (drop and inset) to create elements that look extruded from or pressed into the background.
* **Client-Side Data Mocking:** A central dataset simulates a backend database, allowing immediate local rendering and search capabilities.
* **Role-Based Isolation:** Each user role (Student, Course Rep, Coordinator, etc.) has its own dedicated HTML file, keeping DOM complexity low per page.

### File Structure
```text
C:\ICEPNET\ICEP_Modern\
│
├── ICEP_login_modern.html          # Authentication / Routing Entry Point
├── ICEP_student_profile_modern.html # Student Dashboard (Results, Profile)
├── ICEP_courserep_modern.html       # Course Rep Dashboard (Class lists, Broadsheet)
├── ICEP_coordinator_modern.html     # Coordinator Dashboard (Faculty-wide search & oversight)
│
└── data/
    └── icep_dataset.js              # Centralized JSON-like Database & Helpers
```

---

## 2. Data Architecture (`data/icep_dataset.js`)

To simulate a database, `icep_dataset.js` acts as the **Single Source of Truth**. It must be included via `<script src="data/icep_dataset.js"></script>` before any portal-specific JavaScript.

### Global Data Arrays
* `ICEP_FACULTIES`: Array of strings (e.g., `"Management Sciences"`).
* `ICEP_DEPARTMENTS`: Array of objects mapping departments to faculties.
* `ICEP_COORDINATORS`: Objects representing staff overseeing faculties.
* `ICEP_COURSE_REPS`: Objects representing student representatives per level/dept.
* `ICEP_STUDENTS`: Massive array of student objects.

### Typical Data Schemas

**Student Object:**
```javascript
{
    id: "STU_xxx",
    name: "John Doe",
    matric: "FPO/xxx/xxx",
    level: 400,
    department: "Marketing",
    faculty: "Management Sciences",
    image: "https://... (or relative path)",
    // Additional data specific to the student...
}
```

**Course Rep Object:**
```javascript
{
    id: "REP_xxx",
    name: "Jane Smith",
    matric: "FPO/xxx/xxx",
    level: 400,
    department: "Marketing",
    faculty: "Management Sciences",
    image: "https://...",
    // Represents an entire level for a department
}
```

### Data Helper Functions
The file also exports global utility functions for querying data without writing manual `.filter()` logic repeatedly:
* `filterStudents(query)`
* `getStudentsByDept(dept, level)`
* `getRepByDeptLevel(dept, level)`
* `getCoordinatorByFaculty(faculty)`

---

## 3. UI/UX & CSS Architecture

### Theme Management (Dark/Light Mode)
State is managed via `localStorage.getItem('icep_modern_theme')`.
To prevent **FOUC (Flash of Unstyled Content)**, every HTML file contains an IIFE (Immediately Invoked Function Expression) in the `<head>` that checks `localStorage` and appends a `dark-theme` class to the `<body>` before the DOM renders.

### CSS Variables (Theming)
Themes are toggled by overriding CSS variables scoped to `body.dark-theme`.
```css
:root {
    --bg-color: #e0e5ec;
    --card-bg: #e0e5ec;
    --text-main: #2d3748;
    --accent-color: #d32f2f;
    --shadow-light: #ffffff;
    --shadow-dark: #a3b1c6;
}

body.dark-theme {
    --bg-color: #121212;
    --card-bg: #1e1e1e;
    --text-main: #f0f6fc;
    --text-muted: #b1bac4;
    --shadow-light: #2a2a2a;
    --shadow-dark: #000000;
}
```

### Neumorphic Styling Pattern
Elements use dual `box-shadow` to create depth.
* **Extruded (Raised):** `box-shadow: 8px 8px 16px var(--shadow-dark), -8px -8px 16px var(--shadow-light);`
* **Pressed (Inset):** `box-shadow: inset 5px 5px 10px var(--shadow-dark), inset -5px -5px 10px var(--shadow-light);`

### Responsive Breakpoints
Handled via standard Media Queries in every file:
* `@media (max-width: 900px)`: Tablet adjustments.
* `@media (max-width: 768px)`: Mobile layouts, stacking sidebars, flattening grids.
* `@media (max-width: 480px)`: Small mobile (font scaling, padding reductions).

---

## 4. Interaction Logic & Portal Breakdown

### A. Login Portal (`ICEP_login_modern.html`)
* **Visuals:** Uses a pure CSS `linear-gradient` animation on the left panel (`background-size: 300% 300%; animation: gradientBG 15s ease infinite`). **No video is used.**
* **Routing:** Uses a predefined object mapping roles to pages.
  ```javascript
  const PORTAL_ROUTES = {
      'student': 'ICEP_student_profile_modern.html',
      'courserep': 'ICEP_courserep_modern.html',
      'coordinator': 'ICEP_coordinator_modern.html'
  };
  ```

### B. Student Profile (`ICEP_student_profile_modern.html`)
* **Notification System:** Badges check for newly added elements. When clicked, the count reduces (e.g., 9+ -> 8).
* **Semester Filtering:** A tabbed navigation system in the full result modal (`switchModalSem('1' | '2' | 'all')`).
  * Table rows contain `data-semester="1"` or `"2"`.
  * Non-matching rows receive a `sem-hidden` utility class (`display: none !important`).
* **Dynamic Row Numbering:** The `renumberCourseRows()` function iterates over visible rows (`:not(.sem-hidden)`) and sequentially updates the `#` column to ensure numbers stay ordered regardless of the filter applied.

### C. Course Rep Portal (`ICEP_courserep_modern.html`)
* **Dependent Form Fields:** Selecting a semester (`bSem`) triggers `updateCoursesBySelectedSem()`, which populates the Course Code dropdown based on predefined arrays per semester.
* **Class List Rendering:** Generates profile cards dynamically based on the current Course Rep's department and level mapping to `ICEP_STUDENTS`.

### D. Coordinator Portal (`ICEP_coordinator_modern.html`)
* **Cascading Dropdowns:** Selecting a Faculty updates the Departments dropdown dynamically.
* **Hierarchical Search:** 
  * Features a unified live search bar.
  * Queries filter through `ICEP_STUDENTS` and `ICEP_COURSE_REPS` simultaneously.
  * To prevent browser lag, results are DOM-capped at 50 items (`if (renderCount >= 50)`), with a warning badge displayed if truncation occurs.

---

## 5. Guidelines for AI & Future Edits

When editing this codebase, strictly adhere to the following rules:

1. **Do not use ES6 Modules (`import`/`export`)**: Keep files standalone. Global scope is utilized deliberately via `<script>` tags so HTML files can be opened directly from the file system (`file://` protocol) without triggering CORS errors.
2. **Preserve CSS Variables**: Do not hardcode colors in new CSS rules. Always map `color` or `background` to `var(--text-main)`, `var(--card-bg)`, etc., to ensure Dark Mode doesn't break.
3. **Data Integrity**: Never hardcode student or rep data in the HTML. Always retrieve arrays from `icep_dataset.js` and generate DOM nodes dynamically via JS template literals (`\``).
4. **Mobile-First Tap Targets**: Any clickable element (buttons, dropdowns) must maintain a minimum `min-height` of `44px` for touch accuracy on mobile devices. Ensure iOS input zoom prevention (`font-size: 16px` on inputs).
5. **No External Dependencies**: Do not inject Bootstrap, Tailwind, or jQuery. Stick exclusively to Vanilla JS and custom CSS. Icons rely on FontAwesome (currently pulled from CDN).
