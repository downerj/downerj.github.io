export function isNil(value) {
  return value === void 0 || value === null;
}

export function randomInteger(min, max) {
  return Math.floor(min + Math.random()*(max - min + 1));
}

