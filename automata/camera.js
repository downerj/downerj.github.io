class Camera {
  constructor(kwargs) {
    this._w = 0;
    this._h = 0;
    this._x = 0;
    this._y = 0;
    this._zoom = 0;
    this._cx = null;
    this._cy = null;
    
    if (isSet(kwargs)) {
      for (let key in kwargs) {
        let value = kwargs[key];
        
        switch (key) {
          case 'width':
            this._w = value;
            break;
          
          case 'height':
            this._h = value;
            break;
            
          case 'position':
            this._x = value[0];
            this._y = value[1];
            break;
          
          case 'center':
            this._cx = value[0];
            this._cy = value[1];
            break;
          
          case 'x':
            this._x = value;
            break;
            
          case 'y':
            this._y = value;
            break;
          
          case 'zoom':
            this._zoom = value;
            break;
        }
      }
    }
    
    if (isSet(this._cx) && isSet(this._cy)) {
      this._updatePositionFromCenter();
    } else {
      this._updateCenterFromPosition();
    }
    this._computeZoom();
  }
  
  transformPoint(x, y) {
    let xfc = x - this._cx;
    let yfc = y - this._cy;
    
    let xt = xfc * this._computedZoom + this._w / 2;
    let yt = yfc * this._computedZoom + this._h / 2;
    return [xt, yt];
  }
  
  get width() {
    return this._w;
  }
  
  get height() {
    return this._h;
  }
  
  _updateCenterFromPosition() {
    this._cx = this._x + this._w / 2;
    this._cy = this._y + this._h / 2;
  }
  
  _updatePositionFromCenter() {
    this._x = this._cx - this._w / 2;
    this._y = this._cy - this._h / 2;
  }
  
  get position() {
    return [this._x, this._y];
  }
  
  get x() {
    return this._x;
  }
  
  get y() {
    return this._y;
  }
  
  get zoom() {
    return this._zoom;
  }
  
  get computedZoom() {
    return this._computedZoom;
  }
  
  get crossHairsEnabled() {
    return this._crossHairs;
  }
  
  set width(rhs) {
    this._w = rhs;
  }
  
  set height(rhs) {
    this._h = rhs;
  }
  
  set position(point) {
    this._x = point[0];
    this._y = point[1];
    this._updateCenterFromPosition();
  }
  
  set x(rhs) {
    this._x = rhs;
    this._updateCenterFromPosition();
  }
  
  set y(rhs) {
    this._y = rhs;
    this._updateCenterFromPosition();
  }
  
  moveTo(x, y) {
    this._x = x;
    this._y = y;
    this._updateCenterFromPosition();
  }
  
  moveLeft(dx) {
    this._x -= dx;
    this._updateCenterFromPosition();
  }
    
  moveRight(dx) {
    this._x += dx;
    this._updateCenterFromPosition();
  }
  
  moveUp(dy) {
    this._y -= dy;
    this._updateCenterFromPosition();
  }
  
  moveDown(dy) {
    this._y += dy;
    this._updateCenterFromPosition();
  }
  
  move(dx, dy) {
    this._x += dx;
    this._y += dy;
    this._updateCenterFromPosition();
  }
  
  _computeZoom() {
    this._computedZoom = 2 ** (this._zoom / 128);
  }
  
  set zoom(rhs) {
    this._zoom = rhs;
    this._computeZoom();
  }
  
  zoomIn(dz) {
    this._zoom += dz;
    this._computeZoom();
  }
  
  zoomOut(dz) {
    this._zoom -= dz;
    this._computeZoom();
  }
}
