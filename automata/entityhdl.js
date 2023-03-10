class EntityHandler {
  constructor(cvs, grid, entities = []) {
    this._cvs = cvs;
    this._grid = grid;
    this._entities = entities;
  }
  
  update() {
    for (let entity of this._entities) {
      if (entity instanceof Moveable) {
        entity.move();
        this._grid.wrapEntityPosition(entity);
      }
    }
  }
}
