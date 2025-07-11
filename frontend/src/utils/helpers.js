/**
 * Combines multiple class names into a single string.
 * Filters out falsy values to avoid undefined/null classes.
 * 
 * @param {...string} classes - Class names to combine
 * @returns {string} Combined class string
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Formats a date string into a readable format.
 * 
 * @param {string|Date} date - The date to format
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleDateString(locale, options);
};

/**
 * Truncates text to a specified length and adds an ellipsis if needed.
 * 
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Converts a string to title case.
 * 
 * @param {string} str - The string to convert
 * @returns {string} Title-cased string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Debounces a function call.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Formats a number with commas as thousand separators.
 * 
 * @param {number|string} number - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Validates an email address.
 * 
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Creates a unique ID.
 * 
 * @param {number} length - Length of the ID (default: 8)
 * @returns {string} A unique ID string
 */
export const createId = (length = 8) => {
  return Math.random().toString(36).substring(2, length + 2);
};
