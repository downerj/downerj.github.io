/****************************************************************************
 * RANDOMIZE
 * This function generates a number equal-to-or-greater-than a minimum value
 * and less than a maximum value.
 * Input:  minimum   Min value
 *         maximum   Max value
 * Output: <float>   Random value
 ****************************************************************************/  
function randomize(minimum, maximum)
{
   return Math.random() * (maximum - minimum) + minimum;
}

var hexvals = '0123456789abcdef';

/****************************************************************************
 * RANDOM COLOR
 * 
 ****************************************************************************/ 
function randomColor()
{
   var color = '#';
   
   for (var i = 0; i < 6; i++)
      color += hexvals.charAt(randomize(0, hexvals.length + 1));
      
   return color;
}
