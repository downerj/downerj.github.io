function randomInt(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

function randomIntExcl(minimum, maximum) {
  return randomInt(minimum, maximum - 1);
}

let _debugMessages = {};

function debugOnce(tag, message) {
  if (!(tag in _debugMessages)) {
    _debugMessages[tag] = true;
    console.log(`%cDEBUG @${tag}: ${message}`, 'color: #00f;');
  }
}

function debugOnceJSON(tag, value) {
  debugOnce(tag, JSON.stringify(value, null, ' '));
}

function isSet(value) {
  return value !== null && value !== undefined;
}
