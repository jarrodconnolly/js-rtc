const World = require('./world');
const PointLight = require('./lights');
const Sphere = require('./sphere');
const Transform = require('./transform');
const Colour = require('./colour');
const Tuple = require('./tuple');
const Ray = require('./ray');
const Intersect = require('./intersect');

const defaultWorld = () => {
  const light = new PointLight(Tuple.point(-10, 10, -10), new Colour(1, 1, 1));
  const s1 = new Sphere();
  s1.material.colour = new Colour(0.8, 1.0, 0.6);
  s1.material.diffuse = 0.7;
  s1.material.specular = 0.2;
  const s2 = new Sphere();
  s2.transform = Transform.scaling(0.5, 0.5, 0.5);
  return new World(light, [s1, s2]);
};

describe('World', () => {
  describe('Creation', () => {
    test('Creating a world', () => {
      const w = new World();
      expect(w.light).toBeUndefined();
      expect(w.objects).toBeInstanceOf(Array);
      expect(w.objects).toHaveLength(0);
    });
    test('The default world', () => {
      const light = new PointLight(Tuple.point(-10, 10, -10), new Colour(1, 1, 1));
      const w = defaultWorld();
      expect(w.light).toEqual(light);
      expect(w.objects).toHaveLength(2);
    });
  });

  describe('Intersection', () => {
    test('Intersect a world with a ray', () => {
      const w = defaultWorld();
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const xs = w.intersectWorld(r);
      expect(xs).toHaveLength(4);
      expect(xs[0].t).toEqual(4);
      expect(xs[1].t).toEqual(4.5);
      expect(xs[2].t).toEqual(5.5);
      expect(xs[3].t).toEqual(6);
    });
  });

  describe('Shading', () => {
    test('Shading an intersection', () => {
      const w = defaultWorld();
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const shape = w.objects[0];
      const i = Intersect.intersection(4, shape);
      const comps = Intersect.prepareComputations(i, r);
      const c = w.shadeHit(comps);
      expect(c).shallowEpsilonEquals(new Colour(0.38066, 0.47583, 0.2855), 5);
    });
    test('Shading an intersection from the inside', () => {
      const w = defaultWorld();
      w.light = new PointLight(Tuple.point(0, 0.25, 0), new Colour(1, 1, 1));
      const r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
      const shape = w.objects[1];
      const i = Intersect.intersection(0.5, shape);
      const comps = Intersect.prepareComputations(i, r);
      const c = w.shadeHit(comps);
      expect(c).shallowEpsilonEquals(new Colour(0.90498, 0.90498, 0.90498), 5);
    });
  });
});
