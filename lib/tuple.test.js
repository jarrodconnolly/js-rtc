const RtError = require('./rt-error');
const Tuple = require('./tuple');

describe('Tuple', () => {
  test('is a point', () => {
    const t = new Tuple(4.3, -4.2, 3.1, Tuple.Type.Point);
    expect(t.x).toBe(4.3);
    expect(t.y).toBe(-4.2);
    expect(t.z).toBe(3.1);
    expect(t.w).toBe(Tuple.Type.Point);
    expect(t.w).not.toBe(Tuple.Type.Vector);
  });

  test('is a vector', () => {
    const t = new Tuple(4.3, -4.2, 3.1, Tuple.Type.Vector);
    expect(t.x).toBe(4.3);
    expect(t.y).toBe(-4.2);
    expect(t.z).toBe(3.1);
    expect(t.w).toBe(Tuple.Type.Vector);
    expect(t.w).not.toBe(Tuple.Type.Point);
  });

  test('point creator', () => {
    const p = Tuple.point(4, -4, 3);
    expect(p).toEqual(new Tuple(4, -4, 3, Tuple.Type.Point));
  });

  test('vector creator', () => {
    const p = Tuple.vector(4, -4, 3);
    expect(p).toEqual(new Tuple(4, -4, 3, Tuple.Type.Vector));
  });

  test('equality', () => {
    const p1 = new Tuple(4.3, -4.2, 3.1, Tuple.Type.Point);
    const p2 = new Tuple(4.3, -4.2, 3.1, Tuple.Type.Point);
    const p3 = new Tuple(4.2, -4.1, 3.0, Tuple.Type.Point);

    expect(p1.equals(p2)).toBe(true);
    expect(p1.equals(p3)).toBe(false);
    // expect(p1.equals(5)).toBe(false);
    // expect(p1.equals(undefined)).toBe(false);
    // expect(p1.equals(null)).toBe(false);

    expect(() => p1.equals(5)).toThrowError(RtError);
  });

  test('addition: tuple + tuple', () => {
    const t1 = new Tuple(3, -2, 5, 1);
    const t2 = new Tuple(-2, 3, 1, 0);
    expect(t1.add(t2)).toEqual(new Tuple(1, 1, 6, 1));
  });

  test('addition: vector + vector', () => {
    const v1 = Tuple.vector(3, 2, 1);
    const v2 = Tuple.vector(5, 6, 7);
    expect(v1.add(v2)).toEqual(Tuple.vector(8, 8, 8));
  });

  test('addition: point + point', () => {
    const p1 = Tuple.point(3, 2, 1);
    const p2 = Tuple.point(5, 6, 7);
    expect(() => p1.add(p2)).toThrowError(RtError);
  });

  test('addition: point + vector', () => {
    const p1 = Tuple.point(1, 5, 2);
    const v1 = Tuple.vector(5, 2, 7);
    expect(p1.add(v1)).toEqual(Tuple.point(6, 7, 9));
  });

  test('addition: vector + point', () => {
    const v1 = Tuple.vector(1, 5, 2);
    const p1 = Tuple.point(5, 2, 7);
    expect(v1.add(p1)).toEqual(Tuple.point(6, 7, 9));
  });

  test('subtraction: point - point', () => {
    const p1 = Tuple.point(3, 2, 1);
    const p2 = Tuple.point(5, 6, 7);
    expect(p1.subtract(p2)).toEqual(Tuple.vector(-2, -4, -6));
  });

  test('subtraction: point - vector', () => {
    const p1 = Tuple.point(3, 2, 1);
    const v1 = Tuple.vector(5, 6, 7);
    expect(p1.subtract(v1)).toEqual(Tuple.point(-2, -4, -6));
  });

  test('subtraction: vector - point', () => {
    const v1 = Tuple.vector(3, 2, 1);
    const p1 = Tuple.point(3, 2, 1);
    expect(() => v1.subtract(p1)).toThrowError(RtError);
  });

  test('subtraction: vector - vector', () => {
    const v1 = Tuple.vector(3, 2, 1);
    const v2 = Tuple.vector(5, 6, 7);
    expect(v1.subtract(v2)).toEqual(Tuple.vector(-2, -4, -6));
  });

  test('subtraction: zero vector - vector', () => {
    const zv = Tuple.vector(0, 0, 0);
    const v1 = Tuple.vector(1, -2, 3);
    expect(zv.subtract(v1)).toEqual(Tuple.vector(-1, 2, -3));
  });

  test('negation: negate a tuple', () => {
    const t1 = new Tuple(1, -2, 3, -4);
    expect(t1.negate()).toEqual(new Tuple(-1, 2, -3, 4));
  });
});
