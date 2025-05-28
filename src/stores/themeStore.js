// src/stores/themeStore.js

import { writable } from 'svelte/store';

// Check if we're in browser environment
const browser = typeof window !== 'undefined';

// Theme types
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Default theme preference
const DEFAULT_THEME = THEMES.AUTO;
const STORAGE_KEY = 'todo-theme-preference';

// Get initial theme from localStorage or system preference
function getInitialTheme() {
  if (!browser) return DEFAULT_THEME;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && Object.values(THEMES).includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to load theme preference:', error);
  }

  return DEFAULT_THEME;
}

// Get system theme preference
function getSystemTheme() {
  if (!browser) return THEMES.LIGHT;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? THEMES.DARK 
    : THEMES.LIGHT;
}

// Resolve actual theme (handle AUTO mode)
function resolveTheme(themePreference) {
  if (themePreference === THEMES.AUTO) {
    return getSystemTheme();
  }
  return themePreference;
}

// Create theme stores
export const themePreference = writable(getInitialTheme());
export const currentTheme = writable(resolveTheme(getInitialTheme()));

// Theme actions
export const themeActions = {
  /**
   * Set theme preference
   * @param {string} theme - Theme preference (light/dark/auto)
   */
  setTheme(theme) {
    if (!Object.values(THEMES).includes(theme)) {
      console.warn('Invalid theme:', theme);
      return;
    }

    themePreference.set(theme);
    const resolvedTheme = resolveTheme(theme);
    currentTheme.set(resolvedTheme);
    
    // Save to localStorage
    if (browser) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    }

    // Apply to document
    applyThemeToDocument(resolvedTheme);
  },

  /**
   * Toggle between light and dark (skip auto)
   */
  toggleTheme() {
    themePreference.subscribe(current => {
      const resolvedCurrent = resolveTheme(current);
      const newTheme = resolvedCurrent === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      this.setTheme(newTheme);
    })();
  },

  /**
   * Cycle through all themes: light -> dark -> auto
   */
  cycleTheme() {
    themePreference.subscribe(current => {
      const themeOrder = [THEMES.LIGHT, THEMES.DARK, THEMES.AUTO];
      const currentIndex = themeOrder.indexOf(current);
      const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
      this.setTheme(nextTheme);
    })();
  },

  /**
   * Reset to system preference
   */
  resetToAuto() {
    this.setTheme(THEMES.AUTO);
  }
};

// Apply theme to document
function applyThemeToDocument(theme) {
  if (!browser) return;

  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  
  // Add theme class for easier CSS targeting
  root.classList.remove('theme-light', 'theme-dark');
  root.classList.add(`theme-${theme}`);
}

// Listen for system theme changes (only affects AUTO mode)
if (browser) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', (e) => {
    themePreference.subscribe(preference => {
      if (preference === THEMES.AUTO) {
        const newSystemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
        currentTheme.set(newSystemTheme);
        applyThemeToDocument(newSystemTheme);
      }
    })();
  });

  // Apply initial theme to document
  currentTheme.subscribe(theme => {
    applyThemeToDocument(theme);
  });
}

// Derived stores for easy consumption
export const isDarkMode = writable(false);
export const isLightMode = writable(true);
export const isAutoMode = writable(false);

// Update derived stores
currentTheme.subscribe(theme => {
  isDarkMode.set(theme === THEMES.DARK);
  isLightMode.set(theme === THEMES.LIGHT);
});

themePreference.subscribe(preference => {
  isAutoMode.set(preference === THEMES.AUTO);
});

// Export for easy access
export { themePreference as theme };