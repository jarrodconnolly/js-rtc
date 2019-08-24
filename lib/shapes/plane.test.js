const Plane = require('./plane');
const Tuple = require('../tuple');
const Ray = require('../ray');

describe('Plane', () => {
  test('The normal of a plane is constant everywhere', () => {
    const p = new Plane();
    const n1 = p.localNormalAt(Tuple.point(0, 0, 0));
    const n2 = p.localNormalAt(Tuple.point(10, 0, -10));
    const n3 = p.localNormalAt(Tuple.point(-5, 0, 150));
    expect(n1).toEqual(Tuple.vector(0, 1, 0));
    expect(n2).toEqual(Tuple.vector(0, 1, 0));
    expect(n3).toEqual(Tuple.vector(0, 1, 0));
  });
  test('Intersect with a ray parallel to the plane', () => {
    const p = new Plane();
    const r = new Ray(Tuple.point(0, 10, 0), Tuple.vector(0, 0, 1));
    const xs = p.intersect(r);
    expect(xs).toHaveLength(0);
  });
  test('Intersect with a coplanar ray', () => {
    const p = new Plane();
    const r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
    const xs = p.intersect(r);
    expect(xs).toHaveLength(0);
  });
  test('A ray intersecting a plane from above', () => {
    const p = new Plane();
    const r = new Ray(Tuple.point(0, 1, 0), Tuple.vector(0, -1, 0));
    const xs = p.intersect(r);
    expect(xs).toHaveLength(1);
    expect(xs[0].t).toEqual(1);
    expect(xs[0].object).toEqual(p);
  });
  test('A ray intersecting a plane from below', () => {
    const p = new Plane();
    const r = new Ray(Tuple.point(0, -1, 0), Tuple.vector(0, 1, 0));
    const xs = p.intersect(r);
    expect(xs).toHaveLength(1);
    expect(xs[0].t).toEqual(1);
    expect(xs[0].object).toEqual(p);
  });
});
