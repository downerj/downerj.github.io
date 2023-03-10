/****************************************************************************
 * VELOCITY CLASS
 * This class represents a simple 2d velocity (dx, dy).
 * The sign of the Velocity's dx and dy values functions like that of the x
 * and y values of a Point in that positive is right/down and negative is
 * left/up.
 ****************************************************************************/
/*************************************************************************
 * CONSTRUCTOR
 * Input:  dx  Dx Horizontal velocity
 *         dy  Dy Vertical velocity
 *************************************************************************/
function Velocity(dx, dy)
{
   this.dx = dx;
   this.dy = dy;
}
   
/* Define Velocity class methods */
Velocity.prototype = {
   /*************************************************************************
    * ADD DDX
    * Increase the horizontal velocity by an amount ddx.
    * Input:  ddx   Horizontal acceleration
    * Output: <void>
    *************************************************************************/
   addDdx: function(ddx)
   {
      this.dx += ddx;
   },
   
   /*************************************************************************
    * ADD DDY
    * Increase the vertical velocity by an amount ddy.
    * Input:  ddy   Vertical acceleration
    * Output: <void>
    *************************************************************************/
   addDdy: function(ddy)
   {
      this.dy += ddy;
   }
};
