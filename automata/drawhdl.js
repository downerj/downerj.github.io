class DrawHandler {
  constructor(cvs, grid, entities = []) {
    this._cvs = cvs;
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight - 10;
    this._ctx = cvs.getContext('2d');
    this._ctx.translate(0.5, 0.5);
    this._scrW = cvs.width;
    this._scrH = cvs.height;
    this._bgColor = '#000000';
    this._fgColor = '#333333';
    this._grid = grid;
    this._camera = new Camera({
      width: cvs.width,
      height: cvs.height,
      center: grid.scalePoint(grid.width / 2, grid.height / 2),
      // position: [20, 20],
    });
    this._entities = entities;

    window.addEventListener('resize', () => {
      this._cvs.width = window.innerWidth;
      this._cvs.height = window.innerHeight - 10;
      this._scrW = this._cvs.width;
      this._scrH = this._cvs.height;
    });
    this._crosshairsEnabled = false;
    this._crosshairsColor = '#0000ff';
  }

  update() {
    // draw a black background
    this._ctx.fillStyle = this._bgColor;
    this._ctx.fillRect(0, 0, this._scrW, this._scrH);

    // draw a grid
    let grid = this._grid;
    let camera = this._camera;
    this._ctx.lineWidth = 2;
    this._ctx.strokeStyle = this._fgColor;
    this._ctx.beginPath();
    // start with vertical column lines
    for (let c = 0; c <= this._grid.width; c++) {
      // start at [column, 0]
      let x0Pre = c * this._grid.cellWidth;
      let y0Pre = 0;
      // end at [column, grid height]
      let x1Pre = x0Pre;
      let y1Pre = y0Pre + (this._grid.cellHeight * this._grid.height);
      // apply camera view
      let pt0 = camera.transformPoint(x0Pre, y0Pre);
      let pt1 = camera.transformPoint(x1Pre, y1Pre);
      
      this._ctx.moveTo(pt0[0], pt0[1]);
      this._ctx.lineTo(pt1[0], pt1[1]);
    }
    // then do horizontal row lines
    for (let r = 0; r <= this._grid.height; r++) {
      // start at [0, row]
      let x0Pre = 0;
      let y0Pre = r * this._grid.cellHeight;
      // end at [grid width, row]
      let x1Pre = x0Pre + (this._grid.cellWidth * this._grid.width);
      let y1Pre = y0Pre;
      // apply camera view
      let pt0 = camera.transformPoint(x0Pre, y0Pre);
      let pt1 = camera.transformPoint(x1Pre, y1Pre);
      
      this._ctx.moveTo(pt0[0], pt0[1]);
      this._ctx.lineTo(pt1[0], pt1[1]);
    }
    this._ctx.stroke();
    
    // draw entities
    for (let entity of this._entities) {
      let position = entity.position;
      let drawData = entity.draw();
      let polygon = drawData.polygon;
      let color = drawData.color;
      let filled = drawData.filled;
      
      // TODO: account for camera position & zoom
      // get cell center
      let xc = position[0] + 0.5;
      let yc = position[1] + 0.5;
      
      // get pixel point
      function getPixel(pt) {
        // scale polygon point to cell
        let xp = xc + 0.5 * pt[0];
        let yp = yc + 0.5 * pt[1];
        
        // scale point to display
        let pixelFromCenter = grid.scalePoint(xp, yp);
        let pixelCamera = camera.transformPoint(pixelFromCenter[0], pixelFromCenter[1]);
        return pixelCamera;
      }
      
      // draw polygons
      let points = polygon.points;
      this._ctx.beginPath();
      
      // move to first point
      let px0 = getPixel(points[0]);
      this._ctx.moveTo(px0[0], px0[1]);
      // set other points
      for (let p = 1; p < points.length; p++) {
        let px = getPixel(points[p]);
        this._ctx.lineTo(px[0], px[1]);
      }
      this._ctx.closePath();
      
      // finish drawing the path
      if (filled) {
        this._ctx.fillStyle = color;
        this._ctx.fill();
      } else {
        this._ctx.strokeStyle = color;
        this._ctx.stroke();
      }
    }
    
    if (this._crosshairsEnabled) {
      // draw camera crosshairs
      this._ctx.beginPath();
      this._ctx.moveTo(cvs.width / 2, 0);
      this._ctx.lineTo(cvs.width / 2, cvs.height);
      this._ctx.moveTo(0, cvs.height / 2);
      this._ctx.lineTo(cvs.width, cvs.height / 2);
      this._ctx.strokeStyle = this._crosshairsColor;
      this._ctx.stroke();
    }
  }

  get camera() {
    return this._camera;
  }
}
