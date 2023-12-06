class Moveable extends Entity {
  constructor(x = 0, y = 0, dx = 0, dy = 0) {
    super(x, y);
    this._dx = dx;
    this._dy = dy;
  }
  
  get dx() {
    return this._dx;
  }
  
  get dy() {
    return this._dy;
  }
  
  set dx(rhs) {
    this._dx = rhs;
  }
  
  set dy(rhs) {
    this._dy = rhs;
  }
  
  move() {
    this._x += this._dx;
    this._y += this._dy;
  }
}
