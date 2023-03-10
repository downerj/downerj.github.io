class InputHandler {
  constructor() {
    this._keys = {};
    this._debouncedKeys = {};
    this._mouse = {
      x: null,
      y: null,
      scrollX: null,
      scrollY: null,
      button: null,
    };
    
    window.addEventListener('keydown', (event) => {
      if (!(event.key in this._debouncedKeys)) {
        if (!(event.key in this._keys)) {
          this._keys[event.key] = 0;
        }
        this._keys[event.key]++;
      }
    });
    
    window.addEventListener('keyup', (event) => {
      if (event.key in this._keys) {
        delete this._keys[event.key];
      }
      if (event.key in this._debouncedKeys) {
        delete this._debouncedKeys[event.key];
      }
    });
    
    window.addEventListener('mousedown', (event) => {
      this._mouse.button = event.which;
      this._mouse.x = event.clientX;
      this._mouse.y = event.clientY;
    });
    
    window.addEventListener('mouseup', (event) => {
      this._mouse.button = null;
      this._mouse.x = event.clientX;
      this._mouse.y = event.clientY;
    });
    
    window.addEventListener('mousemove', (event) => {
      this._mouse.x = event.clientX;
      this._mouse.y = event.clientY;
    });
    
    window.addEventListener('wheel', (event) => {
      this._mouse.scrollX = event.deltaX;
      this._mouse.scrollY = event.deltaY;
    });
  }
  
  getKeys() {
    return this._keys;
  }
  
  getKey(keyName) {
    if (keyName in this._keys) {
      return this._keys[keyName];
    }
    
    return null;
  }
  
  isKeyDown(keyName) {
    return keyName in this._keys;
  }
  
  debounceKey(key) {
    this._debouncedKeys[key] = true;
    delete this._keys[key];
  }
  
  getMousePosition() {
    return [this._mouse.x, this._mouse.y];
  }
  
  getMouseX() {
    return this._mouse.x;
  }
  
  getMouseY() {
    return this._mouse.y;
  }
  
  getMouseButton() {
    return this._mouse.button;
  }
  
  isMouseButtonDown(button) {
    return this._mouse.button === button;    
  }
  
  getMouseScrollX() {
    return this._mouse.scrollX;
  }
  
  getMouseScrollY() {
    return this._mouse.scrollY;
  }
  
  update() {
    this._mouse.scrollX = 0;
    this._mouse.scrollY = 0;
  }
}
