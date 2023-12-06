class Looper {
  constructor(callback, interval) {
    this._callback = callback;
    this._interval = interval;
    this._handle = null;
  }
  
  start() {
    if (this._handle !== null) {
      return false;
    }
    
    let previous = null;
    
    function _tick(stamp) {
      if (previous === null) {
        previous = stamp;
      }
      
      let elapsed = stamp - previous;
      
      if (elapsed >= this._interval) {
        previous = stamp;
        this._callback();
      }
      
      this._handle = window.requestAnimationFrame(_tick.bind(this));
    }
    
    this._handle = window.requestAnimationFrame(_tick.bind(this));
  
    return true;
  }
  
  stop() {
    if (this._handle === null) {
      return false;
    }
    
    window.cancelAnimationFrame(this._handle);
    this._handle = null;
  }
}
