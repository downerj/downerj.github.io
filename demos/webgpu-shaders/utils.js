/**
 * 
 * @param {any} value
 * @returns {boolean}
 */
export function isNil(value) {
  return value === void 0 || value === null;
}

/**
 * 
 * @param {number} min
 * @param {number} max
 * @returns 
 */
export function randomInteger(min, max) {
  return Math.floor(min + Math.random()*(max - min + 1));
}

