// src/lib/tasks/taskUtils.js

/**
 * Task utility functions for filtering, sorting, and manipulation
 */

/**
 * Filters tasks by completion status
 * @param {Array} tasks - Array of tasks
 * @param {boolean} completed - Filter by completed status
 * @returns {Array} Filtered tasks
 */
export function filterTasksByStatus(tasks, completed) {
  return tasks.filter(task => task.completed === completed);
}

/**
 * Gets completed tasks
 * @param {Array} tasks - Array of tasks
 * @returns {Array} Completed tasks
 */
export function getCompletedTasks(tasks) {
  return filterTasksByStatus(tasks, true);
}

/**
 * Gets pending tasks
 * @param {Array} tasks - Array of tasks
 * @returns {Array} Pending tasks
 */
export function getPendingTasks(tasks) {
  return filterTasksByStatus(tasks, false);
}

/**
 * Finds a task by ID
 * @param {Array} tasks - Array of tasks
 * @param {number} id - Task ID to find
 * @returns {Object|null} Found task or null
 */
export function findTaskById(tasks, id) {
  return tasks.find(task => task.id === id) || null;
}

/**
 * Removes a task by ID
 * @param {Array} tasks - Array of tasks
 * @param {number} id - Task ID to remove
 * @returns {Array} Updated tasks array
 */
export function removeTaskById(tasks, id) {
  return tasks.filter(task => task.id !== id);
}

/**
 * Updates a task in the array
 * @param {Array} tasks - Array of tasks
 * @param {number} id - Task ID to update
 * @param {Object} updates - Updates to apply
 * @returns {Array} Updated tasks array
 */
export function updateTaskById(tasks, id, updates) {
  return tasks.map(task => 
    task.id === id 
      ? { ...task, ...updates, updatedAt: new Date() }
      : task
  );
}

/**
 * Toggles task completion by ID
 * @param {Array} tasks - Array of tasks
 * @param {number} id - Task ID to toggle
 * @returns {Array} Updated tasks array
 */
export function toggleTaskById(tasks, id) {
  return tasks.map(task =>
    task.id === id
      ? { ...task, completed: !task.completed, updatedAt: new Date() }
      : task
  );
}

/**
 * Sorts tasks by creation date
 * @param {Array} tasks - Array of tasks
 * @param {boolean} ascending - Sort order (true for ascending)
 * @returns {Array} Sorted tasks
 */
export function sortTasksByDate(tasks, ascending = true) {
  return [...tasks].sort((a, b) => {
    const comparison = new Date(a.createdAt) - new Date(b.createdAt);
    return ascending ? comparison : -comparison;
  });
}

/**
 * Sorts tasks by completion status (pending first)
 * @param {Array} tasks - Array of tasks
 * @returns {Array} Sorted tasks
 */
export function sortTasksByStatus(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });
}

/**
 * Searches tasks by text content
 * @param {Array} tasks - Array of tasks
 * @param {string} query - Search query
 * @returns {Array} Matching tasks
 */
export function searchTasks(tasks, query) {
  if (!query || query.trim() === '') return tasks;
  
  const searchTerm = query.toLowerCase().trim();
  return tasks.filter(task =>
    task.text.toLowerCase().includes(searchTerm)
  );
}

/**
 * Gets task statistics
 * @param {Array} tasks - Array of tasks
 * @returns {Object} Statistics object
 */
export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = getCompletedTasks(tasks).length;
  const pending = getPendingTasks(tasks).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completionRate
  };
}

/**
 * Groups tasks by completion status
 * @param {Array} tasks - Array of tasks
 * @returns {Object} Grouped tasks
 */
export function groupTasksByStatus(tasks) {
  return {
    pending: getPendingTasks(tasks),
    completed: getCompletedTasks(tasks)
  };
}