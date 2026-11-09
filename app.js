/**
 * NutriTrack - Pure Client-Side Calorie & Macronutrient Tracker
 * Vanilla JavaScript (ES6+), LocalStorage persistence, zero backend, zero external dependencies.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. STORAGE KEYS & CONSTANTS
  // =========================================================================
  const STORAGE_KEYS = {
    LOGS: 'nutritrack_logs_v1',
    TARGETS: 'nutritrack_targets_v1',
    CUSTOM_FOODS: 'nutritrack_custom_foods_v1',
    THEME: 'nutritrack_theme_v1',
    USER_PROFILE: 'nutritrack_profile_v1'
  };

  const DEFAULT_TARGETS = {
    calories: 2000,
    protein: 140, // grams (560 kcal = 28%)
    carbs: 220,   // grams (880 kcal = 44%)
    fat: 62,      // grams (558 kcal = 28%)
    water: 2500   // ml
  };

  // Preloaded database of everyday healthy foods
  const DEFAULT_FOOD_DATABASE = [
    // Proteins
    { id: 'f_chk_brst', name: 'Chicken Breast (cooked)', serving: '100g', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: 'protein' },
    { id: 'f_salmon', name: 'Atlantic Salmon (grilled)', serving: '100g', calories: 206, protein: 22, carbs: 0, fat: 12.3, category: 'protein' },
    { id: 'f_egg', name: 'Whole Egg (boiled/poached)', serving: '1 large (50g)', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, category: 'protein' },
    { id: 'f_egg_white', name: 'Egg White', serving: '1 large (33g)', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, category: 'protein' },
    { id: 'f_tuna', name: 'Canned Tuna in Water', serving: '1 can drained (120g)', calories: 130, protein: 29, carbs: 0, fat: 1, category: 'protein' },
    { id: 'f_beef_ground', name: 'Lean Ground Beef 90/10', serving: '100g cooked', calories: 217, protein: 26, carbs: 0, fat: 12, category: 'protein' },
    { id: 'f_tofu', name: 'Firm Tofu', serving: '100g', calories: 83, protein: 10, carbs: 1.9, fat: 5.3, category: 'protein' },
    { id: 'f_whey', name: 'Whey Protein Powder', serving: '1 scoop (30g)', calories: 120, protein: 24, carbs: 3, fat: 1.5, category: 'protein' },
    { id: 'f_turkey_brst', name: 'Turkey Breast Slice', serving: '100g', calories: 135, protein: 30, carbs: 0, fat: 1.5, category: 'protein' },

    // Carbohydrates & Grains
    { id: 'f_oats', name: 'Rolled Oats (dry)', serving: '50g (1/2 cup)', calories: 187, protein: 6.5, carbs: 32, fat: 3.5, category: 'grain' },
    { id: 'f_white_rice', name: 'White Rice (cooked)', serving: '1 cup (158g)', calories: 205, protein: 4.2, carbs: 45, fat: 0.4, category: 'grain' },
    { id: 'f_brown_rice', name: 'Brown Rice (cooked)', serving: '1 cup (195g)', calories: 216, protein: 5, carbs: 45, fat: 1.8, category: 'grain' },
    { id: 'f_sweet_potato', name: 'Sweet Potato (baked)', serving: '1 medium (130g)', calories: 112, protein: 2, carbs: 26, fat: 0.1, category: 'grain' },
    { id: 'f_potato', name: 'Russet Potato (baked)', serving: '1 medium (170g)', calories: 160, protein: 4.3, carbs: 37, fat: 0.2, category: 'grain' },
    { id: 'f_pasta', name: 'Whole Wheat Pasta (cooked)', serving: '140g', calories: 174, protein: 7.5, carbs: 37, fat: 0.8, category: 'grain' },
    { id: 'f_bread_ww', name: 'Whole Wheat Bread', serving: '1 slice (40g)', calories: 92, protein: 4, carbs: 17, fat: 1.2, category: 'grain' },
    { id: 'f_quinoa', name: 'Quinoa (cooked)', serving: '1 cup (185g)', calories: 222, protein: 8.1, carbs: 39, fat: 3.6, category: 'grain' },
    { id: 'f_black_beans', name: 'Black Beans (cooked)', serving: '100g', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5, category: 'grain' },

    // Fruits & Vegetables
    { id: 'f_banana', name: 'Banana', serving: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3, category: 'fruit' },
    { id: 'f_apple', name: 'Apple with Skin', serving: '1 medium (182g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, category: 'fruit' },
    { id: 'f_blueberries', name: 'Fresh Blueberries', serving: '1 cup (148g)', calories: 84, protein: 1.1, carbs: 21, fat: 0.5, category: 'fruit' },
    { id: 'f_strawberries', name: 'Fresh Strawberries', serving: '1 cup (152g)', calories: 49, protein: 1, carbs: 11.7, fat: 0.5, category: 'fruit' },
    { id: 'f_broccoli', name: 'Broccoli (steamed)', serving: '100g', calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4, category: 'veggie' },
    { id: 'f_spinach', name: 'Baby Spinach (raw)', serving: '100g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, category: 'veggie' },
    { id: 'f_avocado', name: 'Avocado', serving: '1/2 medium (100g)', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, category: 'fruit' },

    // Dairy & Healthy Fats
    { id: 'f_greek_yogurt', name: 'Greek Yogurt 0% Plain', serving: '170g (3/4 cup)', calories: 100, protein: 17, carbs: 6, fat: 0.7, category: 'dairy' },
    { id: 'f_cottage_cheese', name: 'Cottage Cheese 2%', serving: '1/2 cup (113g)', calories: 92, protein: 12, carbs: 5, fat: 2.6, category: 'dairy' },
    { id: 'f_whole_milk', name: 'Whole Milk', serving: '1 cup (244ml)', calories: 149, protein: 7.7, carbs: 11.7, fat: 7.9, category: 'dairy' },
    { id: 'f_almond_milk', name: 'Almond Milk (unsweetened)', serving: '1 cup (240ml)', calories: 30, protein: 1, carbs: 1, fat: 2.5, category: 'dairy' },
    { id: 'f_cheddar', name: 'Cheddar Cheese', serving: '1 slice / 28g', calories: 115, protein: 7, carbs: 0.5, fat: 9.4, category: 'dairy' },
    { id: 'f_peanut_butter', name: 'Peanut Butter', serving: '2 tbsp (32g)', calories: 188, protein: 8, carbs: 7, fat: 16, category: 'fat' },
    { id: 'f_almonds', name: 'Raw Almonds', serving: '1 oz / 28g (23 nuts)', calories: 164, protein: 6, carbs: 6.1, fat: 14.2, category: 'fat' },
    { id: 'f_olive_oil', name: 'Extra Virgin Olive Oil', serving: '1 tbsp (14g)', calories: 119, protein: 0, carbs: 0, fat: 13.5, category: 'fat' },

    // Everyday Meals / Snacks
    { id: 'f_dark_chocolate', name: 'Dark Chocolate 70%', serving: '30g', calories: 170, protein: 2.2, carbs: 13, fat: 12.5, category: 'snack' },
    { id: 'f_granola_bar', name: 'Oat & Honey Granola Bar', serving: '1 bar (42g)', calories: 190, protein: 3, carbs: 29, fat: 7, category: 'snack' },
    { id: 'f_mixed_salad', name: 'Garden Salad with Light Dressing', serving: '1 bowl (200g)', calories: 110, protein: 3, carbs: 12, fat: 5, category: 'meal' },
    { id: 'f_coffee_latte', name: 'Café Latte (whole milk)', serving: '1 cup (240ml)', calories: 120, protein: 6, carbs: 10, fat: 6, category: 'beverage' }
  ];

  // =========================================================================
  // 2. STATE MANAGER & PERSISTENCE
  // =========================================================================
  class Store {
    constructor() {
      this.selectedDate = this.getTodayDateString();
      this.targets = this.loadTargets();
      this.logs = this.loadLogs();
      this.customFoods = this.loadCustomFoods();
    }

    getTodayDateString() {
      const today = new Date();
      return this.formatDate(today);
    }

    formatDate(dateObj) {
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    loadTargets() {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.TARGETS);
        return stored ? Object.assign({}, DEFAULT_TARGETS, JSON.parse(stored)) : { ...DEFAULT_TARGETS };
      } catch (err) {
        console.error('Failed to load targets from storage:', err);
        return { ...DEFAULT_TARGETS };
      }
    }

    saveTargets(targets) {
      this.targets = { ...targets };
      localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(this.targets));
    }

    loadLogs() {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
        return stored ? JSON.parse(stored) : {};
      } catch (err) {
        console.error('Failed to load meal logs:', err);
        return {};
      }
    }

    saveLogs() {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs));
    }

    loadCustomFoods() {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_FOODS);
        return stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.error('Failed to load custom foods:', err);
        return [];
      }
    }

    saveCustomFoods() {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_FOODS, JSON.stringify(this.customFoods));
    }

    getDayLog(dateStr = this.selectedDate) {
      if (!this.logs[dateStr]) {
        this.logs[dateStr] = {
          meals: [],
          water: 0,
          exerciseBurned: 0
        };
      }
      return this.logs[dateStr];
    }

    addFoodItem(dateStr, item) {
      const day = this.getDayLog(dateStr);
      const newItem = {
        id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name: item.name,
        serving: item.serving || '1 serving',
        calories: Math.round(Number(item.calories) || 0),
        protein: Math.round((Number(item.protein) || 0) * 10) / 10,
        carbs: Math.round((Number(item.carbs) || 0) * 10) / 10,
        fat: Math.round((Number(item.fat) || 0) * 10) / 10,
        mealCategory: item.mealCategory || 'lunch',
        timestamp: new Date().toISOString()
      };
      day.meals.push(newItem);
      this.saveLogs();
      return newItem;
    }

    updateFoodItem(dateStr, itemId, updatedFields) {
      const day = this.getDayLog(dateStr);
      const index = day.meals.findIndex(m => m.id === itemId);
      if (index !== -1) {
        day.meals[index] = {
          ...day.meals[index],
          ...updatedFields,
          calories: Math.round(Number(updatedFields.calories) || 0),
          protein: Math.round((Number(updatedFields.protein) || 0) * 10) / 10,
          carbs: Math.round((Number(updatedFields.carbs) || 0) * 10) / 10,
          fat: Math.round((Number(updatedFields.fat) || 0) * 10) / 10
        };
        this.saveLogs();
        return day.meals[index];
      }
      return null;
    }

    deleteFoodItem(dateStr, itemId) {
      const day = this.getDayLog(dateStr);
      day.meals = day.meals.filter(m => m.id !== itemId);
      this.saveLogs();
    }

    setWater(dateStr, amount) {
      const day = this.getDayLog(dateStr);
      day.water = Math.max(0, Math.round(amount));
      this.saveLogs();
    }

    adjustWater(dateStr, delta) {
      const day = this.getDayLog(dateStr);
      day.water = Math.max(0, Math.round((day.water || 0) + delta));
      this.saveLogs();
      return day.water;
    }

    setExerciseBurn(dateStr, cal) {
      const day = this.getDayLog(dateStr);
      day.exerciseBurned = Math.max(0, Math.round(Number(cal) || 0));
      this.saveLogs();
    }

    addCustomFood(food) {
      const newFood = {
        id: 'cf_' + Date.now(),
        name: food.name,
        serving: food.serving || '1 serving',
        calories: Math.round(Number(food.calories) || 0),
        protein: Math.round((Number(food.protein) || 0) * 10) / 10,
        carbs: Math.round((Number(food.carbs) || 0) * 10) / 10,
        fat: Math.round((Number(food.fat) || 0) * 10) / 10,
        isCustom: true
      };
      this.customFoods.push(newFood);
      this.saveCustomFoods();
      return newFood;
    }

    deleteCustomFood(id) {
      this.customFoods = this.customFoods.filter(f => f.id !== id);
      this.saveCustomFoods();
    }

    getAllFoods() {
      return [...this.customFoods, ...DEFAULT_FOOD_DATABASE];
    }

    calculateDayTotals(dateStr = this.selectedDate) {
      const day = this.getDayLog(dateStr);
      let consumed = 0;
      let protein = 0;
      let carbs = 0;
      let fat = 0;

      const categoryTotals = {
        breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
        lunch: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
        dinner: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 },
        snacks: { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 }
      };

      (day.meals || []).forEach(item => {
        const cal = Number(item.calories) || 0;
        const p = Number(item.protein) || 0;
        const c = Number(item.carbs) || 0;
        const f = Number(item.fat) || 0;

        consumed += cal;
        protein += p;
        carbs += c;
        fat += f;

        const cat = categoryTotals[item.mealCategory] ? item.mealCategory : 'snacks';
        categoryTotals[cat].calories += cal;
        categoryTotals[cat].protein += p;
        categoryTotals[cat].carbs += c;
        categoryTotals[cat].fat += f;
        categoryTotals[cat].count += 1;
      });

      const burned = Number(day.exerciseBurned) || 0;
      const net = consumed - burned;
      const target = Number(this.targets.calories) || 2000;
      const remaining = target - net;

      return {
        target,
        consumed,
        burned,
        net,
        remaining,
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
        water: day.water || 0,
        waterTarget: this.targets.water || 2500,
        categoryTotals,
        itemCount: (day.meals || []).length
      };
    }
  }

  // =========================================================================
  // 3. SCIENTIFIC TDEE & BMR CALCULATOR
  // =========================================================================
  class CalorieScience {
    /**
     * Mifflin-St Jeor Equation:
     * Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
     * Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
     */
    static calculateBmr({ gender, weightKg, heightCm, age }) {
      const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
      return Math.round(gender === 'male' ? base + 5 : base - 161);
    }

    static calculateTdee({ bmr, activityMultiplier }) {
      return Math.round(bmr * activityMultiplier);
    }

    static calculatePlan({ gender, weightKg, heightCm, age, activityMultiplier, goalOffset, macroPreset }) {
      const bmr = this.calculateBmr({ gender, weightKg, heightCm, age });
      const tdee = this.calculateTdee({ bmr, activityMultiplier });
      const targetCalories = Math.max(1200, Math.round(tdee + Number(goalOffset)));

      // Split ratios: [carbsPct, proteinPct, fatPct]
      let ratios = [0.40, 0.30, 0.30];
      if (macroPreset === 'highProtein') ratios = [0.35, 0.40, 0.25];
      else if (macroPreset === 'lowCarb') ratios = [0.15, 0.35, 0.50];
      else if (macroPreset === 'endurance') ratios = [0.55, 0.20, 0.25];

      const [carbsPct, proteinPct, fatPct] = ratios;
      const proteinCalories = targetCalories * proteinPct;
      const carbsCalories = targetCalories * carbsPct;
      const fatCalories = targetCalories * fatPct;

      const proteinGrams = Math.round(proteinCalories / 4);
      const carbsGrams = Math.round(carbsCalories / 4);
      const fatGrams = Math.round(fatCalories / 9);

      return {
        bmr,
        tdee,
        targetCalories,
        proteinGrams,
        carbsGrams,
        fatGrams,
        proteinCalories: Math.round(proteinCalories),
        carbsCalories: Math.round(carbsCalories),
        fatCalories: Math.round(fatCalories),
        ratios: {
          carbs: Math.round(carbsPct * 100),
          protein: Math.round(proteinPct * 100),
          fat: Math.round(fatPct * 100)
        }
      };
    }
  }

  // =========================================================================
  // 4. CANVAS CHART ENGINE (Crisp, High-DPI, Zero external dependencies)
  // =========================================================================
  class ChartRenderer {
    static render(canvas, dataPoints, targetCalories, isDark) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;

      // Ensure proper canvas resolution
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = (rect.height || 280) * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height || 280;
      ctx.clearRect(0, 0, width, height);

      if (!dataPoints || dataPoints.length === 0) {
        ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No history data available yet', width / 2, height / 2);
        return;
      }

      const padding = { top: 30, right: 25, bottom: 40, left: 55 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      // Find max calorie value for scale
      const maxVal = Math.max(
        targetCalories * 1.25,
        ...dataPoints.map(d => d.consumed),
        1000
      );

      // Grid colors
      const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
      const textColor = isDark ? '#94a3b8' : '#64748b';

      // Draw horizontal grid lines & labels
      const steps = 4;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      for (let i = 0; i <= steps; i++) {
        const val = Math.round((maxVal / steps) * i);
        const y = padding.top + chartHeight - (val / maxVal) * chartHeight;

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.fillText(val.toLocaleString(), padding.left - 10, y);
      }

      // Draw Target Reference Line (Dashed)
      if (targetCalories && targetCalories <= maxVal) {
        const targetY = padding.top + chartHeight - (targetCalories / maxVal) * chartHeight;
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding.left, targetY);
        ctx.lineTo(width - padding.right, targetY);
        ctx.stroke();

        ctx.fillStyle = '#6366f1';
        ctx.textAlign = 'left';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`TARGET: ${targetCalories} kcal`, padding.left + 8, targetY - 7);
        ctx.restore();
      }

      // Draw Bars
      const n = dataPoints.length;
      const colWidth = chartWidth / n;
      const barWidth = Math.min(36, Math.max(14, colWidth * 0.55));

      dataPoints.forEach((point, idx) => {
        const xCenter = padding.left + idx * colWidth + colWidth / 2;
        const x = xCenter - barWidth / 2;
        const barHeight = Math.max(3, (point.consumed / maxVal) * chartHeight);
        const y = padding.top + chartHeight - barHeight;

        // Choose bar color
        const isOver = point.consumed > targetCalories * 1.05;
        const isOptimal = point.consumed >= targetCalories * 0.9 && !isOver;
        let barColor = isOptimal ? '#10b981' : isOver ? '#f59e0b' : '#3b82f6';
        if (point.consumed > targetCalories * 1.25) barColor = '#ef4444';

        // Draw rounded bar
        ctx.fillStyle = barColor;
        this.roundRect(ctx, x, y, barWidth, barHeight, Math.min(6, barWidth / 2));
        ctx.fill();

        // Draw Calorie value on top of bar if enough space
        if (barWidth >= 22 && point.consumed > 0) {
          ctx.save();
          ctx.fillStyle = isDark ? '#f8fafc' : '#1e293b';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(point.consumed, xCenter, y - 6);
          ctx.restore();
        }

        // Draw X-axis day label
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.font = '11px sans-serif';
        ctx.fillText(point.label, xCenter, height - padding.bottom + 18);
      });
    }

    static roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
  }

  // =========================================================================
  // 5. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  const Toast = {
    show(message, type = 'success') {
      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
      toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

      container.appendChild(toast);

      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 3000);
    }
  };

  // =========================================================================
  // 6. MAIN APPLICATION CONTROLLER
  // =========================================================================
  class NutriTrackApp {
    constructor() {
      this.store = new Store();
      this.selectedModalFood = null;
      this.activeChartRange = 7;

      this.initTheme();
      this.bindElements();
      this.bindEvents();
      this.syncDateDisplay();
      this.renderAll();
    }

    // Initialize or load theme
    initTheme() {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      this.setTheme(savedTheme);
    }

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      const icon = document.getElementById('themeIcon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
      // Re-render chart with appropriate colors
      this.renderTrendsTab();
    }

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      this.setTheme(current === 'dark' ? 'light' : 'dark');
    }

    // Cache DOM nodes
    bindElements() {
      // Date controls
      this.dateInput = document.getElementById('currentDateInput');
      this.prevDayBtn = document.getElementById('prevDayBtn');
      this.nextDayBtn = document.getElementById('nextDayBtn');
      this.todayBtn = document.getElementById('todayBtn');
      this.relativeDateBadge = document.getElementById('relativeDateBadge');

      // Tabs & Navigation
      this.navTabs = document.querySelectorAll('.nav-tab');
      this.tabPanes = document.querySelectorAll('.tab-pane');
      this.dateNavSection = document.getElementById('dateNavSection');
      this.themeToggleBtn = document.getElementById('themeToggleBtn');

      // Calorie Display
      this.calRemainingDisplay = document.getElementById('calRemainingDisplay');
      this.calTargetDisplay = document.getElementById('calTargetDisplay');
      this.calConsumedDisplay = document.getElementById('calConsumedDisplay');
      this.calBurnedDisplay = document.getElementById('calBurnedDisplay');
      this.calNetDisplay = document.getElementById('calNetDisplay');
      this.calorieProgressBar = document.getElementById('calorieProgressBar');
      this.caloriePercentLabel = document.getElementById('caloriePercentLabel');
      this.calorieBudgetNotice = document.getElementById('calorieBudgetNotice');
      this.calorieStatusBadge = document.getElementById('calorieStatusBadge');
      this.gaugeProgress = document.getElementById('gaugeProgress');

      // Macros Display
      this.proteinConsumed = document.getElementById('proteinConsumed');
      this.proteinTarget = document.getElementById('proteinTarget');
      this.proteinProgressBar = document.getElementById('proteinProgressBar');
      this.proteinRemainingLabel = document.getElementById('proteinRemainingLabel');
      this.proteinKcalPct = document.getElementById('proteinKcalPct');

      this.carbsConsumed = document.getElementById('carbsConsumed');
      this.carbsTarget = document.getElementById('carbsTarget');
      this.carbsProgressBar = document.getElementById('carbsProgressBar');
      this.carbsRemainingLabel = document.getElementById('carbsRemainingLabel');
      this.carbsKcalPct = document.getElementById('carbsKcalPct');

      this.fatConsumed = document.getElementById('fatConsumed');
      this.fatTarget = document.getElementById('fatTarget');
      this.fatProgressBar = document.getElementById('fatProgressBar');
      this.fatRemainingLabel = document.getElementById('fatRemainingLabel');
      this.fatKcalPct = document.getElementById('fatKcalPct');

      this.distProteinVal = document.getElementById('distProteinVal');
      this.distCarbsVal = document.getElementById('distCarbsVal');
      this.distFatVal = document.getElementById('distFatVal');

      // Water Display
      this.waterFillLevel = document.getElementById('waterFillLevel');
      this.waterConsumedDisplay = document.getElementById('waterConsumedDisplay');
      this.waterTargetDisplay = document.getElementById('waterTargetDisplay');
      this.waterPercentDisplay = document.getElementById('waterPercentDisplay');
      this.waterTargetBadge = document.getElementById('waterTargetBadge');

      // Meals
      this.breakfastList = document.getElementById('breakfastList');
      this.lunchList = document.getElementById('lunchList');
      this.dinnerList = document.getElementById('dinnerList');
      this.snacksList = document.getElementById('snacksList');
      this.totalItemsCountLabel = document.getElementById('totalItemsCountLabel');

      // Modals
      this.addFoodModal = document.getElementById('addFoodModal');
      this.quickCalModal = document.getElementById('quickCalModal');
      this.exerciseModal = document.getElementById('exerciseModal');
      this.editItemModal = document.getElementById('editItemModal');

      // Canvas Chart
      this.caloriesChart = document.getElementById('caloriesChart');
    }

    // Attach Event Listeners
    bindEvents() {
      // Theme toggle
      this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

      // Date navigation
      this.dateInput.value = this.store.selectedDate;
      this.dateInput.addEventListener('change', (e) => {
        this.store.selectedDate = e.target.value;
        this.syncDateDisplay();
        this.renderAll();
      });

      this.prevDayBtn.addEventListener('click', () => this.shiftDay(-1));
      this.nextDayBtn.addEventListener('click', () => this.shiftDay(1));
      this.todayBtn.addEventListener('click', () => {
        this.store.selectedDate = this.store.getTodayDateString();
        this.dateInput.value = this.store.selectedDate;
        this.syncDateDisplay();
        this.renderAll();
      });

      // Navigation tabs switching
      this.navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabName = tab.getAttribute('data-tab');
          this.switchTab(tabName);
        });
      });

      // Modals open triggers
      document.getElementById('primaryAddFoodBtn').addEventListener('click', () => {
        this.openAddFoodModal('lunch');
      });

      document.querySelectorAll('.add-meal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const category = btn.getAttribute('data-category');
          this.openAddFoodModal(category);
        });
      });

      document.getElementById('quickAddCalBtn').addEventListener('click', () => {
        this.openModal('quickCalModal');
      });

      document.getElementById('editExerciseBtn').addEventListener('click', () => {
        const day = this.store.getDayLog();
        document.getElementById('exerciseCalInput').value = day.exerciseBurned || '';
        this.openModal('exerciseModal');
      });

      document.getElementById('customizeMacrosBtn').addEventListener('click', () => {
        this.switchTab('settings');
      });

      // Close modal buttons
      document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
          const modalId = btn.getAttribute('data-close-modal');
          this.closeModal(modalId);
        });
      });

      // Close on backdrop click
      [this.addFoodModal, this.quickCalModal, this.exerciseModal, this.editItemModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeModal(modal.id);
          }
        });
      });

      // Close modals on Escape key
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          ['addFoodModal', 'quickCalModal', 'exerciseModal', 'editItemModal'].forEach(id => this.closeModal(id));
        }
      });

      // Water actions
      document.querySelectorAll('.btn-water').forEach(btn => {
        btn.addEventListener('click', () => {
          const amount = Number(btn.getAttribute('data-amount'));
          this.store.adjustWater(this.store.selectedDate, amount);
          this.renderDashboard();
          Toast.show(`Added ${amount} ml of water 💧`);
        });
      });

      document.querySelector('.btn-water-sub').addEventListener('click', () => {
        this.store.adjustWater(this.store.selectedDate, -250);
        this.renderDashboard();
      });

      document.getElementById('addCustomWaterBtn').addEventListener('click', () => {
        const input = document.getElementById('customWaterInput');
        const val = Number(input.value);
        if (val > 0) {
          this.store.adjustWater(this.store.selectedDate, val);
          input.value = '';
          this.renderDashboard();
          Toast.show(`Added ${val} ml of water 💧`);
        }
      });

      document.getElementById('resetWaterBtn').addEventListener('click', () => {
        this.store.setWater(this.store.selectedDate, 0);
        this.renderDashboard();
        Toast.show('Water reset for today');
      });

      // Setup Add Food Modal Tabs & Search
      this.bindAddFoodModalEvents();

      // Quick Add Calorie Form
      document.getElementById('quickCalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const cal = Number(document.getElementById('quickCalInput').value);
        const cat = document.getElementById('quickCalMealSelect').value;
        const desc = document.getElementById('quickCalDesc').value.trim() || 'Quick Add';

        this.store.addFoodItem(this.store.selectedDate, {
          name: desc,
          serving: '1 entry',
          calories: cal,
          protein: 0,
          carbs: 0,
          fat: 0,
          mealCategory: cat
        });

        this.closeModal('quickCalModal');
        document.getElementById('quickCalForm').reset();
        this.renderAll();
        Toast.show(`Logged ${cal} kcal to ${cat}`);
      });

      // Exercise Form
      document.getElementById('exerciseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const cal = Number(document.getElementById('exerciseCalInput').value);
        this.store.setExerciseBurn(this.store.selectedDate, cal);
        this.closeModal('exerciseModal');
        this.renderAll();
        Toast.show(`Logged ${cal} kcal exercise burn 🔥`);
      });

      document.querySelectorAll('.ex-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const cal = Number(pill.getAttribute('data-cal'));
          document.getElementById('exerciseCalInput').value = cal;
        });
      });

      // Edit Item Form
      this.bindEditItemModalEvents();

      // TDEE & Goals Calculator Form
      this.bindCalculatorEvents();

      // Food Library Toolbar & Filters
      this.bindFoodLibraryEvents();

      // Settings & Backup
      this.bindSettingsEvents();

      // Chart Range Filters
      document.querySelectorAll('.range-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeChartRange = Number(btn.getAttribute('data-days')) || 7;
          this.renderTrendsTab();
        });
      });

      // Responsive chart re-render on resize
      window.addEventListener('resize', () => {
        if (document.getElementById('tab-analytics').classList.contains('active')) {
          this.renderTrendsTab();
        }
      });
    }

    shiftDay(deltaDays) {
      const [y, m, d] = this.store.selectedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + deltaDays);
      this.store.selectedDate = this.store.formatDate(date);
      this.dateInput.value = this.store.selectedDate;
      this.syncDateDisplay();
      this.renderAll();
    }

    syncDateDisplay() {
      const todayStr = this.store.getTodayDateString();
      const current = this.store.selectedDate;

      if (current === todayStr) {
        this.relativeDateBadge.textContent = 'Today';
      } else {
        const [y, m, d] = current.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        const dayDiff = Math.round((date - new Date()) / (1000 * 60 * 60 * 24));
        if (dayDiff === -1) {
          this.relativeDateBadge.textContent = 'Yesterday';
        } else if (dayDiff === 1) {
          this.relativeDateBadge.textContent = 'Tomorrow';
        } else {
          this.relativeDateBadge.textContent = date.toLocaleDateString('en-US', { weekday: 'short' });
        }
      }
    }

    switchTab(tabName) {
      this.navTabs.forEach(tab => {
        const isSelected = tab.getAttribute('data-tab') === tabName;
        tab.classList.toggle('active', isSelected);
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });

      this.tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === `tab-${tabName}`);
      });

      // Toggle date navigator bar visibility (only needed on Dashboard)
      if (tabName === 'dashboard') {
        this.dateNavSection.classList.remove('hidden');
        this.renderDashboard();
      } else {
        this.dateNavSection.classList.add('hidden');
        if (tabName === 'analytics') this.renderTrendsTab();
        if (tabName === 'foods') this.renderFoodLibraryTab();
        if (tabName === 'settings') this.renderSettingsTab();
        if (tabName === 'calculator') this.updateCalculatorResults();
      }
    }

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('hidden');
    }

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('hidden');
    }

    // =======================================================================
    // 7. RENDER DASHBOARD
    // =======================================================================
    renderDashboard() {
      const stats = this.store.calculateDayTotals(this.store.selectedDate);

      // Calorie metrics
      this.calTargetDisplay.innerHTML = `${stats.target.toLocaleString()} <small>kcal</small>`;
      this.calConsumedDisplay.innerHTML = `${stats.consumed.toLocaleString()} <small>kcal</small>`;
      this.calBurnedDisplay.innerHTML = `${stats.burned.toLocaleString()} <small>kcal</small>`;
      this.calNetDisplay.innerHTML = `${stats.net.toLocaleString()} <small>kcal</small>`;

      // Remaining badge & status
      this.calRemainingDisplay.textContent = Math.abs(stats.remaining).toLocaleString();
      const remainingLabel = document.querySelector('.remaining-label');
      
      if (stats.remaining < 0) {
        remainingLabel.textContent = 'Over Budget';
        remainingLabel.style.color = 'var(--danger)';
        this.calorieStatusBadge.textContent = 'Over Goal';
        this.calorieStatusBadge.className = 'badge badge-danger';
        this.calorieBudgetNotice.textContent = `${Math.abs(stats.remaining).toLocaleString()} kcal over budget`;
      } else {
        remainingLabel.textContent = 'Remaining';
        remainingLabel.style.color = 'var(--text-muted)';
        this.calorieStatusBadge.textContent = 'On Track';
        this.calorieStatusBadge.className = 'badge badge-success';
        this.calorieBudgetNotice.textContent = `${stats.remaining.toLocaleString()} kcal left`;
      }

      // Circular Radial Gauge
      // Radius = 70, circumference = 2 * pi * 70 ≈ 439.82
      const circumference = 440;
      const progressRatio = Math.min(1.5, stats.consumed / (stats.target || 1));
      const offset = circumference - Math.min(circumference, progressRatio * circumference);
      this.gaugeProgress.style.strokeDashoffset = offset;

      if (stats.consumed > stats.target * 1.1) {
        this.gaugeProgress.style.stroke = 'var(--danger)';
      } else if (stats.consumed >= stats.target * 0.9) {
        this.gaugeProgress.style.stroke = 'var(--success)';
      } else {
        this.gaugeProgress.style.stroke = 'var(--cal-color)';
      }

      // Linear Calorie Progress bar
      const calPct = Math.round((stats.consumed / (stats.target || 1)) * 100);
      this.calorieProgressBar.style.width = `${Math.min(100, calPct)}%`;
      this.caloriePercentLabel.textContent = `${calPct}% of daily goal`;

      // Macronutrients
      this.renderMacroGroup('protein', stats.protein, this.store.targets.protein, 4, stats.consumed);
      this.renderMacroGroup('carbs', stats.carbs, this.store.targets.carbs, 4, stats.consumed);
      this.renderMacroGroup('fat', stats.fat, this.store.targets.fat, 9, stats.consumed);

      // Macro distribution % of calories consumed
      const totalMacroCalories = (stats.protein * 4) + (stats.carbs * 4) + (stats.fat * 9);
      if (totalMacroCalories > 0) {
        this.distProteinVal.textContent = Math.round(((stats.protein * 4) / totalMacroCalories) * 100) + '%';
        this.distCarbsVal.textContent = Math.round(((stats.carbs * 4) / totalMacroCalories) * 100) + '%';
        this.distFatVal.textContent = Math.round(((stats.fat * 9) / totalMacroCalories) * 100) + '%';
      } else {
        this.distProteinVal.textContent = '0%';
        this.distCarbsVal.textContent = '0%';
        this.distFatVal.textContent = '0%';
      }

      // Hydration
      const waterConsumed = stats.water;
      const waterTarget = stats.waterTarget;
      const waterPct = Math.round((waterConsumed / (waterTarget || 1)) * 100);

      this.waterConsumedDisplay.textContent = waterConsumed.toLocaleString();
      this.waterTargetDisplay.textContent = waterTarget.toLocaleString();
      this.waterPercentDisplay.textContent = `${waterPct}% of goal`;
      this.waterFillLevel.style.height = `${Math.min(100, waterPct)}%`;
      this.waterTargetBadge.textContent = `Goal: ${waterTarget.toLocaleString()} ml`;

      // Meals Cards
      this.renderMealsCards();
      this.totalItemsCountLabel.textContent = `${stats.itemCount} item${stats.itemCount === 1 ? '' : 's'} logged`;
    }

    renderMacroGroup(macroKey, consumed, target, calPerGram, totalDayConsumed) {
      const consumedEl = this[macroKey + 'Consumed'];
      const targetEl = this[macroKey + 'Target'];
      const barEl = this[macroKey + 'ProgressBar'];
      const leftLabel = this[macroKey + 'RemainingLabel'];
      const pctLabel = this[macroKey + 'KcalPct'];

      consumedEl.textContent = consumed;
      targetEl.textContent = target;

      const pct = Math.min(100, Math.round((consumed / (target || 1)) * 100));
      barEl.style.width = `${pct}%`;

      const diff = Math.round((target - consumed) * 10) / 10;
      if (diff >= 0) {
        leftLabel.textContent = `${diff}g left`;
      } else {
        leftLabel.textContent = `${Math.abs(diff)}g over`;
        leftLabel.style.color = 'var(--danger)';
      }

      // Contribution to calories
      const macroCal = consumed * calPerGram;
      const pctOfCalories = totalDayConsumed > 0 ? Math.round((macroCal / totalDayConsumed) * 100) : 0;
      pctLabel.textContent = `${pctOfCalories}% kcal`;
    }

    renderMealsCards() {
      const day = this.store.getDayLog(this.store.selectedDate);
      const meals = day.meals || [];

      const categories = ['breakfast', 'lunch', 'dinner', 'snacks'];
      categories.forEach(cat => {
        const catMeals = meals.filter(m => m.mealCategory === cat);
        const listEl = this[`${cat}List`];
        const summaryEl = document.getElementById(`${cat}MacrosSummary`);

        // Compute summary for header
        let c = 0, p = 0, cb = 0, f = 0;
        catMeals.forEach(m => {
          c += Number(m.calories) || 0;
          p += Number(m.protein) || 0;
          cb += Number(m.carbs) || 0;
          f += Number(m.fat) || 0;
        });

        summaryEl.textContent = `${c} kcal • ${Math.round(p)}g P • ${Math.round(cb)}g C • ${Math.round(f)}g F`;

        // Render item rows
        if (catMeals.length === 0) {
          listEl.innerHTML = `<div class="empty-meal-state">No foods logged for ${cat} yet</div>`;
        } else {
          listEl.innerHTML = catMeals.map(item => `
            <div class="meal-item-row" data-id="${item.id}">
              <div class="item-main">
                <div class="item-header">
                  <span class="item-name" title="${item.name}">${this.escapeHtml(item.name)}</span>
                  <span class="item-portion">${this.escapeHtml(item.serving || '')}</span>
                </div>
                <div class="item-macros-tags">
                  <span class="item-cal-tag">${item.calories} kcal</span>
                  <span class="item-macro-tag">&bull; ${item.protein}g P</span>
                  <span class="item-macro-tag">&bull; ${item.carbs}g C</span>
                  <span class="item-macro-tag">&bull; ${item.fat}g F</span>
                </div>
              </div>
              <div class="item-actions">
                <button class="item-btn-icon edit-meal-item-btn" title="Edit Item" data-id="${item.id}">✏️</button>
                <button class="item-btn-icon delete-btn delete-meal-item-btn" title="Delete Item" data-id="${item.id}">&times;</button>
              </div>
            </div>
          `).join('');
        }
      });

      // Bind edit and delete handlers for newly rendered items
      this.bindMealItemActions();
    }

    bindMealItemActions() {
      document.querySelectorAll('.edit-meal-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          this.openEditItemModal(id);
        });
      });

      document.querySelectorAll('.delete-meal-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          this.store.deleteFoodItem(this.store.selectedDate, id);
          this.renderAll();
          Toast.show('Item removed from diary');
        });
      });
    }

    // =======================================================================
    // 8. ADD FOOD MODAL LOGIC (Search & Multiplier)
    // =======================================================================
    bindAddFoodModalEvents() {
      const searchTabBtn = document.getElementById('modalTabDatabase');
      const customTabBtn = document.getElementById('modalTabCustom');
      const searchPane = document.getElementById('modalSearchPane');
      const customPane = document.getElementById('customFoodForm');
      const searchInput = document.getElementById('modalFoodSearchInput');
      const resultsContainer = document.getElementById('modalSearchResults');

      searchTabBtn.addEventListener('click', () => {
        searchTabBtn.classList.add('active');
        customTabBtn.classList.remove('active');
        searchPane.classList.add('active');
        customPane.classList.remove('active');
        searchInput.focus();
      });

      customTabBtn.addEventListener('click', () => {
        customTabBtn.classList.add('active');
        searchTabBtn.classList.remove('active');
        customPane.classList.add('active');
        searchPane.classList.remove('active');
      });

      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        this.renderSearchResults(query);
      });

      // Stepper for serving multiplier
      const stepDownBtn = document.getElementById('stepDownServing');
      const stepUpBtn = document.getElementById('stepUpServing');
      const multiplierInput = document.getElementById('servingMultiplier');

      stepDownBtn.addEventListener('click', () => {
        const current = parseFloat(multiplierInput.value) || 1;
        multiplierInput.value = Math.max(0.25, Math.round((current - 0.25) * 100) / 100);
        this.updateSelectedFoodPreview();
      });

      stepUpBtn.addEventListener('click', () => {
        const current = parseFloat(multiplierInput.value) || 1;
        multiplierInput.value = Math.min(20, Math.round((current + 0.25) * 100) / 100);
        this.updateSelectedFoodPreview();
      });

      multiplierInput.addEventListener('input', () => {
        this.updateSelectedFoodPreview();
      });

      document.getElementById('clearSelectedFoodBtn').addEventListener('click', () => {
        this.selectedModalFood = null;
        document.getElementById('selectedFoodConfig').classList.add('hidden');
        document.getElementById('logSelectedFoodBtn').disabled = true;
      });

      document.getElementById('logSelectedFoodBtn').addEventListener('click', () => {
        if (!this.selectedModalFood) return;
        const multiplier = parseFloat(multiplierInput.value) || 1;
        const cat = document.getElementById('modalMealCategorySelect').value;

        const scaledPortion = multiplier === 1 
          ? this.selectedModalFood.serving 
          : `${multiplier} × (${this.selectedModalFood.serving})`;

        this.store.addFoodItem(this.store.selectedDate, {
          name: this.selectedModalFood.name,
          serving: scaledPortion,
          calories: Math.round(this.selectedModalFood.calories * multiplier),
          protein: Math.round(this.selectedModalFood.protein * multiplier * 10) / 10,
          carbs: Math.round(this.selectedModalFood.carbs * multiplier * 10) / 10,
          fat: Math.round(this.selectedModalFood.fat * multiplier * 10) / 10,
          mealCategory: cat
        });

        this.closeModal('addFoodModal');
        this.renderAll();
        Toast.show(`Logged ${this.selectedModalFood.name}`);
      });

      // Custom Food Form submission
      customPane.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('customFoodName').value.trim();
        const serving = document.getElementById('customFoodServing').value.trim() || '1 serving';
        const cal = Number(document.getElementById('customFoodCalories').value);
        const p = Number(document.getElementById('customFoodProtein').value) || 0;
        const c = Number(document.getElementById('customFoodCarbs').value) || 0;
        const f = Number(document.getElementById('customFoodFat').value) || 0;
        const cat = document.getElementById('customMealCategorySelect').value;
        const saveToLib = document.getElementById('saveToLibraryCheckbox').checked;

        if (saveToLib) {
          this.store.addCustomFood({ name, serving, calories: cal, protein: p, carbs: c, fat: f });
        }

        this.store.addFoodItem(this.store.selectedDate, {
          name,
          serving,
          calories: cal,
          protein: p,
          carbs: c,
          fat: f,
          mealCategory: cat
        });

        this.closeModal('addFoodModal');
        customPane.reset();
        this.renderAll();
        Toast.show(`Logged "${name}" (${cal} kcal)`);
      });
    }

    openAddFoodModal(defaultCategory = 'lunch') {
      document.getElementById('modalMealCategorySelect').value = defaultCategory;
      document.getElementById('customMealCategorySelect').value = defaultCategory;
      this.selectedModalFood = null;
      document.getElementById('selectedFoodConfig').classList.add('hidden');
      document.getElementById('logSelectedFoodBtn').disabled = true;
      document.getElementById('modalFoodSearchInput').value = '';
      this.renderSearchResults('');
      this.openModal('addFoodModal');
      setTimeout(() => document.getElementById('modalFoodSearchInput').focus(), 100);
    }

    renderSearchResults(query) {
      const container = document.getElementById('modalSearchResults');
      const allFoods = this.store.getAllFoods();
      const filtered = allFoods.filter(f => f.name.toLowerCase().includes(query)).slice(0, 25);

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">
            No foods found matching "${this.escapeHtml(query)}"<br>
            <button type="button" class="btn btn-xs btn-outline" style="margin-top:0.6rem;" onclick="document.getElementById('modalTabCustom').click(); document.getElementById('customFoodName').value='${this.escapeHtml(query)}';">
              + Create custom food
            </button>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(food => `
        <div class="search-result-row" data-id="${food.id}">
          <div>
            <span class="result-name">${this.escapeHtml(food.name)}</span>
            <span class="result-details">${this.escapeHtml(food.serving)} &bull; ${food.protein}g P &bull; ${food.carbs}g C &bull; ${food.fat}g F</span>
          </div>
          <span class="result-cal">${food.calories} kcal</span>
        </div>
      `).join('');

      container.querySelectorAll('.search-result-row').forEach(row => {
        row.addEventListener('click', () => {
          const id = row.getAttribute('data-id');
          const found = allFoods.find(f => f.id === id);
          if (found) this.selectFoodInModal(found);
        });
      });
    }

    selectFoodInModal(food) {
      this.selectedModalFood = food;
      document.querySelectorAll('.search-result-row').forEach(r => {
        r.classList.toggle('selected', r.getAttribute('data-id') === food.id);
      });

      document.getElementById('selectedFoodName').textContent = food.name;
      document.getElementById('selectedFoodBaseServing').textContent = `1 serving = ${food.serving}`;
      document.getElementById('servingMultiplier').value = '1.0';
      document.getElementById('selectedFoodConfig').classList.remove('hidden');
      document.getElementById('logSelectedFoodBtn').disabled = false;
      this.updateSelectedFoodPreview();
    }

    updateSelectedFoodPreview() {
      if (!this.selectedModalFood) return;
      const multiplier = parseFloat(document.getElementById('servingMultiplier').value) || 1;
      document.getElementById('previewCalories').textContent = Math.round(this.selectedModalFood.calories * multiplier);
      document.getElementById('previewProtein').textContent = (Math.round(this.selectedModalFood.protein * multiplier * 10) / 10) + 'g';
      document.getElementById('previewCarbs').textContent = (Math.round(this.selectedModalFood.carbs * multiplier * 10) / 10) + 'g';
      document.getElementById('previewFat').textContent = (Math.round(this.selectedModalFood.fat * multiplier * 10) / 10) + 'g';
    }

    // =======================================================================
    // 9. EDIT LOGGED FOOD ITEM MODAL
    // =======================================================================
    bindEditItemModalEvents() {
      const form = document.getElementById('editItemForm');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editItemId').value;
        const date = document.getElementById('editItemDate').value;

        this.store.updateFoodItem(date, id, {
          name: document.getElementById('editItemName').value.trim(),
          serving: document.getElementById('editItemServing').value.trim(),
          calories: Number(document.getElementById('editItemCalories').value),
          protein: Number(document.getElementById('editItemProtein').value),
          carbs: Number(document.getElementById('editItemCarbs').value),
          fat: Number(document.getElementById('editItemFat').value),
          mealCategory: document.getElementById('editItemCategory').value
        });

        this.closeModal('editItemModal');
        this.renderAll();
        Toast.show('Item updated successfully');
      });

      document.getElementById('deleteItemFromEditModalBtn').addEventListener('click', () => {
        const id = document.getElementById('editItemId').value;
        const date = document.getElementById('editItemDate').value;
        this.store.deleteFoodItem(date, id);
        this.closeModal('editItemModal');
        this.renderAll();
        Toast.show('Item deleted');
      });
    }

    openEditItemModal(itemId) {
      const day = this.store.getDayLog(this.store.selectedDate);
      const item = (day.meals || []).find(m => m.id === itemId);
      if (!item) return;

      document.getElementById('editItemId').value = item.id;
      document.getElementById('editItemDate').value = this.store.selectedDate;
      document.getElementById('editItemName').value = item.name;
      document.getElementById('editItemServing').value = item.serving || '';
      document.getElementById('editItemCalories').value = item.calories;
      document.getElementById('editItemProtein').value = item.protein;
      document.getElementById('editItemCarbs').value = item.carbs;
      document.getElementById('editItemFat').value = item.fat;
      document.getElementById('editItemCategory').value = item.mealCategory || 'lunch';

      this.openModal('editItemModal');
    }

    // =======================================================================
    // 10. TRENDS & ANALYTICS VIEW
    // =======================================================================
    renderTrendsTab() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const rangeDays = this.activeChartRange || 7;
      const today = new Date();

      const dataPoints = [];
      let totalCalories = 0;
      let totalProtein = 0;
      let totalWater = 0;
      let loggedDaysCount = 0;

      for (let i = rangeDays - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = this.store.formatDate(d);
        const dayTotals = this.store.calculateDayTotals(dateStr);

        dataPoints.push({
          dateStr,
          label: d.toLocaleDateString('en-US', { weekday: rangeDays > 14 ? 'narrow' : 'short' }),
          consumed: dayTotals.consumed,
          protein: dayTotals.protein,
          water: dayTotals.water
        });

        if (dayTotals.consumed > 0) {
          totalCalories += dayTotals.consumed;
          totalProtein += dayTotals.protein;
          totalWater += dayTotals.water;
          loggedDaysCount++;
        }
      }

      // Render Canvas Chart
      ChartRenderer.render(this.caloriesChart, dataPoints, this.store.targets.calories, isDark);

      // Render Summary Cards
      const avgCalories = loggedDaysCount > 0 ? Math.round(totalCalories / loggedDaysCount) : 0;
      const avgProtein = loggedDaysCount > 0 ? Math.round(totalProtein / loggedDaysCount) : 0;
      const avgWater = loggedDaysCount > 0 ? Math.round(totalWater / loggedDaysCount) : 0;

      document.getElementById('avgCaloriesValue').textContent = `${avgCalories.toLocaleString()} kcal`;
      document.getElementById('avgProteinValue').textContent = `${avgProtein} g`;
      document.getElementById('avgWaterValue').textContent = `${avgWater.toLocaleString()} ml`;

      const target = this.store.targets.calories;
      const diff = avgCalories - target;
      document.getElementById('avgCaloriesComparison').textContent = 
        loggedDaysCount > 0 
          ? (diff >= 0 ? `+${diff} kcal vs target` : `${diff} kcal vs target`) 
          : 'no logs yet';

      // Streak calculation
      const streak = this.calculateStreak();
      document.getElementById('streakValue').textContent = `${streak} Day${streak === 1 ? '' : 's'}`;
      document.getElementById('streakSubtext').textContent = streak > 0 ? 'Consistent logging 🔥' : 'Log today to start';

      // History Table
      this.renderHistoryTable();
    }

    calculateStreak() {
      let streak = 0;
      const d = new Date();
      // Check today or yesterday
      let dateStr = this.store.formatDate(d);
      let dayLog = this.store.logs[dateStr];

      // If today has no meals yet, check if yesterday was logged to preserve streak
      if (!dayLog || !dayLog.meals || dayLog.meals.length === 0) {
        d.setDate(d.getDate() - 1);
        dateStr = this.store.formatDate(d);
        dayLog = this.store.logs[dateStr];
        if (!dayLog || !dayLog.meals || dayLog.meals.length === 0) {
          return 0;
        }
      }

      // Count consecutive days backward
      while (true) {
        dateStr = this.store.formatDate(d);
        dayLog = this.store.logs[dateStr];
        if (dayLog && dayLog.meals && dayLog.meals.length > 0) {
          streak++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    }

    renderHistoryTable() {
      const tbody = document.getElementById('historyTableBody');
      const dates = Object.keys(this.store.logs).sort().reverse();
      const validDates = dates.filter(date => {
        const day = this.store.logs[date];
        return day && (day.meals?.length > 0 || day.water > 0 || day.exerciseBurned > 0);
      });

      document.getElementById('historyDaysCountBadge').textContent = `${validDates.length} recorded day${validDates.length === 1 ? '' : 's'}`;

      if (validDates.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center empty-cell">No recorded history yet</td></tr>`;
        return;
      }

      tbody.innerHTML = validDates.slice(0, 14).map(dateStr => {
        const totals = this.store.calculateDayTotals(dateStr);
        const [y, m, d] = dateStr.split('-').map(Number);
        const formatted = new Date(y, m - 1, d).toLocaleDateString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric'
        });

        return `
          <tr>
            <td><strong>${formatted}</strong></td>
            <td><span class="item-cal-tag">${totals.consumed} kcal</span></td>
            <td>${totals.burned} kcal</td>
            <td><strong>${totals.net} kcal</strong></td>
            <td>${totals.protein} g</td>
            <td>${totals.carbs} g</td>
            <td>${totals.fat} g</td>
            <td>${totals.water} ml</td>
            <td>
              <button class="btn btn-xs btn-outline jump-to-date-btn" data-date="${dateStr}">View</button>
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('.jump-to-date-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetDate = btn.getAttribute('data-date');
          this.store.selectedDate = targetDate;
          this.dateInput.value = targetDate;
          this.switchTab('dashboard');
          this.syncDateDisplay();
          this.renderAll();
        });
      });
    }

    // =======================================================================
    // 11. TDEE & GOALS CALCULATOR
    // =======================================================================
    bindCalculatorEvents() {
      const form = document.getElementById('tdeeForm');
      const metricBtn = document.getElementById('unitMetricBtn');
      const imperialBtn = document.getElementById('unitImperialBtn');

      let currentUnit = 'metric';

      metricBtn.addEventListener('click', () => {
        currentUnit = 'metric';
        metricBtn.classList.add('active');
        imperialBtn.classList.remove('active');
        document.getElementById('weightMetricGroup').classList.remove('hidden');
        document.getElementById('weightImperialGroup').classList.add('hidden');
        document.getElementById('heightMetricGroup').classList.remove('hidden');
        document.getElementById('heightImperialGroup').classList.add('hidden');
      });

      imperialBtn.addEventListener('click', () => {
        currentUnit = 'imperial';
        imperialBtn.classList.add('active');
        metricBtn.classList.remove('active');
        document.getElementById('weightMetricGroup').classList.add('hidden');
        document.getElementById('weightImperialGroup').classList.remove('hidden');
        document.getElementById('heightMetricGroup').classList.add('hidden');
        document.getElementById('heightImperialGroup').classList.remove('hidden');
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.updateCalculatorResults(currentUnit);
      });

      // Auto update when inputs change
      form.addEventListener('input', () => {
        this.updateCalculatorResults(currentUnit);
      });

      document.getElementById('applyTargetsBtn').addEventListener('click', () => {
        const plan = this.computeCurrentFormPlan(currentUnit);
        if (!plan) return;

        this.store.saveTargets({
          calories: plan.targetCalories,
          protein: plan.proteinGrams,
          carbs: plan.carbsGrams,
          fat: plan.fatGrams,
          water: this.store.targets.water || 2500
        });

        this.renderAll();
        Toast.show(`✨ Targets updated: ${plan.targetCalories} kcal goal set!`);
        this.switchTab('dashboard');
      });
    }

    computeCurrentFormPlan(unit = 'metric') {
      const gender = document.querySelector('input[name="calcGender"]:checked').value;
      const age = Number(document.getElementById('calcAge').value) || 28;

      let weightKg = 75;
      let heightCm = 175;

      if (unit === 'metric') {
        weightKg = Number(document.getElementById('calcWeightKg').value) || 75;
        heightCm = Number(document.getElementById('calcHeightCm').value) || 175;
      } else {
        const lbs = Number(document.getElementById('calcWeightLbs').value) || 165;
        weightKg = lbs * 0.453592;
        const ft = Number(document.getElementById('calcHeightFt').value) || 5;
        const inches = Number(document.getElementById('calcHeightIn').value) || 9;
        heightCm = (ft * 12 + inches) * 2.54;
      }

      const activityMultiplier = Number(document.getElementById('calcActivity').value) || 1.375;
      const goalOffset = Number(document.getElementById('calcGoal').value) || 0;
      const macroPreset = document.getElementById('calcMacroPreset').value || 'balanced';

      return CalorieScience.calculatePlan({
        gender, weightKg, heightCm, age, activityMultiplier, goalOffset, macroPreset
      });
    }

    updateCalculatorResults(unit = 'metric') {
      const plan = this.computeCurrentFormPlan(unit);
      if (!plan) return;

      document.getElementById('calcTargetResult').innerHTML = `${plan.targetCalories.toLocaleString()} <small>kcal/day</small>`;
      document.getElementById('calcBmrResult').textContent = `${plan.bmr.toLocaleString()} kcal`;
      document.getElementById('calcTdeeResult').textContent = `${plan.tdee.toLocaleString()} kcal`;

      const goalSelect = document.getElementById('calcGoal');
      document.getElementById('calcGoalNote').textContent = goalSelect.options[goalSelect.selectedIndex].text;

      document.getElementById('calcProteinGrams').textContent = `${plan.proteinGrams} g`;
      document.getElementById('calcProteinCal').textContent = `${plan.proteinCalories} kcal (${plan.ratios.protein}%)`;

      document.getElementById('calcCarbsGrams').textContent = `${plan.carbsGrams} g`;
      document.getElementById('calcCarbsCal').textContent = `${plan.carbsCalories} kcal (${plan.ratios.carbs}%)`;

      document.getElementById('calcFatGrams').textContent = `${plan.fatGrams} g`;
      document.getElementById('calcFatCal').textContent = `${plan.fatCalories} kcal (${plan.ratios.fat}%)`;
    }

    // =======================================================================
    // 12. FOOD LIBRARY TAB
    // =======================================================================
    bindFoodLibraryEvents() {
      const searchInput = document.getElementById('librarySearchInput');
      const filterChips = document.querySelectorAll('.filter-chip');

      searchInput.addEventListener('input', () => {
        this.renderFoodLibraryTab();
      });

      filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
          filterChips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.renderFoodLibraryTab();
        });
      });

      document.getElementById('openNewFoodModalBtn').addEventListener('click', () => {
        this.openAddFoodModal('lunch');
        document.getElementById('modalTabCustom').click();
      });
    }

    renderFoodLibraryTab() {
      const tbody = document.getElementById('foodLibraryTableBody');
      const search = (document.getElementById('librarySearchInput').value || '').toLowerCase().trim();
      const activeFilterChip = document.querySelector('.filter-chip.active');
      const filter = activeFilterChip ? activeFilterChip.getAttribute('data-filter') : 'all';

      let foods = this.store.getAllFoods();

      // Search filter
      if (search) {
        foods = foods.filter(f => f.name.toLowerCase().includes(search));
      }

      // Category / macro filter
      if (filter === 'custom') {
        foods = foods.filter(f => f.isCustom);
      } else if (filter === 'high-protein') {
        foods = foods.filter(f => f.protein >= 15);
      } else if (filter === 'low-carb') {
        foods = foods.filter(f => f.carbs <= 5);
      } else if (filter === 'low-calorie') {
        foods = foods.filter(f => f.calories <= 100);
      }

      if (foods.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center empty-cell">No food items matching criteria</td></tr>`;
        return;
      }

      tbody.innerHTML = foods.map(food => `
        <tr>
          <td><strong>${this.escapeHtml(food.name)}</strong></td>
          <td>${this.escapeHtml(food.serving)}</td>
          <td><span class="item-cal-tag">${food.calories} kcal</span></td>
          <td>${food.protein} g</td>
          <td>${food.carbs} g</td>
          <td>${food.fat} g</td>
          <td>
            <span class="badge ${food.isCustom ? 'badge-warning' : ''}">${food.isCustom ? 'Custom' : (food.category || 'Standard')}</span>
          </td>
          <td>
            <button class="btn btn-xs btn-primary library-log-btn" data-id="${food.id}">+ Log</button>
            ${food.isCustom ? `<button class="btn btn-xs btn-ghost library-delete-btn" data-id="${food.id}" title="Delete Custom Food">🗑️</button>` : ''}
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.library-log-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const food = this.store.getAllFoods().find(f => f.id === id);
          if (food) {
            this.openAddFoodModal('lunch');
            this.selectFoodInModal(food);
          }
        });
      });

      tbody.querySelectorAll('.library-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          this.store.deleteCustomFood(id);
          this.renderFoodLibraryTab();
          Toast.show('Custom food deleted');
        });
      });
    }

    // =======================================================================
    // 13. SETTINGS & DATA MANAGEMENT
    // =======================================================================
    bindSettingsEvents() {
      // Populate target values
      this.populateSettingsForm();

      document.getElementById('settingsTargetsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const cal = Number(document.getElementById('settingsTargetCalories').value);
        const p = Number(document.getElementById('settingsTargetProtein').value);
        const c = Number(document.getElementById('settingsTargetCarbs').value);
        const f = Number(document.getElementById('settingsTargetFat').value);
        const w = Number(document.getElementById('settingsTargetWater').value);

        this.store.saveTargets({
          calories: cal,
          protein: p,
          carbs: c,
          fat: f,
          water: w
        });

        this.renderAll();
        Toast.show('Daily targets updated successfully!');
      });

      // Export JSON
      document.getElementById('exportJsonBtn').addEventListener('click', () => {
        this.exportJsonBackup();
      });

      // Export CSV
      document.getElementById('exportCsvBtn').addEventListener('click', () => {
        this.exportCsvReport();
      });

      // Import JSON
      const importInput = document.getElementById('importJsonInput');
      importInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          this.importJsonBackup(file);
          importInput.value = '';
        }
      });

      // Load Sample Demo Data
      document.getElementById('loadSampleDataBtn').addEventListener('click', () => {
        if (confirm('Load sample demo data? This will add realistic breakfast, lunch, and dinner records to the last 7 days.')) {
          this.populateSampleDemoData();
        }
      });

      // Clear All Data
      document.getElementById('clearAllDataBtn').addEventListener('click', () => {
        if (confirm('Are you SURE you want to clear all your tracker data? This action cannot be undone.')) {
          localStorage.removeItem(STORAGE_KEYS.LOGS);
          localStorage.removeItem(STORAGE_KEYS.CUSTOM_FOODS);
          localStorage.removeItem(STORAGE_KEYS.TARGETS);
          this.store = new Store();
          this.renderAll();
          this.populateSettingsForm();
          Toast.show('All stored data cleared', 'warning');
        }
      });
    }

    populateSettingsForm() {
      document.getElementById('settingsTargetCalories').value = this.store.targets.calories;
      document.getElementById('settingsTargetProtein').value = this.store.targets.protein;
      document.getElementById('settingsTargetCarbs').value = this.store.targets.carbs;
      document.getElementById('settingsTargetFat').value = this.store.targets.fat;
      document.getElementById('settingsTargetWater').value = this.store.targets.water;
    }

    renderSettingsTab() {
      this.populateSettingsForm();

      // Compute local storage usage
      let totalBytes = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalBytes += (localStorage[key].length + key.length) * 2;
        }
      }
      const kb = (totalBytes / 1024).toFixed(1);
      document.getElementById('storageUsagePill').textContent = `Storage Used: ${kb} KB`;

      let totalMeals = 0;
      Object.values(this.store.logs).forEach(day => {
        if (day && day.meals) totalMeals += day.meals.length;
      });

      document.getElementById('totalMealsPill').textContent = `Total Meal Entries: ${totalMeals}`;
      document.getElementById('customFoodsPill').textContent = `Custom Foods: ${this.store.customFoods.length}`;
    }

    exportJsonBackup() {
      const backupData = {
        app: 'NutriTrack',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        targets: this.store.targets,
        logs: this.store.logs,
        customFoods: this.store.customFoods
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutritrack_backup_${this.store.getTodayDateString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Toast.show('Backup JSON downloaded! 📥');
    }

    exportCsvReport() {
      const rows = [
        ['Date', 'Meal Category', 'Food Name', 'Serving Size', 'Calories (kcal)', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Logged At']
      ];

      const dates = Object.keys(this.store.logs).sort();
      dates.forEach(date => {
        const day = this.store.logs[date];
        if (day && day.meals) {
          day.meals.forEach(m => {
            rows.push([
              date,
              m.mealCategory || '',
              `"${(m.name || '').replace(/"/g, '""')}"`,
              `"${(m.serving || '').replace(/"/g, '""')}"`,
              m.calories || 0,
              m.protein || 0,
              m.carbs || 0,
              m.fat || 0,
              m.timestamp || ''
            ]);
          });
        }
      });

      if (rows.length === 1) {
        Toast.show('No food entries to export to CSV yet', 'warning');
        return;
      }

      const csvContent = rows.map(r => r.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutritrack_diary_${this.store.getTodayDateString()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      Toast.show('Diary CSV exported! 📊');
    }

    importJsonBackup(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && (parsed.logs || parsed.targets)) {
            if (parsed.targets) this.store.saveTargets(parsed.targets);
            if (parsed.logs) {
              this.store.logs = parsed.logs;
              this.store.saveLogs();
            }
            if (parsed.customFoods) {
              this.store.customFoods = parsed.customFoods;
              this.store.saveCustomFoods();
            }

            this.renderAll();
            this.populateSettingsForm();
            Toast.show('Backup restored successfully! 🎉');
          } else {
            Toast.show('Invalid backup file format', 'danger');
          }
        } catch (err) {
          console.error(err);
          Toast.show('Could not parse JSON file', 'danger');
        }
      };
      reader.readAsText(file);
    }

    populateSampleDemoData() {
      const today = new Date();
      const sampleMeals = [
        // Breakfasts
        { name: 'Rolled Oats with Berries & Honey', serving: '1 bowl (60g oats)', calories: 310, protein: 11, carbs: 54, fat: 5, mealCategory: 'breakfast' },
        { name: 'Scrambled Eggs with Avocado Toast', serving: '2 eggs + 1 toast', calories: 380, protein: 18, carbs: 22, fat: 24, mealCategory: 'breakfast' },
        { name: 'Greek Yogurt with Banana & Walnuts', serving: '1 bowl', calories: 290, protein: 20, carbs: 32, fat: 8, mealCategory: 'breakfast' },

        // Lunches
        { name: 'Grilled Chicken Rice Bowl', serving: '1 large bowl', calories: 580, protein: 46, carbs: 62, fat: 12, mealCategory: 'lunch' },
        { name: 'Salmon Salad with Olive Oil & Quinoa', serving: '1 plate', calories: 540, protein: 38, carbs: 35, fat: 26, mealCategory: 'lunch' },
        { name: 'Turkey Breast Sandwich & Veggies', serving: '1 sandwich', calories: 470, protein: 36, carbs: 48, fat: 11, mealCategory: 'lunch' },

        // Dinners
        { name: 'Sirloin Steak with Sweet Potato & Broccoli', serving: '1 plate', calories: 650, protein: 52, carbs: 45, fat: 24, mealCategory: 'dinner' },
        { name: 'Baked Atlantic Salmon with Asparagus & Rice', serving: '1 plate', calories: 610, protein: 42, carbs: 48, fat: 22, mealCategory: 'dinner' },
        { name: 'Chicken Pasta with Marinara & Parmesan', serving: '1 bowl', calories: 680, protein: 44, carbs: 75, fat: 18, mealCategory: 'dinner' },

        // Snacks
        { name: 'Whey Protein Shake with Almond Milk', serving: '1 shaker', calories: 150, protein: 25, carbs: 4, fat: 3, mealCategory: 'snacks' },
        { name: 'Apple with 2 tbsp Peanut Butter', serving: '1 apple', calories: 280, protein: 8, carbs: 32, fat: 16, mealCategory: 'snacks' },
        { name: 'Handful of Almonds & Dark Chocolate', serving: '40g', calories: 220, protein: 6, carbs: 14, fat: 17, mealCategory: 'snacks' }
      ];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = this.store.formatDate(d);

        // Pick distinct meals
        const b = sampleMeals[i % 3];
        const l = sampleMeals[3 + (i % 3)];
        const din = sampleMeals[6 + (i % 3)];
        const snk = sampleMeals[9 + (i % 3)];

        this.store.logs[dateStr] = {
          meals: [
            { id: 'sample_' + Math.random(), ...b, timestamp: d.toISOString() },
            { id: 'sample_' + Math.random(), ...l, timestamp: d.toISOString() },
            { id: 'sample_' + Math.random(), ...din, timestamp: d.toISOString() },
            { id: 'sample_' + Math.random(), ...snk, timestamp: d.toISOString() }
          ],
          water: 2000 + (i % 3) * 500,
          exerciseBurned: (i % 2 === 0) ? 350 : 0
        };
      }

      this.store.saveLogs();
      this.renderAll();
      Toast.show('Sample demo data loaded for past 7 days! 🚀');
    }

    // Helper: Escapes HTML to prevent XSS
    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    renderAll() {
      this.renderDashboard();
      this.renderTrendsTab();
      this.renderFoodLibraryTab();
      this.renderSettingsTab();
    }
  }

  // =========================================================================
  // 14. BOOTSTRAP APPLICATION ON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    window.nutriTrackApp = new NutriTrackApp();
  });

})();

