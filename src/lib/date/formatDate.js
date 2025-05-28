// src/lib/date/formatDate.js

/**
 * Date formatting utilities
 */

/**
 * Formats a date to Italian locale string
 * @param {Date} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date || !(date instanceof Date)) {
    return '';
  }

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  try {
    return date.toLocaleDateString('it-IT', defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toLocaleDateString();
  }
}

/**
 * Formats a date to short format (dd/mm/yyyy)
 * @param {Date} date - Date to format
 * @returns {string} Short formatted date
 */
export function formatDateShort(date) {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Formats a date with time
 * @param {Date} date - Date to format
 * @returns {string} Date with time
 */
export function formatDateTime(date) {
  if (!date || !(date instanceof Date)) {
    return '';
  }

  try {
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return date.toLocaleString();
  }
}

/**
 * Formats time only
 * @param {Date} date - Date to format
 * @returns {string} Time string
 */
export function formatTime(date) {
  if (!date || !(date instanceof Date)) {
    return '';
  }

  try {
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return date.toLocaleTimeString();
  }
}

/**
 * Gets relative time string (e.g., "2 giorni fa", "tra 1 ora")
 * @param {Date} date - Date to compare
 * @param {Date} baseDate - Base date for comparison (default: now)
 * @returns {string} Relative time string
 */
export function getRelativeTime(date, baseDate = new Date()) {
  if (!date || !(date instanceof Date)) {
    return '';
  }

  const diff = baseDate.getTime() - date.getTime();
  const absDiff = Math.abs(diff);
  const isPast = diff > 0;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  let value, unit;

  if (absDiff < minute) {
    return 'proprio ora';
  } else if (absDiff < hour) {
    value = Math.floor(absDiff / minute);
    unit = value === 1 ? 'minuto' : 'minuti';
  } else if (absDiff < day) {
    value = Math.floor(absDiff / hour);
    unit = value === 1 ? 'ora' : 'ore';
  } else if (absDiff < week) {
    value = Math.floor(absDiff / day);
    unit = value === 1 ? 'giorno' : 'giorni';
  } else if (absDiff < month) {
    value = Math.floor(absDiff / week);
    unit = value === 1 ? 'settimana' : 'settimane';
  } else if (absDiff < year) {
    value = Math.floor(absDiff / month);
    unit = value === 1 ? 'mese' : 'mesi';
  } else {
    value = Math.floor(absDiff / year);
    unit = value === 1 ? 'anno' : 'anni';
  }

  return isPast ? `${value} ${unit} fa` : `tra ${value} ${unit}`;
}

/**
 * Checks if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  if (!date || !(date instanceof Date)) {
    return false;
  }

  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is yesterday
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is yesterday
 */
export function isYesterday(date) {
  if (!date || !(date instanceof Date)) {
    return false;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Gets a user-friendly date string
 * @param {Date} date - Date to format
 * @returns {string} User-friendly date
 */
export function getFriendlyDate(date) {
  if (!date || !(date instanceof Date)) {
    return '';
  }

  if (isToday(date)) {
    return `Oggi alle ${formatTime(date)}`;
  }
  
  if (isYesterday(date)) {
    return `Ieri alle ${formatTime(date)}`;
  }
  
  const daysDiff = Math.floor((new Date() - date) / (24 * 60 * 60 * 1000));
  
  if (daysDiff < 7) {
    return `${getRelativeTime(date)} alle ${formatTime(date)}`;
  }
  
  return formatDateTime(date);
}

/**
 * Parses a date string safely
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export function parseDate(dateString) {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}