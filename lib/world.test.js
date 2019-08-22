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
    test('shade_hit() is given an intersection in shadow', () => {
      const w = new World();
      w.light = new PointLight(Tuple.point(0, 0, -10), new Colour(1, 1, 1));
      const s1 = new Sphere();
      w.objects.push(s1);
      const s2 = new Sphere();
      s2.transform = Transform.translation(0, 0, 10);
      w.objects.push(s2);
      const r = new Ray(Tuple.point(0, 0, 5), Tuple.vector(0, 0, 1));
      const i = Intersect.intersection(4, s2);
      const comps = Intersect.prepareComputations(i, r);
      const c = w.shadeHit(comps);
      expect(c).toEqual(new Colour(0.1, 0.1, 0.1));
    });
  });

  describe('Colour at', () => {
    test('The color when a ray misses', () => {
      const w = defaultWorld();
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 1, 0));
      const c = w.colorAt(r);
      expect(c).toEqual(new Colour(0, 0, 0));
    });
    test('The color when a ray hits', () => {
      const w = defaultWorld();
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const c = w.colorAt(r);
      expect(c).shallowEpsilonEquals(new Colour(0.38066, 0.47583, 0.2855), 5);
    });
    test('The color with an intersection behind the ray', () => {
      const w = defaultWorld();
      const outer = w.objects[0];
      outer.material.ambient = 1;
      const inner = w.objects[1];
      inner.material.ambient = 1;
      const r = new Ray(Tuple.point(0, 0, 0.75), Tuple.vector(0, 0, -1));
      const c = w.colorAt(r);
      expect(c).toEqual(inner.material.colour);
    });
  });

  describe('Shadows', () => {
    test('There is no shadow when nothing is collinear with point and light', () => {
      const w = defaultWorld();
      const p = Tuple.point(0, 10, 0);
      expect(w.isShadowed(p)).toEqual(false);
    });
    test('The shadow when an object is between the point and the light', () => {
      const w = defaultWorld();
      const p = Tuple.point(10, -10, 10);
      expect(w.isShadowed(p)).toEqual(true);
    });
    test('There is no shadow when an object is behind the light', () => {
      const w = defaultWorld();
      const p = Tuple.point(-20, 20, -20);
      expect(w.isShadowed(p)).toEqual(false);
    });
    test('There is no shadow when an object is behind the point', () => {
      const w = defaultWorld();
      const p = Tuple.point(-2, 2, -2);
      expect(w.isShadowed(p)).toEqual(false);
    });
  });
});
