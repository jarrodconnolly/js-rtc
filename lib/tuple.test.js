const RtError = require('./rt-error');
const Tuple = require('./tuple');

describe('Tuple', () => {
  describe('Creation', () => {
    test('tuple as point', () => {
      const t = new Tuple(4.3, -4.2, 3.1, Tuple.Type.Point);
      expect(t.x).toBe(4.3);
      expect(t.y).toBe(-4.2);
      expect(t.z).toBe(3.1);
      expect(t.w).toBe(Tuple.Type.Point);
      expect(t.w).not.toBe(Tuple.Type.Vector);
    });

    test('tuple as vector', () => {
      const t = new Tuple(4.3, -4.2, 3.1, Tuple.Type.Vector);
      expect(t.x).toBe(4.3);
      expect(t.y).toBe(-4.2);
      expect(t.z).toBe(3.1);
      expect(t.w).toBe(Tuple.Type.Vector);
      expect(t.w).not.toBe(Tuple.Type.Point);
    });

    test('create point', () => {
      const p = Tuple.point(4, -4, 3);
      expect(p).toEqual(new Tuple(4, -4, 3, Tuple.Type.Point));
    });

    test('create vector', () => {
      const p = Tuple.vector(4, -4, 3);
      expect(p).toEqual(new Tuple(4, -4, 3, Tuple.Type.Vector));
    });
  });

  test('equality', () => {
    const p1 = new Tuple(4.3, -4.2, 3.1, Tuple.Type.Point);
    const p2 = new Tuple(4.3, -4.2, 3.1, Tuple.Type.Point);
    const p3 = new Tuple(4.2, -4.1, 3.0, Tuple.Type.Point);
    const p4 = new Tuple(4.3, -4.2, 3.1, Tuple.Type.Vector);
    expect(p1.equals(p2)).toBe(true);
    expect(p1.equals(p3)).toBe(false);
    expect(p1.equals(p4)).toBe(false);
    expect(() => p1.equals(5)).toThrowError(RtError);
    expect(() => p1.equals(undefined)).toThrowError(RtError);
    expect(() => p1.equals(null)).toThrowError(RtError);
  });

  describe('addition', () => {
    test('tuple + tuple', () => {
      const t1 = new Tuple(3, -2, 5, 1);
      const t2 = new Tuple(-2, 3, 1, 0);
      expect(t1.add(t2)).toEqual(new Tuple(1, 1, 6, 1));
    });

    test('vector + vector', () => {
      const v1 = Tuple.vector(3, 2, 1);
      const v2 = Tuple.vector(5, 6, 7);
      expect(v1.add(v2)).toEqual(Tuple.vector(8, 8, 8));
    });

    test('point + point', () => {
      const p1 = Tuple.point(3, 2, 1);
      const p2 = Tuple.point(5, 6, 7);
      expect(() => p1.add(p2)).toThrowError(RtError);
    });

    test('point + vector', () => {
      const p1 = Tuple.point(1, 5, 2);
      const v1 = Tuple.vector(5, 2, 7);
      expect(p1.add(v1)).toEqual(Tuple.point(6, 7, 9));
    });

    test('vector + point', () => {
      const v1 = Tuple.vector(1, 5, 2);
      const p1 = Tuple.point(5, 2, 7);
      expect(v1.add(p1)).toEqual(Tuple.point(6, 7, 9));
    });
  });

  describe('subtraction', () => {
    test('point - point', () => {
      const p1 = Tuple.point(3, 2, 1);
      const p2 = Tuple.point(5, 6, 7);
      expect(p1.subtract(p2)).toEqual(Tuple.vector(-2, -4, -6));
    });

    test('point - vector', () => {
      const p1 = Tuple.point(3, 2, 1);
      const v1 = Tuple.vector(5, 6, 7);
      expect(p1.subtract(v1)).toEqual(Tuple.point(-2, -4, -6));
    });

    test('vector - point', () => {
      const v1 = Tuple.vector(3, 2, 1);
      const p1 = Tuple.point(3, 2, 1);
      expect(() => v1.subtract(p1)).toThrowError(RtError);
    });

    test('vector - vector', () => {
      const v1 = Tuple.vector(3, 2, 1);
      const v2 = Tuple.vector(5, 6, 7);
      expect(v1.subtract(v2)).toEqual(Tuple.vector(-2, -4, -6));
    });
  });

  describe('negation', () => {
    test('zero vector - vector', () => {
      const zv = Tuple.vector(0, 0, 0);
      const v1 = Tuple.vector(1, -2, 3);
      expect(zv.subtract(v1)).toEqual(Tuple.vector(-1, 2, -3));
    });

    test('negate a tuple', () => {
      const t1 = new Tuple(1, -2, 3, -4);
      expect(t1.negate()).toEqual(new Tuple(-1, 2, -3, 4));
    });
  });

  test('tuple * scalar', () => {
    const t1 = new Tuple(1, -2, 3, -4);
    expect(t1.multiply(3.5)).toEqual(new Tuple(3.5, -7, 10.5, -14));

    const t2 = new Tuple(1, -2, 3, -4);
    expect(t2.multiply(0.5)).toEqual(new Tuple(0.5, -1, 1.5, -2));
  });

  test('tuple / scalar', () => {
    const t1 = new Tuple(1, -2, 3, -4);
    expect(t1.divide(2)).toEqual(new Tuple(0.5, -1, 1.5, -2));
  });

  describe('magnitude', () => {
    test('unit vectors', () => {
      const v1 = Tuple.vector(1, 0, 0);
      const v2 = Tuple.vector(0, 1, 0);
      const v3 = Tuple.vector(0, 0, 1);
      expect(v1.magnitude()).toBe(1);
      expect(v2.magnitude()).toBe(1);
      expect(v3.magnitude()).toBe(1);
    });

    test('non unit vectors', () => {
      const v1 = Tuple.vector(1, 2, -3);
      const v2 = Tuple.vector(-1, -2, -3);
      expect(v1.magnitude()).toBe(Math.sqrt(14));
      expect(v2.magnitude()).toBe(Math.sqrt(14));
    });

    test('only vectors', () => {
      const p1 = Tuple.point(1, 2, -3);
      expect(() => p1.magnitude()).toThrowError(RtError);
    });
  });

  describe('normalize', () => {
    test('vectors', () => {
      const v1 = Tuple.vector(4, 0, 0);
      expect(v1.normalize()).toEqual(Tuple.vector(1, 0, 0));

      const v2 = Tuple.vector(1, 2, 3);
      const divisor = Math.sqrt(14);
      expect(v2.normalize()).toEqual(Tuple.vector(1 / divisor, 2 / divisor, 3 / divisor));
    });

    test('magnitude of', () => {
      const v1 = Tuple.vector(1, 2, 3);
      expect(v1.normalize().magnitude()).toBe(1);
    });

    test('only vectors', () => {
      const p1 = Tuple.point(1, 2, -3);
      expect(() => p1.normalize()).toThrowError(RtError);
    });
  });

  describe('dot product', () => {
    test('two vectors', () => {
      const v1 = Tuple.vector(1, 2, 3);
      const v2 = Tuple.vector(2, 3, 4);
      expect(v1.dotProduct(v2)).toBe(20);
    });

    test('only vectors', () => {
      const v1 = Tuple.vector(1, 2, 3);
      const p1 = Tuple.point(1, 2, -3);
      expect(() => v1.dotProduct(p1)).toThrowError(RtError);
      expect(() => p1.dotProduct(v1)).toThrowError(RtError);
    });
  });
});
