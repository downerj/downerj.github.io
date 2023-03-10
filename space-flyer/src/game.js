/****************************************************************************
 * GAME : CONSTANTS
 ****************************************************************************/
const BOUNDS_PADDING   = 10;
const NUM_STARS        = 100;
const STAR_DIR         = randomInt(0, 359);
const STAR_SPEED       = 1;
const PLAYER_MAX_SPEED = 15;
const MAX_BULLET_LIFE  = 100;
const BULLET_FORCE     = 10;
const THRUST_FORCE     = 1;
const THROTTLE_FORCE   = 1;
const ROTATE_ANGLE     = 5;

/****************************************************************************
 * GAME : CONSTRUCTOR
 ****************************************************************************/
function Game(cvs, ctx, fps) {
    // get canvas and context
    this.cvs = gel('cvs');
    this.ctx = this.cvs.getContext('2d');
    
    // initialize logic variables
    this.FPS       = fps;
    this.paused    = false;
    this.callbacks = [];
    
    // set game boundaries
    this.edges = {
        top:    0 - BOUNDS_PADDING,
        left:   0 - BOUNDS_PADDING,
        right:  this.cvs.width  + BOUNDS_PADDING,
        bottom: this.cvs.height + BOUNDS_PADDING,
    };
    
    // create background stars
    this.stars   = [];
    this.STAR_DX = STAR_SPEED * Math.cos(degToRad(STAR_DIR));
    this.STAR_DY = STAR_SPEED * Math.sin(degToRad(STAR_DIR));
    for (let s = 0; s < NUM_STARS; s++) {
        let x = randomInt(this.edges.left, this.edges.right);
        let y = randomInt(this.edges.top,  this.edges.bottom);
        
        this.stars.push({
            center: [x, y],
            color:  colorStringHSL(0, 0, randomInt(30, 100)),
        });
    }
    
    // create the player
    let x = (this.edges.right  - this.edges.left) / 2;
    let y = (this.edges.bottom - this.edges.top)  / 2;
    this.player   = new Player([x, y], this.cvs, this.ctx);
    this.score    = 0;
    this.maxSpeed = PLAYER_MAX_SPEED;
    this.MAX_BULLET_LIFE = MAX_BULLET_LIFE;
}

/****************************************************************************
 * GAME : KEYS MAP
 ****************************************************************************/
Game.prototype.keys = {};

/****************************************************************************
 * GAME: FIRE KEY
 ****************************************************************************/
Game.prototype.fireKey = function(key) {
    if (!this.keys[key]) {
        this.keys[key] = 0;
    }
    this.keys[key]++;
};

/****************************************************************************
 * GAME : RELEASE KEY
 ****************************************************************************/
Game.prototype.releaseKey = function(key) {
    if (this.keys[key]) {
        delete this.keys[key];
    }
};

/****************************************************************************
 * GAME : DETECT INPUT
 ****************************************************************************/
Game.prototype.detectInput = function() {
    if (this.player && !this.paused) {
        if (this.keys.ArrowLeft || this.keys.KeyA) {
            this.player.rotate(+ROTATE_ANGLE);
        } else if (this.keys.ArrowRight || this.keys.KeyD) {
            this.player.rotate(-ROTATE_ANGLE);
        }
        
        if (this.keys.ArrowUp || this.keys.KeyW) {
            this.player.thrust(THRUST_FORCE, this.maxSpeed);
        } else if (this.keys.ArrowDown || this.keys.KeyS) {
            this.player.throttle(THROTTLE_FORCE);
        }
        
        if (this.keys.Space) {
            this.player.fireBullet(BULLET_FORCE);
        }
    }
    
    if (this.keys.KeyP) {
        this.paused = !this.paused;
        this.releaseKey('KeyP');
    }
};

/****************************************************************************
 * GAME : UPDATE
 ****************************************************************************/
