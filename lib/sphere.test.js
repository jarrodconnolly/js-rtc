const Sphere = require('./sphere');
const Matrix = require('./matrix');
const Transform = require('./transform');
const Ray = require('./ray');
const Tuple = require('./tuple');
const Intersect = require('./intersect');
const Material = require('./materials');

describe('Sphere', () => {
  describe('Sphere transformation', () => {
    test('A sphere\'s default transformation', () => {
      const s = new Sphere();
      expect(s.transform).matrixEquals(Matrix.getIdentity());
    });
    test('Changing a sphere\'s transformation', () => {
      const s = new Sphere();
      const t = Transform.translation(2, 3, 4);
      s.transform = t;
      expect(s.transform).matrixEquals(t);
    });
  });

  describe('Sphere intersection', () => {
    test('Intersecting a scaled sphere with a ray', () => {
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const s = new Sphere();
      s.transform = Transform.scaling(2, 2, 2);
      const xs = Intersect.intersect(s, r);
      expect(xs.length).toEqual(2);
      expect(xs[0].t).toEqual(3);
      expect(xs[1].t).toEqual(7);
    });
  });

  describe('Sphere normals', () => {
    test('The normal on a sphere at a point on the x axis', () => {
      const s = new Sphere();
      const n = s.normalAt(Tuple.point(1, 0, 0));
      expect(n).toEqual(Tuple.vector(1, 0, 0));
    });
    test('The normal on a sphere at a point on the y axis', () => {
      const s = new Sphere();
      const n = s.normalAt(Tuple.point(0, 1, 0));
      expect(n).toEqual(Tuple.vector(0, 1, 0));
    });
    test('The normal on a sphere at a point on the z axis', () => {
      const s = new Sphere();
      const n = s.normalAt(Tuple.point(0, 0, 1));
      expect(n).toEqual(Tuple.vector(0, 0, 1));
    });
    test('The normal is a normalized vector', () => {
      const s = new Sphere();
      const p = Tuple.point(Math.sqrt(3 / 3), Math.sqrt(3 / 3), Math.sqrt(3 / 3));
      const n = s.normalAt(p);
      expect(n).toEqual(n.normalize());
    });
    test('Computing the normal on a translated sphere', () => {
      const s = new Sphere();
      s.transform = Transform.translation(0, 1, 0);
      const p = Tuple.point(0, 1.70711, -0.70711);
      const n = s.normalAt(p);
      expect(n).shallowEpsilonEquals(Tuple.vector(0, 0.707110, -0.70711), 5);
    });
    test('Computing the normal on a transformed sphere', () => {
      const s = new Sphere();
      const m = Transform.scaling(1, 0.5, 1).multiply(Transform.rotationZ(Math.PI / 5));
      s.transform = m;
      const p = Tuple.point(0, Math.sqrt(2 / 2), -Math.sqrt(2 / 2));
      const n = s.normalAt(p);
      expect(n).shallowEpsilonEquals(Tuple.vector(0, 0.97014, -0.24254), 5);
    });
  });

  describe('Sphere materials', () => {
    test('A sphere has a default material', () => {
      const s = new Sphere();
      const m = s.material;
      expect(m).toEqual(new Material());
    });
    test('A sphere may be assigned a material', () => {
      const s = new Sphere();
      const m = new Material();
      m.ambient = 1;
      s.material = m;
      expect(s.material).toEqual(m);
    });
  });
});
