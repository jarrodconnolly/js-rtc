const Ray = require('./ray');
const Tuple = require('./tuple');
const Sphere = require('./shapes/sphere');
const Intersect = require('./intersect');
const Transform = require('./transform');
const Plane = require('./shapes/plane');
const Helpers = require('./helpers');

describe('Intersect', () => {
  describe('Intersecting Rays with Spheres', () => {
    test('A ray intersects a sphere at two points', () => {
      const ray = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = s.intersect(ray);
      expect(xs[0].t).toEqual(4.0);
      expect(xs[1].t).toEqual(6.0);
    });
    test('A ray intersects a sphere at a tangent', () => {
      const ray = new Ray(Tuple.point(0, 1, -5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = s.intersect(ray);
      expect(xs[0].t).toEqual(5.0);
      expect(xs[1].t).toEqual(5.0);
    });
    test('A ray misses a sphere', () => {
      const ray = new Ray(Tuple.point(0, 2, -5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = s.intersect(ray);
      expect(xs.length).toEqual(0);
    });
    test('A ray originates inside a sphere', () => {
      const ray = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = s.intersect(ray);
      expect(xs[0].t).toEqual(-1.0);
      expect(xs[1].t).toEqual(1.0);
    });
    test('A sphere is behind a ray', () => {
      const ray = new Ray(Tuple.point(0, 0, 5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = s.intersect(ray);
      expect(xs[0].t).toEqual(-6.0);
      expect(xs[1].t).toEqual(-4.0);
    });
    test('Intersect sets the object on the intersection', () => {
      const ray = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      const xs = s.intersect(ray);
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

  describe('Precomputing intersections', () => {
    test('Precomputing the state of an intersection', () => {
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const shape = new Sphere();
      const i = Intersect.intersection(4, shape);
      const comps = Intersect.prepareComputations(i, r);
      expect(comps.t).toEqual(i.t);
      expect(comps.object).toEqual(i.object);
      expect(comps.point).toEqual(Tuple.point(0, 0, -1));
      // using shallowEpsilonEquals to overcome -0 != 0 in jest matchers (Object.is)
      expect(comps.eyev).shallowEpsilonEquals(Tuple.vector(0, 0, -1), 0);
      expect(comps.normalv).toEqual(Tuple.vector(0, 0, -1));
    });
    test('The hit, when an intersection occurs on the outside', () => {
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const shape = new Sphere();
      const i = Intersect.intersection(4, shape);
      const comps = Intersect.prepareComputations(i, r);
      expect(comps.inside).toEqual(false);
    });
    test('The hit, when an intersection occurs on the inside', () => {
      const r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
      const shape = new Sphere();
      const i = Intersect.intersection(1, shape);
      const comps = Intersect.prepareComputations(i, r);
      expect(comps.point).toEqual(Tuple.point(0, 0, 1));
      // using shallowEpsilonEquals to overcome -0 != 0 in jest matchers (Object.is)
      expect(comps.eyev).shallowEpsilonEquals(Tuple.vector(0, 0, -1), 0);
      expect(comps.inside).toEqual(true);
      expect(comps.normalv).shallowEpsilonEquals(Tuple.vector(0, 0, -1));
    });
    test('The hit should offset the point', () => {
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const shape = new Sphere();
      shape.transform = Transform.translation(0, 0, 1);
      const i = Intersect.intersection(5, shape);
      const comps = Intersect.prepareComputations(i, r);
      expect(comps.overPoint.z).toBeLessThan(-Helpers.EPSILON / 2);
      expect(comps.point.z).toBeGreaterThan(comps.overPoint.z);
    });
    test('Precomputing the reflection vector', () => {
      const r = new Ray(Tuple.point(0, 1, -1), Tuple.vector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
      const shape = new Plane();
      const i = Intersect.intersection(Math.SQRT2, shape);
      const comps = Intersect.prepareComputations(i, r);
      expect(comps.reflectv).shallowEpsilonEquals(Tuple.vector(0, Math.SQRT2 / 2, Math.SQRT2 / 2));
    });
    test('Finding n1 and n2 at various intersections', () => {
      const A = Sphere.glassSphere();
      A.transform = Transform.scaling(2, 2, 2);
      A.material.refractiveIndex = 1.5;
      const B = Sphere.glassSphere();
      B.transform = Transform.translation(0, 0, -0.25);
      B.material.refractiveIndex = 2.0;
      const C = Sphere.glassSphere();
      C.transform = Transform.translation(0, 0, 0.25);
      C.material.refractiveIndex = 2.5;
      const r = new Ray(Tuple.point(0, 0, -4), Tuple.vector(0, 0, 1));
      const xs = Intersect.intersections(
        Intersect.intersection(2, A),
        Intersect.intersection(2.75, B),
        Intersect.intersection(3.25, C),
        Intersect.intersection(4.75, B),
        Intersect.intersection(5.25, C),
        Intersect.intersection(6, A)
      );
      const testValues = [
        [1.0, 1.5],
        [1.5, 2.0],
        [2.0, 2.5],
        [2.5, 2.5],
        [2.5, 1.5],
        [1.5, 1.0],
      ];
      testValues.forEach((v, i) => {
        const comps = Intersect.prepareComputations(xs[i], r, xs);
        expect(comps.n1).toEqual(v[0]);
        expect(comps.n2).toEqual(v[1]);
      });
    });
    test('The under point is offset below the surface', () => {
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const shape = Sphere.glassSphere();
      shape.transform = Transform.translation(0, 0, 1);
      const i = Intersect.intersection(5, shape);
      const xs = Intersect.intersections(i);
      const comps = Intersect.prepareComputations(i, r, xs);
      expect(comps.underPoint.z).toBeGreaterThan(Helpers.EPSILON / 2);
      expect(comps.point.z).toBeLessThan(comps.underPoint.z);
    });
    test('The Schlick approximation under total internal reflection', () => {
      const shape = Sphere.glassSphere();
      const r = new Ray(Tuple.point(0, 0, Math.SQRT2 / 2), Tuple.vector(0, 1, 0));
      const xs = Intersect.intersections(
        Intersect.intersection(-Math.SQRT2 / 2, shape),
        Intersect.intersection(Math.SQRT2 / 2, shape)
      );
      const comps = Intersect.prepareComputations(xs[1], r, xs);
      const reflectance = Intersect.schlick(comps);
      expect(reflectance).toEqual(1.0);
    });
    test('The Schlick approximation with a perpendicular viewing angle', () => {
      const shape = Sphere.glassSphere();
      const r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 1, 0));
      const xs = Intersect.intersections(
        Intersect.intersection(-1, shape),
        Intersect.intersection(1, shape)
      );
      const comps = Intersect.prepareComputations(xs[1], r, xs);
      const reflectance = Intersect.schlick(comps);
      expect(reflectance).shallowEpsilonEquals(0.04, 5);
    });
    test('The Schlick approximation with small angle and n2 > n1', () => {
      const shape = Sphere.glassSphere();
      const r = new Ray(Tuple.point(0, 0.99, -2), Tuple.vector(0, 0, 1));
      const xs = Intersect.intersections(Intersect.intersection(1.8589, shape));
      const comps = Intersect.prepareComputations(xs[0], r, xs);
      const reflectance = Intersect.schlick(comps);
      expect(reflectance).shallowEpsilonEquals(0.48873, 5);
    });
  });
});
