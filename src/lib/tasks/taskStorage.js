// src/lib/tasks/taskStorage.js

/**
 * Task storage management
 * Note: In Claude.ai artifacts, localStorage is not supported
 * This code would work in a normal browser environment
 */

const STORAGE_KEY = 'modern-todo-tasks';
const COUNTER_KEY = 'modern-todo-counter';

/**
 * Saves tasks to storage
 * @param {Array} tasks - Array of tasks to save
 */
export function saveTasks(tasks) {
  try {
    // In a real environment, this would use localStorage
    // localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    console.log('Tasks would be saved to localStorage:', tasks);
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

/**
 * Loads tasks from storage
 * @returns {Array} Array of tasks
 */
export function loadTasks() {
  try {
    // In a real environment, this would use localStorage
    // const stored = localStorage.getItem(STORAGE_KEY);
    // return stored ? JSON.parse(stored) : [];
    console.log('Tasks would be loaded from localStorage');
    return [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}

/**
 * Saves task ID counter to storage
 * @param {number} counter - Counter value to save
 */
export function saveTaskCounter(counter) {
  try {
    // localStorage.setItem(COUNTER_KEY, counter.toString());
    console.log('Counter would be saved to localStorage:', counter);
  } catch (error) {
    console.error('Error saving counter:', error);
  }
}

/**
 * Loads task ID counter from storage
 * @returns {number} Counter value
 */
export function loadTaskCounter() {
  try {
    // const stored = localStorage.getItem(COUNTER_KEY);
    // return stored ? parseInt(stored, 10) : 0;
    console.log('Counter would be loaded from localStorage');
    return 0;
  } catch (error) {
    console.error('Error loading counter:', error);
    return 0;
  }
}

/**
 * Clears all tasks from storage
 */
export function clearTasks() {
  try {
    // localStorage.removeItem(STORAGE_KEY);
    // localStorage.removeItem(COUNTER_KEY);
    console.log('Tasks would be cleared from localStorage');
  } catch (error) {
    console.error('Error clearing tasks:', error);
  }
}

/**
 * Exports tasks as JSON string
 * @param {Array} tasks - Tasks to export
 * @returns {string} JSON string
 */
export function exportTasks(tasks) {
  try {
    return JSON.stringify(tasks, null, 2);
  } catch (error) {
    console.error('Error exporting tasks:', error);
    return '[]';
  }
}

/**
 * Imports tasks from JSON string
 * @param {string} jsonString - JSON string to import
 * @returns {Array} Array of tasks
 */
export function importTasks(jsonString) {
  try {
    const tasks = JSON.parse(jsonString);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error('Error importing tasks:', error);
    return [];
  }
}