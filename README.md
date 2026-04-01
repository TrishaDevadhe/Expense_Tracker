# AI-Assisted Expense Tracker

A fully offline personal expense tracker built with React, Vite, and TailwindCSS. Data is persisted entirely locally using the browser's `localStorage`, requiring no authentication or external APIs.

## Features (Planned)
- Add expenses (amount, category, date, optional note)
- View expenses in a table sorted by most recent first
- Auto-updating total expense summary
- Filter expenses by category
- Responsive, modern user interface

## Setup & Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher is recommended)

### Installation
1. Clone this repository or download the source code.
2. In the terminal, navigate into the project directory:
   ```bash
   cd AI_assisted_expense_tracker
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the App
Start the Vite development server using a single command:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/` (or the URL shown in your terminal).

## Project Structure
- `src/components`: UI components (upcoming)
- `src/App.jsx`: Main application container
- `src/index.css`: Global styles & Tailwind directives
- `vite.config.js`: Vite configuration extended for Tailwind

---
*Built incrementally via AI pairs.*
