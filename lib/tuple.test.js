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
    expect(p1.equals(5)).toBe(false);
    expect(p1.equals(undefined)).toBe(false);
    expect(p1.equals(null)).toBe(false);
  });
});
