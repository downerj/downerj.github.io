class DrawData {
  constructor(polygon = SQUARE, color = '#ffffff', filled = false) {
    this._polygon = polygon;
    this._color = color;
    this._filled = filled;
  }
  
  get polygon() {
    return this._polygon;
  }
  
  get color() {
    return this._color;
  }
  
  get filled() {
    return this._filled;
  }
  
  set polygon(rhs) {
    this._polygon = rhs;
  }
  
  set color(rhs) {
    this._color = rhs;
  }
  
  set filled(rhs) {
    this._filled = rhs;
  }
  
  clone() {
    return new DrawData(this._polygon, this._color, this._filled);
  }
}
