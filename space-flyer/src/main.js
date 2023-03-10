/****************************************************************************
 * WINDOW : ON LOAD / MAIN
 ****************************************************************************/
window.addEventListener('load', function winMain() {
    let cvs = gel('cvs');
    let ctx = cvs.getContext('2d');
    let fps = 30;
    
    let lblScore       = gel('lblScore');
    let lblPaused      = gel('lblPaused');
    let lblPositionX   = gel('lblPositionX');
    let lblPositionY   = gel('lblPositionY');
    let lblPositionNX  = gel('lblPositionNX');
    let lblPositionNY  = gel('lblPositionNY');
    let lblSpeedDR     = gel('lblSpeedDR');
    let lblSpeedDX     = gel('lblSpeedDX');
    let lblSpeedDY     = gel('lblSpeedDY');
    let lblRotationN   = gel('lblRotationN');
    let lblDirectionN  = gel('lblDirectionN');
    let lblBulletCount = gel('lblBulletCount');
    
    this.game = new Game(cvs, ctx, fps);
    this.game.addCallback(function updateHTML(game) {
        lblScore.innerText  = game.score;
        lblPaused.innerText = game.paused;
        
        let player = game.player;
        lblPositionX.innerText  = round(player.center[X]);
        lblPositionY.innerText  = round(player.center[Y]);
        
        let width  = game.edges.right  - game.edges.left;
        let height = game.edges.bottom - game.edges.top;
        lblPositionNX.innerText = round(player.center[X] - width  / 2);
        lblPositionNY.innerText = round(height / 2 - player.center[Y]);
        lblSpeedDR.innerText    = round(player.velocity,   1);
        lblDirectionN.innerText = round((360 - player.direction) % 360, 1);
        lblRotationN.innerText  = round((360 - player.rotation)  % 360, 1);
        
        let rad = degToRad(player.direction);
        lblSpeedDX.innerText   = round(player.velocity * Math.cos(rad), 1);
        lblSpeedDY.innerText   = round(player.velocity * Math.sin(rad), 1);
        
        lblBulletCount.innerText = player.bullets.length;
    });
    this.game.run();
});

/****************************************************************************
 * WINDOW : ON KEY DOWN
 ****************************************************************************/
window.addEventListener('keydown', function winKeyDown(event) {
    if (!this.game) {
        return;
    }
    
    this.game.fireKey(event.code);
});

/****************************************************************************
 * WINDOW : ON KEY UP
 ****************************************************************************/
window.addEventListener('keyup', function winKeyUp(event) {
    if (!this.game) {
        return;
    }
    
    this.game.releaseKey(event.code);
});