class Game {
  constructor(canvas) {
    // display settings
    this._cvs = canvas;
    const GRID_WIDTH = 50;
    const GRID_HEIGHT = 50;
    const CELL_WIDTH = 20;
    const CELL_HEIGHT = 20;
    this._grid = new Grid(GRID_WIDTH, GRID_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    
    // input settings
    this._MOUSE_MARGIN_X = 40;
    this._MOUSE_MARGIN_Y = 40;

    // game settings
    this._entities = [];
    const NUM_PLANTS = 30;
    for (let p = 0; p < NUM_PLANTS; p++) {
      let x = randomIntExcl(0, GRID_WIDTH);
      let y = randomIntExcl(0, GRID_HEIGHT);
      this._entities.push(new Plant(x, y));
    }
    const NUM_WANDERERS = 10;
    const WANDERER_SPEED = 1;
    for (let w = 0; w < NUM_WANDERERS; w++) {
      let x = randomIntExcl(0, GRID_WIDTH);
      let y = randomIntExcl(0, GRID_HEIGHT);
      let sleepProb = randomInt(0, 10);
      this._entities.push(new Wanderer(x, y, WANDERER_SPEED, sleepProb));
    }
    
    // handlers
    this._hdlInput = new InputHandler();
    this._hdlDraw = new DrawHandler(this._cvs, this._grid, this._entities);
    this._hdlEntities = new EntityHandler(this._cvs, this._grid, this._entities);
    
    // timer settings
    this._looper = null;
    this._paused = false;
    this._fps = 40;
    this._interval = Math.floor(1000 / this._fps);
    this._framesToWait = 2;
    this._paused = false;
  }
  
  _handleInput() {
    let camera = this._hdlDraw.camera;
    let cameraSpeed = 10 / camera.computedZoom;
    let cameraZoomSpeed = 10;
    let keysDown = this._hdlInput.getKeys();
    let mouseXY = this._hdlInput.getMousePosition();
    let mouseScrollX = this._hdlInput.getMouseScrollX();
    let mouseScrollY = this._hdlInput.getMouseScrollY();
    
    if (!('Shift' in keysDown)) {
      /*
      let mouseOnLeftEdge = mouseXY[0] < (0 + this._MOUSE_MARGIN_X);
      let mouseOnRightEdge = mouseXY[0] > (this._cvs.width - this._MOUSE_MARGIN_X);
      let mouseOnTopEdge = mouseXY[1] < (0 + this._MOUSE_MARGIN_Y);
      let mouseOnBottomEdge = mouseXY[1] > (this._cvs.height - this._MOUSE_MARGIN_Y);
      */
      
      if ('ArrowRight' in keysDown || mouseScrollX > 0) {
        camera.moveRight(cameraSpeed);
      } else if ('ArrowLeft' in keysDown || mouseScrollX < 0) {
        camera.moveLeft(cameraSpeed);
      }
      if ('ArrowDown' in keysDown || mouseScrollY < 0) {
        camera.moveDown(cameraSpeed);
      } else if ('ArrowUp' in keysDown || mouseScrollY > 0) {
        camera.moveUp(cameraSpeed);
      }
    } else {
      if ('ArrowUp' in keysDown || mouseScrollY > 0) {
        camera.zoomIn(cameraZoomSpeed);
      } else if ('ArrowDown' in keysDown || mouseScrollY < 0) {
        camera.zoomOut(cameraZoomSpeed);
      }
    }
    
    if ('p' in keysDown) {
      this._paused = !this._paused;
      this._hdlInput.debounceKey('p');
    }
    
    this._hdlInput.update();
  }
  
  run() {
    let frameCounter = 0;
    this._looper = new Looper(() => {
      this._handleInput();
      if (!this._paused) {
        if (frameCounter % this._framesToWait === 0) {
          this._hdlEntities.update();
        }
      }
      this._hdlDraw.update();
      
      frameCounter++;
    }, this._interval);
    this._looper.start();
  }
}
let cvs = document.getElementById('cvs');
let game = new Game(cvs);
game.run();
