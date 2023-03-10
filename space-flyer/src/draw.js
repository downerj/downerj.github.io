/****************************************************************************
 * DRAW : CONSTANTS
 ****************************************************************************/
const LINE_WIDTH   = 2;
const POINT_WIDTH  = 5;
const POINT_HEIGHT = 5

/****************************************************************************
 * DRAW : ITERATE POLYGON
 ****************************************************************************/
function __iteratePolygon__(ctx, points, center) {
    center = center || [0, 0];
    ctx.beginPath();
    ctx.moveTo(points[0][X] + center[X], points[0][Y] + center[Y]);
    for (let p = 1; p < points.length; p++) {
        ctx.lineTo(points[p][X] + center[X], points[p][Y] + center[Y]);
    }
    ctx.closePath();
}

/****************************************************************************
 * DRAW : STROKE POLYGON
 ****************************************************************************/
function strokePolygon(ctx, color, points, center) {
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = color;
    __iteratePolygon__(ctx, points, center);
    ctx.stroke();
}

/****************************************************************************
 * DRAW : FILL POLYGON
 ****************************************************************************/
function fillPolygon(ctx, color, points, center) {
    ctx.fillStyle = color;
    __iteratePolygon__(ctx, points, center);
    ctx.fill();
}

/****************************************************************************
 * DRAW : DRAW POINT
 ****************************************************************************/
function drawPoint(ctx, position, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(position[X], position[Y], POINT_WIDTH, POINT_HEIGHT);
    ctx.fill();
}
