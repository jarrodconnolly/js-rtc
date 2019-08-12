const Ray = require('./ray');
const Tuple = require('./tuple');
const Transform = require('./transform');

describe('Ray', () => {
  describe('Creating Rays', () => {
    test('Creating and querying a ray', () => {
      const origin = Tuple.point(1, 2, 3);
      const direction = Tuple.vector(4, 5, 6);
      const ray = new Ray(origin, direction);

      expect(ray.origin).toEqual(origin);
      expect(ray.direction).toEqual(direction);
    });
    test('Computing a point from a distance', () => {
      const ray = new Ray(Tuple.point(2, 3, 4), Tuple.vector(1, 0, 0));
      expect(ray.position(0)).toEqual(Tuple.point(2, 3, 4));
      expect(ray.position(1)).toEqual(Tuple.point(3, 3, 4));
      expect(ray.position(-1)).toEqual(Tuple.point(1, 3, 4));
      expect(ray.position(2.5)).toEqual(Tuple.point(4.5, 3, 4));
    });
  });
  describe('Ray transformations', () => {
    test('Translating a ray', () => {
      const r = new Ray(Tuple.point(1, 2, 3), Tuple.vector(0, 1, 0));
      const m = Transform.translation(3, 4, 5);
      const r2 = Ray.transform(r, m);
      expect(r2.origin).toEqual(Tuple.point(4, 6, 8));
      expect(r2.direction).toEqual(Tuple.vector(0, 1, 0));
    });
    test('Scaling a ray', () => {
      const r = new Ray(Tuple.point(1, 2, 3), Tuple.vector(0, 1, 0));
      const m = Transform.scaling(2, 3, 4);
      const r2 = Ray.transform(r, m);
      expect(r2.origin).toEqual(Tuple.point(2, 6, 12));
      expect(r2.direction).toEqual(Tuple.vector(0, 3, 0));
    });
  });
});
