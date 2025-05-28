// src/lib/tasks/taskModel.js

/**
 * Task model and factory functions
 */

let taskIdCounter = 0;

export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed'
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

/**
 * Creates a new task object
 * @param {string} text - Task description
 * @param {string} priority - Task priority (optional)
 * @returns {Object} New task object
 */
export function createTask(text, priority = TASK_PRIORITY.MEDIUM) {
  return {
    id: taskIdCounter++,
    text: text.trim(),
    completed: false,
    priority,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Updates an existing task
 * @param {Object} task - Task to update
 * @param {Object} updates - Properties to update
 * @returns {Object} Updated task
 */
export function updateTask(task, updates) {
  return {
    ...task,
    ...updates,
    updatedAt: new Date()
  };
}

/**
 * Toggles task completion status
 * @param {Object} task - Task to toggle
 * @returns {Object} Updated task
 */
export function toggleTaskCompletion(task) {
  return updateTask(task, {
    completed: !task.completed
  });
}

/**
 * Validates task object structure
 * @param {Object} task - Task to validate
 * @returns {boolean} True if valid
 */
export function isValidTask(task) {
  return (
    task &&
    typeof task.id !== 'undefined' &&
    typeof task.text === 'string' &&
    task.text.trim().length > 0 &&
    typeof task.completed === 'boolean' &&
    task.createdAt instanceof Date
  );
}

/**
 * Sets the task ID counter (useful for loading from storage)
 * @param {number} counter - New counter value
 */
export function setTaskIdCounter(counter) {
  taskIdCounter = Math.max(counter, taskIdCounter);
}