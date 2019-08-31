/* eslint-disable no-console */
const Sphere = require('../lib/shapes/sphere');
const Colour = require('../lib/colour');
const Transform = require('../lib/transform');
const World = require('../lib/world');
const PointLight = require('../lib/lights');
const Tuple = require('../lib/tuple');
const Camera = require('../lib/camera');
const Plane = require('../lib/shapes/plane');
const Checker = require('../lib/patterns/checker');

const wall = new Plane();
wall.transform = Transform.translation(0, -10.1, 0);
wall.material.pattern = new Checker(Colour.black(), Colour.white(), false);
wall.material.pattern.transform = Transform.translation(0, 0.1, 0);
wall.material.specular = 0;

const bigger = new Sphere();
bigger.material.diffuse = 0.1;
bigger.material.shininess = 300;
bigger.material.reflective = 1;
bigger.material.transparency = 0.9;
bigger.material.refractiveIndex = 1.52;
bigger.material.colour = new Colour(0, 0, 0.1);

const smaller = new Sphere();
smaller.transform = Transform.scaling(0.5, 0.5, 0.5);
smaller.material.diffuse = 0.1;
smaller.material.shininess = 300;
smaller.material.reflective = 1;
smaller.material.transparency = 0.9;
smaller.material.refractiveIndex = 1;
smaller.material.colour = new Colour(0, 0, 0.1);

const light = new PointLight(Tuple.point(2, 10, -5), new Colour(0.8, 0.8, 0.8));
const world = new World(light, [wall, smaller, bigger]);
world.shadowEnabled = false;

const camera = new Camera(512, 512, Math.PI / 3);
const from = Tuple.point(0, 2.5, 0);
const to = Tuple.point(0, 0, 0);
const up = Tuple.vector(1, 0, 0);
camera.transform = Transform.viewTransform(from, to, up);

const hrstart = process.hrtime();
const canvas = camera.render(world);
// camera.renderPixel(world, 270, 250);
const hrend = process.hrtime(hrstart);
console.log(`Time ${hrend[0]}s ${hrend[1] / 1000000}ms`);

canvas.toPPMBinary('chapter11.ppm');
