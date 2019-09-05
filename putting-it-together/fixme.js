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

const floor = new Plane();
floor.ID = 'floor';
floor.transform = Transform.translation(0, -10, 0);
floor.material.pattern = new Checker(Colour.black(), Colour.white(), false);
floor.material.pattern.transform = Transform.translation(0, 0, 0);
floor.material.specular = 0;

const bigger = new Sphere();
bigger.ID = 'BIGGER';
bigger.material.colour = new Colour(0, 0, 0.1);
bigger.material.refractiveIndex = 1.52;
bigger.material.reflective = 0.9;
bigger.material.transparency = 1;
bigger.material.diffuse = 0.1;
bigger.material.shininess = 300;


const smaller = new Sphere();
smaller.ID = 'SMALLER';
smaller.transform = Transform.scaling(0.5, 0.5, 0.5);
smaller.material.colour = new Colour(0, 0, 0.1);
smaller.material.refractiveIndex = 1.00029;
smaller.material.reflective = 0.9;
smaller.material.transparency = 1;
smaller.material.diffuse = 0.1;
smaller.material.shininess = 300;

const light = new PointLight(Tuple.point(2, 10, -5), new Colour(0.9, 0.9, 0.9));
const world = new World(light, [floor, smaller, bigger]);
world.shadowEnabled = true;

const camera = new Camera(512, 512, Math.PI / 3);
const from = Tuple.point(0, 2.0, 0);
const to = Tuple.point(0, 0, 0);
const up = Tuple.vector(1, 0, 0);
camera.transform = Transform.viewTransform(from, to, up);


const hrstart = process.hrtime();
const canvas = camera.render(world);
const hrend = process.hrtime(hrstart);
console.log(`Time ${hrend[0]}s ${hrend[1] / 1000000}ms`);
canvas.toPPMBinary('chapter11.ppm');
