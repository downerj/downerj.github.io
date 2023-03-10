// Globals
var canvas = getDOM('gc');
var ctx;
var boundRect;
var ballvec;
var lblCollisions;
var collisions;
var clicked;
var mousePos;
var ballCount;
var fps;
var maxBallDim;
var maxInitVel;

/****************************************************************************
 * MAIN
 * This is the JavaScript entry point for the program.
 * Here the canvas is initialized and the drawAll() callback is run.
 * Input:  <void>
 * Output: <void>
 ****************************************************************************/
function main()
{
   // Center canvas on the screen (via encasing <p> DOM)
   getDOM('divCanvas').style.textAlign = 'center';
   getDOM('divCollisions').style.visibility = 'hidden';
   
   // Prepare to draw in 2D
   ctx = canvas.getContext('2d');
   
   // Set canvas dimensions
   canvas.width = window.innerWidth - 10;
   canvas.height = window.innerHeight - 100;
   boundRect = canvas.getBoundingClientRect();
   
   // Initialize other globals
   ballvec = [];
   lblCollisions = getDOM('lblCollisions');
   collisions = 0;
   clicked = false;
   mousePos = null;
   ballCount = 100;
   fps = 1000;
   maxBallDim = 15;
   maxInitVel = 2;
   
   // Initialize the ball objects
   for (i = 0; i < ballCount; i++)
   {
      var pt = genPointOnCanvas();
      var vel = genVelocity();
      var w = h = maxBallDim;
      var dim = new Dimensions(w, h);
      var color = randomColor();
      var ball = new Ball(ctx, dim, pt, vel, color)
      
      ballvec.push(ball);
   }
   
   // Loop drawAll() callback at framerate/fps
   setInterval(drawAll, 1000/fps);
}

/****************************************************************************
 * DRAW ALL
 * This is the callback which draws everything to the screen.
 * Here collision detection and object movement are also handled.
 * Input:  <void>
 * Output: <void>
 ****************************************************************************/
function drawAll()
{
   // Draw a black background
   ctx.fillStyle = '#000000';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
   
   // Draw and update each ball
   for (i = 0; i < ballvec.length; i++)
   {
      ballvec[i].draw();
      ballvec[i].move();
      detectCollisions(ballvec[i]);
      // Update the collisions <label> DOM
      lblCollisions.innerHTML = collisions;
      
      // Run ball's click subroutine if the mouse was clicked and
      // if the cursor was within the ball, and then reset the clicked flag
      if (clicked && ballvec[i].hasPoint(mousePos))
      {
         ballvec[i].click();
         clicked = false;
      }
   }
}

/****************************************************************************
 * GENERATE POINT ON CANVAS
 * This function generates a random x-y point within the canvas element 
 * boundaries.
 * Input:  <void>
 * Output: <Point object>
 ****************************************************************************/
function genPointOnCanvas()
{
   var x = randomize(0, canvas.width - maxBallDim - 1);
   var y = randomize(0, canvas.height - maxBallDim - 1);
   return new Point(x, y);
}

/****************************************************************************
 * GENERATE VELOCITY
 * This function generates a random dx-dy velocity object.
 * Input:  <void>
 * Output: <Velocity object>
 ****************************************************************************/
function genVelocity()
{
   var dx = randomize(-maxInitVel, maxInitVel);
   var dy = randomize(-maxInitVel, maxInitVel);
   return new Velocity(dx, dy);
}

/****************************************************************************
 * DETECT COLLISIONS
 * This function determines if the ball has collided with anything else.
 * Currently this is only set to collide with the canvas boundaries.
 * Input:  ball   Ball object
 * Output: <void>
 ****************************************************************************/
function detectCollisions(ball)
{
   // Detect if ball hit left or right wall
   if (ball.pos.x + ball.dim.w + ball.vel.dx >= canvas.width ||
       ball.pos.x <= 0)
   {
      ball.vel.dx = -ball.vel.dx;
      collisions++;
   }
   
   // Detect if ball hit top or bottom wall
   if (ball.pos.y + ball.dim.h + ball.vel.dy >= canvas.height ||
       ball.pos.y <= 0)
   {
      ball.vel.dy = -ball.vel.dy;
      collisions++;
   }
}

/****************************************************************************
 * GET DOCUMENT OBJECT MODEL
 * This function gets a document object model (DOM) from the HTML document
 * (e.g. a <p> or <label> element) using a given id.
 * Input:  id  DOM ID
 * Output: <DOM Object>
 ****************************************************************************/
function getDOM(id)
{
   return document.getElementById(id);
}

/****************************************************************************
 * REPOSITION OBJECTS
 * This function asserts that all objects are drawn within the canvas 
 * boundaries and, if not, repositions them to random coordinates.
 * Input:  <void>
 * Output: <void>
 ****************************************************************************/
function repositionObjects()
{
   for (i = 0; i < ballvec.length; i++)
   {
      if (!isInCanvas(ballvec[i]))
         ballvec[i].pos = genPointOnCanvas();
   }
}

/****************************************************************************
 * IS IN CANVAS
 * This function deterines is an object is within the canvas boundaries.
 * Input:  ball   Ball object
 * Output: <boolean>
 ****************************************************************************/
function isInCanvas(ball)
{
   return ball.pos.x >= 0 && ball.pos.x + ball.dim.w <= canvas.width &&
          ball.pos.y >= 0 && ball.pos.y + ball.dim.h <= canvas.height;
}

/****************************************************************************
 * WINDOW RESIZE CALLBACK
 * This functon is called when the browser window resizes.
 * Here data is updated, the canvas is stretched, and objects are 
 * repositioned, if necessary.
 * Input:  <void>
 * Output: <void>
 ****************************************************************************/
window.onresize = function()
{
   // Resize the canvas
   canvas.width = window.innerWidth - 100;
   canvas.height = window.innerHeight - 100;
   // Update bounding rectangle (used for updating cursor position)
   boundRect = canvas.getBoundingClientRect();
   // Reposition any object outside of the canvas
   repositionObjects();
   
   console.log(
      'canvas @ (' + boundRect.top + ', ' + boundRect.left + ')'
   );
}

/****************************************************************************
 * CANVAS MOUSE DOWN CALLBACK
 * This function is called when the mouse is clicked within the canvas.
 * Here flags are toggled to create effects in the drawAll() loop.
 * Input:  event  Mousedown event
 * Output: <void> 
 ****************************************************************************/
canvas.onmousedown = function(event)
{
   clicked = true;
   var x = parseInt(event.clientX - boundRect.left);
   var y = parseInt(event.clientY - boundRect.top);
   mousePos = new Point(x, y);
   
   console.log('mouseclick @ (' + x + ', ' + y + ')');
}