Game.prototype.update = function() {
    if (!this.paused) {
        // update the player
        if (this.player) {
            this.player.update();
        }
        
        // update the bullets
        for (let b = 0; b < this.player.bullets.length; b++) {
            if ((this.MAX_BULLET_LIFE <= 0) || (this.player.bullets[b].life <= this.MAX_BULLET_LIFE)) {
                this.player.bullets[b].update();
            } else {
                this.player.bullets[b].kill();
            }
        }
    }

    // update the stars
    for (let s = 0; s < game.stars.length; s++) {
        let star = game.stars[s];
        star.center[X] += game.STAR_DX;
        star.center[Y] += game.STAR_DY;
    }
};

/****************************************************************************
 * GAME : WRAP OBJECTS AROUND BORDERS
 ****************************************************************************/
Game.prototype.wrap = function(entity) {
    if (entity) {
        if (entity.center[X] > this.edges.right) {
            entity.center = [
                this.edges.left,
                this.edges.bottom - entity.center[Y],
            ];
        } else if (entity.center[X] < this.edges.left) {
            entity.center = [
                this.edges.right,
                this.edges.bottom - entity.center[Y],
            ];
        }
        
        if (entity.center[Y] > this.edges.bottom) {
            entity.center = [
                this.edges.right - entity.center[X],
                this.edges.top,
            ];
        } else if (entity.center[Y] < this.edges.top) {
            entity.center = [
                this.edges.right - entity.center[X],
                this.edges.bottom,
            ];
        }
    }
};

/****************************************************************************
 * GAME : DETECT COLLISIONS
 ****************************************************************************/
Game.prototype.detectCollisions = function() {
    if (!this.paused) {
        // wrap the player
        if (this.player) {
            this.wrap(this.player);
        }
        
        // wrap the bullets
        for (let b = 0; b < this.player.bullets.length; b++) {
            this.wrap(this.player.bullets[b]);
        }
    }
    
    // wrap the stars
    for (let s = 0; s < this.stars.length; s++) {
        this.wrap(this.stars[s]);
    }
};

/****************************************************************************
 * GAME : DRAW BACKGROUND
 ****************************************************************************/
Game.prototype.drawBG = function() {
    // draw the black background
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    
    // draw the stars
    for (let s = 0; s < this.stars.length; s++) {
        let star = this.stars[s];
        this.ctx.fillStyle = star.color;
        this.ctx.fillRect(star.center[X], star.center[Y], 2, 2);
    }
};

/****************************************************************************
 * GAME : DRAW FOREGROUND
 ****************************************************************************/
Game.prototype.drawFG = function() {
    // draw player
    if (this.player) {
        this.player.draw(this.cvs, this.ctx);
    }
    
    // draw bullets
    for (let b = 0; b < this.player.bullets.length; b++) {
        this.player.bullets[b].draw(this.cvs, this.ctx);
    }
};

/****************************************************************************
 * GAME : CLEAN UP OLD MEMORY
 ****************************************************************************/
Game.prototype.cleanUp = function() {
    if (!this.paused) {
        if (this.player) {
            if (!this.player.isAlive()) {
                delete this.player;
            } else {
                for (let b = 0; b < this.player.bullets.length; b++) {
                    if (!this.player.bullets[b].isAlive()) {
                        delete this.player.bullets[b];
                        this.player.bullets.splice(b, 1);
                        b--;
                    }
                }
            }
        }
    }
};

/****************************************************************************
 * GAME : ADD CALLBACK
 ****************************************************************************/
Game.prototype.addCallback = function(cb) {
    this.callbacks.push(cb);
};

/****************************************************************************
 * GAME : RUN
 ****************************************************************************/
Game.prototype.run = function() {
    let game = this;
    setInterval(function() {
        game.detectInput();
        game.update();
        game.detectCollisions();
        game.cleanUp();
        game.drawBG();
        game.drawFG();
        
        // fire callbacks
        for (let c = 0; c < game.callbacks.length; c++) {
            game.callbacks[c](game);
        }
    }, 1000/game.FPS);
};