import { getEllipse } from "../canvas.helpers";

describe("getEllipse", () => {
  it("returns correct ellipse for a single point", () => {
    const points = [{ x: 0, y: 0 }];
    const result = getEllipse(points);

    expect(result).toEqual([0, 0, 0, 0, 0, 0, 2 * Math.PI]);
  });

  it("returns correct ellipse for points forming a square", () => {
    const points = [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
    ];

    const result = getEllipse(points);
    const [cx, cy, rx, ry, rot, start, end] = result;

    expect(cx).toBeCloseTo(0);
    expect(cy).toBeCloseTo(0);
    expect(rx).toBeCloseTo(Math.SQRT2);
    expect(ry).toBeCloseTo(Math.SQRT2);
    expect(rot).toBe(0);
    expect(start).toBe(0);
    expect(end).toBeCloseTo(2 * Math.PI);
  });

  it("respects padding", () => {
    const points = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
    ];

    const padding = 1;
    const result = getEllipse(points, padding);
    const [cx, cy, rx, ry] = result;

    expect(cx).toBe(2);
    expect(cy).toBe(0);
    expect(rx).toBe(2 + padding);
    expect(ry).toBe(2 + padding);
  });
});
