const PointLight = require('./lights');
const Colour = require('./colour');
const Tuple = require('./tuple');
const Material = require('./materials');
const Stripe = require('./patterns/stripe');
const Sphere = require('./shapes/sphere');

describe('Light', () => {
  test('A point light has a position and intensity', () => {
    const intensity = new Colour(1, 1, 1);
    const position = Tuple.point(0, 0, 0);
    const l = new PointLight(position, intensity);
    expect(l.position).toEqual(position);
    expect(l.intensity).toEqual(intensity);
  });

  let m = new Material();
  let position = Tuple.point(0, 0, 0);
  describe('Lighting Phong', () => {
    beforeEach(() => {
      m = new Material();
      position = Tuple.point(0, 0, 0);
    });
    test('Lighting with the eye between the light and the surface', () => {
      const eyev = Tuple.vector(0, 0, -1);
      const normalv = Tuple.vector(0, 0, -1);
      const light = new PointLight(Tuple.point(0, 0, -10), new Colour(1, 1, 1));
      const s = new Sphere();
      const result = m.lighting(s, light, position, eyev, normalv);
      expect(result).toEqual(new Colour(1.9, 1.9, 1.9));
    });
    test('Lighting with the eye between light and surface, eye offset 45°', () => {
      const eyev = Tuple.vector(0, Math.SQRT2 / 2, Math.SQRT2 / 2);
      const normalv = Tuple.vector(0, 0, -1);
      const light = new PointLight(Tuple.point(0, 0, -10), new Colour(1, 1, 1));
      const s = new Sphere();
      const result = m.lighting(s, light, position, eyev, normalv);
      expect(result).toEqual(new Colour(1.0, 1.0, 1.0));
    });
    test('Lighting with eye opposite surface, light offset 45°', () => {
      const eyev = Tuple.vector(0, 0, -1);
      const normalv = Tuple.vector(0, 0, -1);
      const light = new PointLight(Tuple.point(0, 10, -10), new Colour(1, 1, 1));
      const s = new Sphere();
      const result = m.lighting(s, light, position, eyev, normalv);
      expect(result).shallowEpsilonEquals(new Colour(0.7364, 0.7364, 0.7364), 4);
    });
    test('Lighting with eye in the path of the reflection vector', () => {
      const eyev = Tuple.vector(0, -Math.SQRT2 / 2, -Math.SQRT2 / 2);
      const normalv = Tuple.vector(0, 0, -1);
      const light = new PointLight(Tuple.point(0, 10, -10), new Colour(1, 1, 1));
      const s = new Sphere();
      const result = m.lighting(s, light, position, eyev, normalv);
      expect(result).shallowEpsilonEquals(new Colour(1.6364, 1.6364, 1.6364), 4);
    });
    test('Lighting with the light behind the surface', () => {
      const eyev = Tuple.vector(0, 0, -1);
      const normalv = Tuple.vector(0, 0, -1);
      const light = new PointLight(Tuple.point(0, 0, 10), new Colour(1, 1, 1));
      const s = new Sphere();
      const result = m.lighting(s, light, position, eyev, normalv);
      expect(result).toEqual(new Colour(0.1, 0.1, 0.1));
    });
    test('Lighting with the surface in shadow', () => {
      const eyev = Tuple.vector(0, 0, -1);
      const normalv = Tuple.vector(0, 0, -1);
      const light = new PointLight(Tuple.point(0, 0, -10), new Colour(1, 1, 1));
      const inShadow = true;
      const s = new Sphere();
      const result = m.lighting(s, light, position, eyev, normalv, inShadow);
      expect(result).toEqual(new Colour(0.1, 0.1, 0.1));
    });
    test('Lighting with a pattern applied', () => {
      m.pattern = new Stripe(Colour.white(), Colour.black());
      m.ambient = 1;
      m.diffuse = 0;
      m.specular = 0;
      const eyev = Tuple.vector(0, 0, -1);
      const normalv = Tuple.vector(0, 0, -1);
      const light = new PointLight(Tuple.point(0, 0, -10), new Colour(1, 1, 1));
      const s = new Sphere();
      const c1 = m.lighting(s, light, Tuple.point(0.9, 0, 0), eyev, normalv, false);
      const c2 = m.lighting(s, light, Tuple.point(1.1, 0, 0), eyev, normalv, false);
      expect(c1).toEqual(Colour.white());
      expect(c2).toEqual(Colour.black());
    });
    test('Reflectivity for the default material', () => {
      expect(m.reflective).toEqual(0.0);
    });
  });
});
