
const TestShape = require('./testShape');
const Matrix = require('./matrix');
const Transform = require('./transform');
const Material = require('./materials');
const Ray = require('./ray');
const Tuple = require('./tuple');
const Shape = require('./shape');
const RtError = require('./rt-error');

describe('TestShape', () => {
  test('The default transformation', () => {
    const s = new TestShape();
    expect(s.transform).matrixEquals(Matrix.getIdentity());
  });
  test('Changing a sphere\'s transformation', () => {
    const s = new TestShape();
    const t = Transform.translation(2, 3, 4);
    s.transform = t;
    expect(s.transform).matrixEquals(Transform.translation(2, 3, 4));
  });
  test('The default material', () => {
    const s = new TestShape();
    const m = s.material;
    expect(m).toEqual(new Material());
  });
  test('Assigning a material', () => {
    const s = new TestShape();
    const m = new Material();
    m.ambient = 1;
    s.material = m;
    expect(s.material).toEqual(m);
  });
  test('Intersecting a scaled shape with a ray', () => {
    const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
    const s = new TestShape();
    s.transform = Transform.scaling(2, 2, 2);
    s.intersect(r);
    expect(s.savedRay.origin).toEqual(Tuple.point(0, 0, -2.5));
    expect(s.savedRay.direction).toEqual(Tuple.vector(0, 0, 0.5));
  });
  test('Intersecting a translated shape with a ray', () => {
    const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
    const s = new TestShape();
    s.transform = Transform.translation(5, 0, 0);
    s.intersect(r);
    expect(s.savedRay.origin).toEqual(Tuple.point(-5, 0, -5));
    expect(s.savedRay.direction).toEqual(Tuple.vector(0, 0, 1));
  });
  test('Computing the normal on a translated shape', () => {
    const s = new TestShape();
    s.transform = Transform.translation(0, 1, 0);
    const n = s.normalAt(Tuple.point(0, 1.70711, -0.70711));
    expect(n).shallowEpsilonEquals(Tuple.vector(0, 0.70711, -0.70711), 5);
  });
  test('Computing the normal on a transformed shape', () => {
    const s = new TestShape();
    s.transform = Transform.scaling(1, 0.5, 1).multiply(Transform.rotationZ(Math.PI / 5));
    const n = s.normalAt(Tuple.point(0, Math.SQRT2 / 2, -Math.SQRT2 / 2));
    expect(n).shallowEpsilonEquals(Tuple.vector(0, 0.97014, -0.24254), 5);
  });
  test('Make sure we test calling localNormalAt in the base shape', () => {
    class FakeShape extends Shape {}
    const s = new FakeShape();
    expect(() => s.normalAt(Tuple.point(0, 0, 0))).toThrowError(RtError);
  });
});
