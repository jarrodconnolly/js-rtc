const Ray = require('./ray');
const Tuple = require('./tuple');
const Sphere = require('./sphere');
const Intersect = require('./intersect');

describe('Intersect', () => {
  describe('Intersecting Rays with Spheres', () => {
    test('A ray intersects a sphere at two points', () => {
      const ray = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = Intersect.intersect(s, ray);
      expect(xs[0].t).toEqual(4.0);
      expect(xs[1].t).toEqual(6.0);
    });
    test('A ray intersects a sphere at a tangent', () => {
      const ray = new Ray(Tuple.point(0, 1, -5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = Intersect.intersect(s, ray);
      expect(xs[0].t).toEqual(5.0);
      expect(xs[1].t).toEqual(5.0);
    });
    test('A ray misses a sphere', () => {
      const ray = new Ray(Tuple.point(0, 2, -5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = Intersect.intersect(s, ray);
      expect(xs.length).toEqual(0);
    });
    test('A ray originates inside a sphere', () => {
      const ray = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = Intersect.intersect(s, ray);
      expect(xs[0].t).toEqual(-1.0);
      expect(xs[1].t).toEqual(1.0);
    });
    test('A sphere is behind a ray', () => {
      const ray = new Ray(Tuple.point(0, 0, 5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = Intersect.intersect(s, ray);
      expect(xs[0].t).toEqual(-6.0);
      expect(xs[1].t).toEqual(-4.0);
    });
    test('Intersect sets the object on the intersection', () => {
      const ray = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = Intersect.intersect(s, ray);
      expect(xs.length).toEqual(2);
      expect(xs[0].object).toEqual(s);
      expect(xs[1].object).toEqual(s);
    });
  });

  describe('Tracking intersections', () => {
    test('An intersection encapsulates t and object', () => {
      const s = new Sphere();
      const i = Intersect.intersection(3.5, s);
      expect(i.t).toEqual(3.5);
      expect(i.object).toEqual(s);
    });
    test('Aggregating intersections', () => {
      const s = new Sphere();
      const i1 = Intersect.intersection(1, s);
      const i2 = Intersect.intersection(2, s);
      const xs = Intersect.intersections(i1, i2);
      expect(xs.length).toEqual(2);
      expect(xs[0].t).toEqual(1);
      expect(xs[1].t).toEqual(2);
    });
  });

  describe('Identifying Hits', () => {
    test('The hit, when all intersections have positive t', () => {
      const s = new Sphere();
      const i1 = Intersect.intersection(1, s);
      const i2 = Intersect.intersection(2, s);
      const xs = Intersect.intersections(i2, i1);
      const i = Intersect.hit(xs);
      expect(i).toEqual(i1);
    });
    test('The hit, when some intersections have negative t', () => {
      const s = new Sphere();
      const i1 = Intersect.intersection(-1, s);
      const i2 = Intersect.intersection(1, s);
      const xs = Intersect.intersections(i2, i1);
      const i = Intersect.hit(xs);
      expect(i).toEqual(i2);
    });
    test('The hit, when all intersections have negative t', () => {
      const s = new Sphere();
      const i1 = Intersect.intersection(-2, s);
      const i2 = Intersect.intersection(-1, s);
      const xs = Intersect.intersections(i2, i1);
      const i = Intersect.hit(xs);
      expect(i).toBeUndefined();
    });
    test('The hit is always the lowest nonnegative intersection', () => {
      const s = new Sphere();
      const i1 = Intersect.intersection(5, s);
      const i2 = Intersect.intersection(7, s);
      const i3 = Intersect.intersection(-3, s);
      const i4 = Intersect.intersection(2, s);
      const xs = Intersect.intersections(i1, i2, i3, i4);
      const i = Intersect.hit(xs);
      expect(i).toEqual(i4);
    });
  });
});
