class Grid {
  constructor(width, height, cellWidth, cellHeight) {
    this._w = width;
    this._h = height;
    this._cW = cellWidth;
    this._cH = cellHeight;
  }
  
  scalePoint(gridX, gridY) {
    let pxX = gridX * this._cW;
    let pxY = gridY * this._cH;
    
    return [pxX, pxY];
  }
  
  isInBounds(gridPoint) {
    let x = gridPoint[0];
    let y = gridPoint[1];
    
    return (0 <= x && x < this._w) && (0 <= y && y < this._h);
  }
  
  wrapPoint(gridPoint) {
    let x = gridPoint[0] % this._w;
    let y = gridPoint[1] % this._h;
    
    if (x < 0) {
      x = this._w + x;
    }
    if (y < 0) {
      y = this._h + y;
    }
    
    return [x, y];
  }
  
  wrapEntityPosition(entity) {
    entity.x %= this._w;
    entity.y %= this._h;
    if (entity.x < 0) {
      entity.x = this._w + entity.x;
    }
    if (entity.y < 0) {
      entity.y = this._h + entity.y;
    }
  }
  
  get width() {
    return this._w;
  }
  
  get height() {
    return this._h;
  }
  
  get cellWidth() {
    return this._cW;
  }
  
  get cellHeight() {
    return this._cH;
  }
}
