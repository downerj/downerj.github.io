/****************************************************************************
 * UTILITIES : CONSTANTS
 ****************************************************************************/
// index constants for accessing point/velocity arrays
const X  = 0;
const Y  = 1;
const DX = 0;
const DY = 1;

/****************************************************************************
 * UTILITIES : GET DOCUMENT ELEMENT BY ID (ALIAS)
 ****************************************************************************/
function gel(id) {
    return document.getElementById(id);
}

/****************************************************************************
 * UTILITIES : DEGREES TO RADIANS
 ****************************************************************************/
function degToRad(deg) {
    return deg * Math.PI / 180.0;
}

/****************************************************************************
 * UTILITIES : RADIANS TO DEGREES
 ****************************************************************************/
function radToDeg(rad) {
    return rad * 180.0 / Math.PI;
}

/****************************************************************************
 * UTILITIES : ROTATE POINT ABOUT AN ANGLE AND CENTER
 ****************************************************************************/
function rotate(point, deg, center) {
    if (!deg) {
        return point;
    }
    
    center = center || [0, 0];
    
    let rad = degToRad(deg);
    let x   = point[X];
    let y   = point[Y];
    let h   = center[X];
    let k   = center[Y];
    
    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);
    
    let xp = x * cosA - y * sinA + h;
    let yp = y * cosA + x * sinA + k;
    
    return [xp, yp];
}

/****************************************************************************
 * UTILITIES : ROUND NUMBER TO DECIMAL PLACES
 ****************************************************************************/
function round(number, decimalPlaces) {
    if (!decimalPlaces) {
        return Math.round(number);
    }
    
    let powerOfTen = Math.pow(10, decimalPlaces);
    number = Math.round(number * powerOfTen) / powerOfTen;
    return number;
}

/****************************************************************************
 * UTILITIES : GENERATE RANDOM INTEGER BETWEEN MIN AND MAX (INCLUSIVE)
 ****************************************************************************/
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/****************************************************************************
 * UTILITIES : CONVERT RGB COLOR TO HEX STRING
 ****************************************************************************/
function colorStringRGB(r, g, b) {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

/****************************************************************************
 * UTILITIES : CONVERT HSL COLOR TO HEX STRING
 ****************************************************************************/
function colorStringHSL(h, s, l) {
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}