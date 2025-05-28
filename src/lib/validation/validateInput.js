// src/lib/validation/validateInput.js

/**
 * Input validation utilities
 */

// Validation constants
export const VALIDATION_RULES = {
  MIN_TASK_LENGTH: 1,
  MAX_TASK_LENGTH: 100,
  FORBIDDEN_CHARS: ['<', '>', '{', '}'],
  MAX_WORDS: 50
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Il task non può essere vuoto',
  TOO_SHORT: `Il task deve avere almeno ${VALIDATION_RULES.MIN_TASK_LENGTH} carattere`,
  TOO_LONG: `Il task non può superare ${VALIDATION_RULES.MAX_TASK_LENGTH} caratteri`,
  FORBIDDEN_CHARS: 'Il task contiene caratteri non consentiti',
  TOO_MANY_WORDS: `Il task non può avere più di ${VALIDATION_RULES.MAX_WORDS} parole`,
  INVALID_FORMAT: 'Formato del task non valido'
};

/**
 * Validates task input text
 * @param {string} text - Text to validate
 * @returns {Object} Validation result
 */
export function validateTaskText(text) {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Check if text exists
  if (!text || typeof text !== 'string') {
    result.isValid = false;
    result.errors.push(VALIDATION_MESSAGES.REQUIRED);
    return result;
  }

  const trimmedText = text.trim();

  // Check minimum length
  if (trimmedText.length < VALIDATION_RULES.MIN_TASK_LENGTH) {
    result.isValid = false;
    result.errors.push(VALIDATION_MESSAGES.TOO_SHORT);
  }

  // Check maximum length
  if (trimmedText.length > VALIDATION_RULES.MAX_TASK_LENGTH) {
    result.isValid = false;
    result.errors.push(VALIDATION_MESSAGES.TOO_LONG);
  }

  // Check for forbidden characters
  const containsForbiddenChars = VALIDATION_RULES.FORBIDDEN_CHARS.some(char =>
    trimmedText.includes(char)
  );
  if (containsForbiddenChars) {
    result.isValid = false;
    result.errors.push(VALIDATION_MESSAGES.FORBIDDEN_CHARS);
  }

  // Check word count
  const wordCount = trimmedText.split(/\s+/).length;
  if (wordCount > VALIDATION_RULES.MAX_WORDS) {
    result.isValid = false;
    result.errors.push(VALIDATION_MESSAGES.TOO_MANY_WORDS);
  }

  // Add warnings
  if (trimmedText.length > 50) {
    result.warnings.push('Il task è piuttosto lungo, considera di dividerlo');
  }

  if (trimmedText.split(/\s+/).length > 10) {
    result.warnings.push('Il task contiene molte parole, potrebbe essere troppo complesso');
  }

  return result;
}

/**
 * Sanitizes input text
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeTaskText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .substring(0, VALIDATION_RULES.MAX_TASK_LENGTH); // Truncate if too long
}

/**
 * Checks if task text is a duplicate
 * @param {string} text - Text to check
 * @param {Array} existingTasks - Array of existing tasks
 * @returns {boolean} True if duplicate
 */
export function isDuplicateTask(text, existingTasks) {
  if (!text || !Array.isArray(existingTasks)) {
    return false;
  }

  const normalizedText = text.trim().toLowerCase();
  return existingTasks.some(task =>
    task.text.trim().toLowerCase() === normalizedText
  );
}

/**
 * Validates and sanitizes task input
 * @param {string} text - Input text
 * @param {Array} existingTasks - Existing tasks for duplicate check
 * @returns {Object} Validation and sanitization result
 */
export function processTaskInput(text, existingTasks = []) {
  const sanitized = sanitizeTaskText(text);
  const validation = validateTaskText(sanitized);
  const isDuplicate = isDuplicateTask(sanitized, existingTasks);

  if (isDuplicate) {
    validation.isValid = false;
    validation.errors.push('Questo task esiste già');
  }

  return {
    ...validation,
    sanitizedText: sanitized,
    isDuplicate
  };
}

/**
 * Validates task priority
 * @param {string} priority - Priority to validate
 * @returns {boolean} True if valid
 */
export function validateTaskPriority(priority) {
  const validPriorities = ['low', 'medium', 'high'];
  return validPriorities.includes(priority);
}

/**
 * Gets validation message for UI display
 * @param {Object} validationResult - Result from validation
 * @returns {string} User-friendly message
 */
export function getValidationMessage(validationResult) {
  if (validationResult.errors.length > 0) {
    return validationResult.errors[0];
  }
  
  if (validationResult.warnings.length > 0) {
    return validationResult.warnings[0];
  }
  
  return '';
}