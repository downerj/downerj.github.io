class Polygon {
  constructor(/* points */) {
    this._points = [...arguments];
  }
  
  get points() {
    return this._points;
  }
  
  set points(rhs) {
    this._points = rhs;
  }
  
  appendPoint(rhs) {
    this._points.push(rhs);
  }
  
  prependPoint(rhs) {
    this._points.unshift(rhs);
  }
  
  clone() {
    return new Polygon(...this._points);
  }
}

const SQUARE = new Polygon(
    [-1.0, -1.0], [1.0, -1.0], [1.0, 1.0], [-1.0, 1.0],
);
const DIAMOND = new Polygon(
    [0.0, -1.0], [1.0, 0.0], [0.0, 1.0], [-1.0, 0.0],
);
const TRIANGLE_N = new Polygon(
    [0.0, -1.0], [1.0, 1.0], [-1.0, 1.0],
);
const TRIANGLE_E = new Polygon(
    [1.0, 0.0], [-1.0, 1.0], [-1.0, -1.0],
);
const TRIANGLE_S = new Polygon(
    [0.0, 1.0], [-1.0, -1.0], [1.0, -1.0],
);
const TRIANGLE_W = new Polygon(
    [-1.0, 0.0], [1.0, -1.0], [1.0, 1.0],
);
