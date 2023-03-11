/****************************************************************************
 * BALL CLASS
 * This class represents a ball object (currently drawn as a square) that
 * has 2 dimensions (length and width), an (x, y) position, a <dx, dy>
 * velocity and a color.
 * This object also stores the creator's context taken from the HTML Canvas
 * DOM.
 ****************************************************************************/

/*************************************************************************
 * CONSTRUCTOR
 * Input:  ctx    HTML <canvas> context
 *         dim    Dimensions object (width & height)
 *         pos    Position/Point object (x & y)
 *         vel    Velocity object (dx & dy)
 *         color  Hex-string color (e.g. '#ff0000')
 *************************************************************************/
function Ball(ctx, dim, pos, vel, color)
{
   this.ctx = ctx;
   this.dim = dim;
   this.pos = pos;
   this.vel = vel;
   this.color = color;
}

/* Define Ball class methods */
Ball.prototype = {
   /*************************************************************************
    * DRAW
    * Draw ball to the screen
    * Input:  <void>
    * Output: <void>
    *************************************************************************/
   draw: function()
   {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
   },
      
   /*************************************************************************
    * MOVE
    * Move the ball according to internal velocity values
    * Input:  <void>
    * Output: <void>
    *************************************************************************/
   move: function()
   {
      this.pos.x += this.vel.dx;
      this.pos.y += this.vel.dy;
   },
      
   /*************************************************************************
    * HAS POINT
    * Determine if a point is within the ball
    * Input:  pt  Point/Position object
    * Output: <boolean>
    *************************************************************************/
   hasPoint: function(pt)
   {
      return (pt.x >= this.pos.x) && (pt.x <= this.pos.x + this.dim.w) &&
             (pt.y >= this.pos.y) && (pt.y <= this.pos.y + this.dim.h);
   },
      
   /*************************************************************************
    * CLICK
    * Mouse left-click callback
    * Reverse the ball's direction and speed it up
    * Input:  <void>
    * Output: <void>
    *************************************************************************/
   click: function()
   {
      this.vel.dx = -(this.vel.dx * 1.15);
      this.vel.dy = -(this.vel.dy * 1.15);
   }
};
