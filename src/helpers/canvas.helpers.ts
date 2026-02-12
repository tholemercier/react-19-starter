import { meanBy } from "src/vendors/lodash";

// A Point in space in a canva
type Point = {
  x: number;
  y: number;
};

/**
 * Calculates the parameters needed to draw a circle (as an ellipse) that wraps all given points,
 * centered on the geometric center (centroid), with optional padding.
 *
 * @param {Point[]} points - An array of points, each with `x` and `y` coordinates.
 * @param {number} [padding=0] - Optional padding to add to the radius of the circle.
 * @returns {Tuple<number, 7>} An array representing ellipse parameters:
 *  [centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle],
 *  suitable for use with CanvasRenderingContext2D's `ellipse()` method.
 *
 * The returned ellipse is a circle (equal radii) centered at the centroid of the points,
 * with a radius equal to the farthest distance from the centroid to any point, plus padding.
 */
export const getEllipse = (points: Point[], padding: number = 0): Tuple<number, 7> => {
  // Take all the x & y values from the points array and return their average.
  // This gives the geometric center (centroid) of those points.
  const centroid = {
    x: meanBy(points, (p) => p.x),
    y: meanBy(points, (p) => p.y),
  };

  const getAdjacentSideLength = (x: number) => x - centroid.x;
  const getOppositeSideLength = (y: number) => y - centroid.y;

  // Get the (longest #hypotenuse) distance between the centroid and the given point
  const getHypotenuseSideLength = (p: Point) => Math.hypot(getAdjacentSideLength(p.x), getOppositeSideLength(p.y));

  // Get the farthest point from the centroid base on the #hypotenuse
  const radius = Math.max(...points.map((p) => getHypotenuseSideLength(p)));

  const radiusWithPadding = radius + padding;
  return [centroid.x, centroid.y, radiusWithPadding, radiusWithPadding, 0, 0, 2 * Math.PI];
};
