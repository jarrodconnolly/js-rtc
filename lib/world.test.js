const World = require('./world');
const PointLight = require('./lights');
const Sphere = require('./shapes/sphere');
const Transform = require('./transform');
const Colour = require('./colour');
const Tuple = require('./tuple');
const Ray = require('./ray');
const Intersect = require('./intersect');
const Plane = require('./shapes/plane');
const TestPattern = require('./patterns/testPattern');

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
      const c = w.colourAt(r);
      expect(c).toEqual(new Colour(0, 0, 0));
    });
    test('The color when a ray hits', () => {
      const w = defaultWorld();
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const c = w.colourAt(r);
      expect(c).shallowEpsilonEquals(new Colour(0.38066, 0.47583, 0.2855), 5);
    });
    test('The color with an intersection behind the ray', () => {
      const w = defaultWorld();
      const outer = w.objects[0];
      outer.material.ambient = 1;
      const inner = w.objects[1];
      inner.material.ambient = 1;
      const r = new Ray(Tuple.point(0, 0, 0.75), Tuple.vector(0, 0, -1));
      const c = w.colourAt(r);
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

  describe('Reflections', () => {
    test('The reflected color for a nonreflective material', () => {
      const w = defaultWorld();
      const r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 0, 1));
      const shape = w.objects[1];
      shape.material.ambient = 1;
      const i = Intersect.intersection(1, shape);
      const comps = Intersect.prepareComputations(i, r);
      const colour = w.reflectedColour(comps);
      expect(colour).toEqual(Colour.black());
    });
    test('The reflected color for a reflective material', () => {
      const w = defaultWorld();
      const shape = new Plane();
      shape.material.reflective = 0.5;
      shape.transform = Transform.translation(0, -1, 0);
      w.objects.push(shape);
      const r = new Ray(Tuple.point(0, 0, -3), Tuple.vector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
      const i = Intersect.intersection(Math.SQRT2, shape);
      const comps = Intersect.prepareComputations(i, r);
      const colour = w.reflectedColour(comps);
      expect(colour).shallowEpsilonEquals(new Colour(0.19033, 0.23791, 0.14275), 5);
    });
    test('shade_hit() with a reflective material', () => {
      const w = defaultWorld();
      const shape = new Plane();
      shape.material.reflective = 0.5;
      shape.transform = Transform.translation(0, -1, 0);
      w.objects.push(shape);
      const r = new Ray(Tuple.point(0, 0, -3), Tuple.vector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
      const i = Intersect.intersection(Math.SQRT2, shape);
      const comps = Intersect.prepareComputations(i, r);
      const colour = w.shadeHit(comps);
      expect(colour).shallowEpsilonEquals(new Colour(0.87676, 0.92434, 0.82917), 5);
    });
    test('color_at() with mutually reflective surfaces', () => {
      const light = new PointLight(Tuple.point(0, 0, 0), new Colour(1, 1, 1));
      const w = new World(light, []);
      const lower = new Plane();
      lower.material.reflective = 1;
      lower.transform = Transform.translation(0, -1, 0);
      w.objects.push(lower);
      const upper = new Plane();
      upper.material.reflective = 1;
      upper.transform = Transform.translation(0, 1, 0);
      w.objects.push(upper);
      const r = new Ray(Tuple.point(0, 0, 0), Tuple.vector(0, 1, 0));
      expect(() => { w.colourAt(r, 5); }).not.toThrow(RangeError);
    });
    test('The reflected color at the maximum recursive depth', () => {
      const w = defaultWorld();
      const shape = new Plane();
      shape.material.reflective = 0.5;
      shape.transform = Transform.translation(0, -1, 0);
      w.objects.push(shape);
      const r = new Ray(Tuple.point(0, 0, -3), Tuple.vector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
      const i = Intersect.intersection(Math.SQRT2, shape);
      const comps = Intersect.prepareComputations(i, r);
      const colour = w.reflectedColour(comps, 0);
      expect(colour).toEqual(Colour.black());
    });
  });
  describe('Refractions', () => {
    test('The refracted color with an opaque surface', () => {
      const w = defaultWorld();
      const shape = w.objects[0];
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const xs = Intersect.intersections(
        Intersect.intersection(4, shape),
        Intersect.intersection(6, shape)
      );
      const comps = Intersect.prepareComputations(xs[0], r, xs);
      const c = w.refractedColour(comps, 5);
      expect(c).toEqual(Colour.black());
    });
    test('The refracted color at the maximum recursive depth', () => {
      const w = defaultWorld();
      const shape = w.objects[0];
      shape.material.transparency = 1.0;
      shape.material.refractiveIndex = 1.5;
      const r = new Ray(Tuple.point(0, 0, -5), Tuple.vector(0, 0, 1));
      const xs = Intersect.intersections(
        Intersect.intersection(4, shape),
        Intersect.intersection(6, shape)
      );
      const comps = Intersect.prepareComputations(xs[0], r, xs);
      const c = w.refractedColour(comps, 0);
      expect(c).toEqual(Colour.black());
    });
    test('The refracted color under total internal reflection', () => {
      const w = defaultWorld();
      const shape = w.objects[0];
      shape.material.transparency = 1.0;
      shape.material.refractiveIndex = 1.5;
      const r = new Ray(Tuple.point(0, 0, Math.SQRT2 / 2), Tuple.vector(0, 1, 0));
      const xs = Intersect.intersections(
        Intersect.intersection(-Math.SQRT2 / 2, shape),
        Intersect.intersection(Math.SQRT2 / 2, shape)
      );
      const comps = Intersect.prepareComputations(xs[1], r, xs);
      const c = w.refractedColour(comps, 5);
      expect(c).toEqual(Colour.black());
    });
    test('The refracted color with a refracted ray', () => {
      const w = defaultWorld();
      const A = w.objects[0];
      A.material.ambient = 1.0;
      A.material.pattern = new TestPattern();
      const B = w.objects[1];
      B.material.transparency = 1.0;
      B.material.refractiveIndex = 1.5;
      const r = new Ray(Tuple.point(0, 0, 0.1), Tuple.vector(0, 1, 0));
      const xs = Intersect.intersections(
        Intersect.intersection(-0.9899, A),
        Intersect.intersection(-0.4899, B),
        Intersect.intersection(0.4899, B),
        Intersect.intersection(0.9899, A)
      );
      const comps = Intersect.prepareComputations(xs[2], r, xs);
      const c = w.refractedColour(comps, 5);
      expect(c).shallowEpsilonEquals(new Colour(0, 0.99888, 0.04725), 5);
    });
    test('shade_hit() with a transparent material', () => {
      const w = defaultWorld();
      w.objects = [];
      const floor = new Plane();
      floor.transform = Transform.translation(0, -1, 0);
      floor.material.transparency = 0.5;
      floor.material.refractiveIndex = 1.5;
      w.objects.push(floor);
      const ball = new Sphere();
      ball.material.colour = new Colour(1, 0, 0);
      ball.material.ambient = 0.5;
      ball.transform = Transform.translation(0, -3.5, -0.5);
      w.objects.push(ball);
      const r = new Ray(Tuple.point(0, 0, -3), Tuple.vector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
      const xs = Intersect.intersections(Intersect.intersection(Math.SQRT2, floor));
      const comps = Intersect.prepareComputations(xs[0], r, xs);
      const colour = w.shadeHit(comps, 5);
      expect(colour).shallowEpsilonEquals(new Colour(0.93642, 0.68642, 0.68642), 5);
    });
    test('shade_hit() with a reflective, transparent material', () => {
      const w = defaultWorld();
      const r = new Ray(Tuple.point(0, 0, -3), Tuple.vector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2));
      const floor = new Plane();
      floor.transform = Transform.translation(0, -1, 0);
      floor.material.reflective = 0.5;
      floor.material.transparency = 0.5;
      floor.material.refractiveIndex = 1.5;
      w.objects.push(floor);
      const ball = new Sphere();
      ball.material.colour = new Colour(1, 0, 0);
      ball.material.ambient = 0.5;
      ball.transform = Transform.translation(0, -3.5, -0.5);
      w.objects.push(ball);
      const xs = Intersect.intersections(Intersect.intersection(Math.SQRT2, floor));
      const comps = Intersect.prepareComputations(xs[0], r, xs);
      const colour = w.shadeHit(comps, 5);
      expect(colour).shallowEpsilonEquals(new Colour(0.93391, 0.69643, 0.69243), 5);
    });
  });
});
