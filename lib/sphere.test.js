const Sphere = require('./sphere');
const Matrix = require('./matrix');
const Transform = require('./transform');
const Ray = require('./ray');
const Tuple = require('./tuple');
const Intersect = require('./intersect');

describe('Sphere', () => {
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
