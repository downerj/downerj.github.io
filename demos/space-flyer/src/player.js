/****************************************************************************
 * PLAYER : CONTANTS
 ****************************************************************************/
 const PLAYER_COLOR_LINING  = '#f00';
 const PLAYER_COLOR_FILLING = '#300';
 const BULLET_OFFSET        = 10;

/****************************************************************************
 * PLAYER : CONSTRUCTOR
 ****************************************************************************/
function Player(center, cvs, ctx) {
    this.center       = center;
    this.colorLining  = PLAYER_COLOR_LINING;
    this.colorFilling = PLAYER_COLOR_FILLING;
    this.rotation     = 0;
    this.direction    = 0;
    this.velocity     = 0;
    this.bullets      = [];
    this.bulletOffset = BULLET_OFFSET;
    this.life         = 0;
}

/****************************************************************************
 * PLAYER : KILL
 ****************************************************************************/
Player.prototype.kill = function() {
    this.life = -1;
};

/****************************************************************************
 * PLAYER : IS ALIVE
 ****************************************************************************/
Player.prototype.isAlive = function() {
    return this.life >= 0;
};

/****************************************************************************
 * PLAYER : POINTS ARRAY
 ****************************************************************************/
Player.prototype.points = [
    [ 10,   0],
    [-10,  10],
    [- 5,   0],
    [-10, -10],
];

/****************************************************************************
 * PLAYER : ROTATE
 ****************************************************************************/
Player.prototype.rotate = function(deg) {
    if (!deg) {
        return;
    }
    
    this.rotation -= deg;
    if (this.rotation < 0) {
        this.rotation += 360;
    }
    this.rotation %= 360;
};

/****************************************************************************
 * PLAYER : THRUST
 ****************************************************************************/
Player.prototype.thrust = function(force, maxSpeed) {
    let radR = degToRad(this.rotation);
    let radD = degToRad(this.direction);
    let cosR = Math.cos(radR);
    let sinR = Math.sin(radR);
    let cosD = Math.cos(radD);
    let sinD = Math.sin(radD);
    
    let newDX    = this.velocity * cosD + force * cosR;
    let newDY    = this.velocity * sinD + force * sinR;
    let newSpeed = Math.sqrt(newDX * newDX + newDY * newDY);
    let newRot   = Math.atan2(newDY, newDX);
    
    if (newSpeed >= maxSpeed) {
        this.velocity = maxSpeed;
    } else {
        this.velocity = newSpeed;
    }
    this.direction = radToDeg(newRot);
};

/****************************************************************************
 * PLAYER : THROTTLE
 ****************************************************************************/
Player.prototype.throttle = function(force) {
    this.velocity -= force;
    if (this.velocity <= 0) {
        this.velocity = 0;
    }
};

/****************************************************************************
 * PLAYER : FIRE BULLET
 ****************************************************************************/
Player.prototype.fireBullet = function(force) {
    let radR = degToRad(this.rotation);
    let radD = degToRad(this.direction);
    let cosR = Math.cos(radR);
    let sinR = Math.sin(radR);
    let cosD = Math.cos(radD);
    let sinD = Math.sin(radD);
    
    let newDX    = this.velocity * cosD + force * cosR;
    let newDY    = this.velocity * sinD + force * sinR;
    let newSpeed = Math.sqrt(newDX * newDX + newDY * newDY);
    
    // perform a deep copy
    let offsetX  = this.bulletOffset * cosR;
    let offsetY  = this.bulletOffset * sinR;
    let position = [this.center[X] + offsetX, this.center[Y] + offsetY];
    let bullet = new Bullet(position);
    bullet.fire(newSpeed, this.rotation);
    this.bullets.push(bullet);
};

/****************************************************************************
 * PLAYER : UPDATE
 ****************************************************************************/
Player.prototype.update = function() {
    if (this.life < 0) {
        return;
    }
    
    let rad  = degToRad(this.direction);
    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);
    
    this.center[X] += this.velocity * cosA;
    this.center[Y] += this.velocity * sinA;
    
    this.life++;
};

/****************************************************************************
 * PLAYER : DRAW
 ****************************************************************************/
Player.prototype.draw = function(cvs, ctx) {
    if (this.life < 0) {
        return;
    }
    
    if (!cvs) {
        return;
    } else if (!ctx) {
        ctx = cvs.getContext('2d');
    }
    
    let points = [];
    for (let p = 0; p < this.points.length; p++) {
        let point = this.points[p];
        points.push(rotate(point, this.rotation));
    }
    
    fillPolygon(ctx,   this.colorFilling, points, this.center);
    strokePolygon(ctx, this.colorLining,  points, this.center);
};