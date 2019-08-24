const Camera = require('./camera');
const Matrix = require('./matrix');
const Tuple = require('./tuple');
const Transform = require('./transform');
const World = require('./world');
const Colour = require('./colour');
const PointLight = require('./lights');
const Sphere = require('./shapes/sphere.js');

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

describe('Camera', () => {
  test('Constructing a camera', () => {
    const hsize = 160;
    const vsize = 120;
    const fov = Math.PI / 2;
    const c = new Camera(hsize, vsize, fov);
    expect(c.hsize).toEqual(160);
    expect(c.vsize).toEqual(120);
    expect(c.fov).toEqual(Math.PI / 2);
    expect(c.transform).toEqual(Matrix.getIdentity());
  });
  test('The pixel size for a horizontal canvas', () => {
    const c = new Camera(200, 125, Math.PI / 2);
    expect(c.pixelSize).shallowEpsilonEquals(0.01);
  });
  test('The pixel size for a vertical canvas', () => {
    const c = new Camera(125, 200, Math.PI / 2);
    expect(c.pixelSize).shallowEpsilonEquals(0.01);
  });
  test('Constructing a ray through the center of the canvas', () => {
    const c = new Camera(201, 101, Math.PI / 2);
    const r = c.rayForPixel(100, 50);
    expect(r.origin).toEqual(Tuple.point(0, 0, 0));
    expect(r.direction).shallowEpsilonEquals(Tuple.vector(0, 0, -1));
  });
  test('Constructing a ray through a corner of the canvas', () => {
    const c = new Camera(201, 101, Math.PI / 2);
    const r = c.rayForPixel(0, 0);
    expect(r.origin).toEqual(Tuple.point(0, 0, 0));
    expect(r.direction).shallowEpsilonEquals(Tuple.vector(0.66519, 0.33259, -0.66851), 5);
  });
  test('Constructing a ray when the camera is transformed', () => {
    const c = new Camera(201, 101, Math.PI / 2);
    c.transform = Transform.rotationY(Math.PI / 4).multiply(Transform.translation(0, -2, 5));
    const r = c.rayForPixel(100, 50);
    expect(r.origin).toEqual(Tuple.point(0, 2, -5));
    expect(r.direction).shallowEpsilonEquals(Tuple.vector(Math.SQRT2 / 2, 0, -Math.SQRT2 / 2));
  });
  test('Rendering a world with a camera', () => {
    const w = defaultWorld();
    const c = new Camera(11, 11, Math.PI / 2);
    const from = Tuple.point(0, 0, -5);
    const to = Tuple.point(0, 0, 0);
    const up = Tuple.vector(0, 1, 0);
    c.transform = Transform.viewTransform(from, to, up);
    const image = c.render(w);
    expect(image.pixelAt(5, 5)).shallowEpsilonEquals(new Colour(0.38066, 0.47583, 0.2855), 5);
  });
});
