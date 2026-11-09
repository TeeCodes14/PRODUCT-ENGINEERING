# NutriTrack - Client-Side Calorie & Macro Tracker

NutriTrack is a modern, standalone calorie and macronutrient tracker web application built entirely using **HTML5, CSS3, and Vanilla JavaScript**. It requires **no backend server**, **no npm dependencies**, and **no Tailwind CSS**. All diary logs, targets, and custom foods are persisted locally in the browser's `localStorage`.

---

## ✨ Key Features

1. **Daily Calorie & Macro Dashboard**
   - **Interactive Calorie Budget**: Displays Target, Food Consumed, Exercise Burned, and Net Remaining calories.
   - **Dynamic SVG Radial Gauge**: Color-coded progress ring (adapts when on track, approaching target, or over budget).
   - **Macronutrient Tracking**: Real-time gram counts and percentage of daily calories for **Protein**, **Carbs**, and **Fat**.
   - **Hydration Tracker**: Water glass visualization with quick-add buttons (+250ml, +500ml, +750ml, -250ml, or custom ml input).
   - **Categorized Meals**: 4 categorized meal cards (**Breakfast**, **Lunch**, **Dinner**, **Snacks**) with live macro subtotals.
   - **Date Navigator**: Jump between days with previous/next buttons, calendar date picker, and relative indicator ("Today", "Yesterday", "Tomorrow").

2. **Food Logging & Search Engine**
   - **Built-in Nutrition Database**: Curated catalog of ~40 common everyday foods (proteins, grains, fruits, vegetables, dairy, healthy fats, snacks).
   - **Instant Autocomplete Search**: Filter foods in real time.
   - **Serving Stepper & Multiplier**: Scale food portions up or down (e.g., 0.5×, 1.5×, 2×) with dynamic preview of scaled calories and macros.
   - **Manual Custom Food Entry**: Log any food item and optionally save it to your permanent Food Library.
   - **Quick Add Calories**: Rapidly log calories on-the-go without entering macronutrient details.
   - **Exercise Logging**: Log calories burned to automatically recalculate net remaining allowance.
   - **Edit & Delete Items**: Edit any logged food entry or delete items directly from the diary.

3. **Trends & Analytics**
   - **Interactive Canvas Chart**: High-DPI bar chart showing daily calorie consumption over 7, 14, or 30 days with a target reference line.
   - **Logging Streak**: Automatically tracks consecutive days of logged meals.
   - **Weekly Averages**: Daily averages for calories, protein, and water intake.
   - **History Archive**: Detailed table of recorded days with a single-click "View" button to jump to any past date.

4. **Scientific TDEE & Goals Calculator**
   - Implements the **Mifflin-St Jeor equation** to calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
   - Metric (kg, cm) and Imperial (lbs, ft/in) unit toggles.
   - Adjusts for biological sex, age, height, weight, activity levels, and fitness goals (weight loss, maintenance, clean bulk).
   - Macro presets: Balanced (40/30/30), High Protein (35/40/25), Low Carb / Keto (15/35/50), Endurance (55/20/25).
   - **"Apply to Tracker" Button**: One-click updates your daily targets across the application.

5. **Food Library Management**
   - Browse standard and custom foods.
   - Filter by: All Foods, Custom Only, High Protein (≥15g), Low Carb (≤5g), Low Calorie (≤100 kcal).
   - Direct "+ Log" button on any library entry.

6. **Data Privacy & Backup Management**
   - **100% Client-Side**: No cloud servers, no trackers, zero network traffic.
   - **JSON Export / Backup**: Download a full backup of all diary records and custom foods.
   - **JSON Import**: Restore your data into any browser.
   - **CSV Export**: Export all logged entries into a spreadsheet-ready `.csv` file.
   - **Demo Data Generator**: Preload the last 7 days with realistic breakfast, lunch, and dinner records with one click to test analytics.
   - **Clear Data**: Safely reset storage with confirmation.

7. **Theming & Accessibility**
   - Built-in **Light & Dark mode** toggle with persistent storage and system preference detection.
   - Pure custom CSS with CSS custom properties (variables) for fast rendering and fluid transitions.
   - Fully responsive design optimized for mobile phones, tablets, and widescreen desktops.

---

## 🚀 How to Run

Because NutriTrack has **zero dependencies**, you can run it immediately in any of the following ways:

### Option 1: Direct File Open
Double click `index.html` or open it directly in Google Chrome, Safari, Firefox, or Microsoft Edge.

### Option 2: Local HTTP Server (Optional)
If you prefer running through a local server:

```bash
# Using Python 3
python3 -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.

---

## 📁 File Structure

```
├── index.html       # Semantic HTML5 layout, modals, SVG radial gauges, tab panes
├── styles.css       # Pure custom CSS, variables, dark/light themes, animations, responsive rules
├── app.js           # Vanilla ES6 JS: State store, TDEE calculator, Canvas chart, UI events
└── README.md        # Documentation and feature guide
```

