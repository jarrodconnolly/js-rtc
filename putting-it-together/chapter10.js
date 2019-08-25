/* eslint-disable no-console */
const Sphere = require('../lib/shapes/sphere');
const Colour = require('../lib/colour');
const Transform = require('../lib/transform');
const World = require('../lib/world');
const PointLight = require('../lib/lights');
const Tuple = require('../lib/tuple');
const Camera = require('../lib/camera');
const Plane = require('../lib/shapes/plane');
const Stripe = require('../lib/patterns/stripe');
const Gradient = require('../lib/patterns/gradient');
const Ring = require('../lib/patterns/ring');
const Checker = require('../lib/patterns/checker');
const Perturb = require('../lib/patterns/perturb');

const floor = new Plane();
floor.material.pattern = new Ring(Colour.white(), Colour.black());
floor.material.pattern.transform = Transform.scaling(0.25, 1, 0.25);
floor.material.specular = 0;

const wall = new Plane();
wall.transform = Transform.translation(0, 0, 2).multiply(Transform.rotationX(Math.PI / 2));
wall.material.pattern = new Gradient(new Colour(0.2, 0.2, 1), new Colour(0, 0, 0));
wall.material.pattern.transform = Transform.scaling(1, 1, 5).multiply(Transform.rotationY(Math.PI / 2));
wall.material.specular = 0;

const middle = new Sphere();
middle.transform = Transform.translation(-0.5, 1, 0.5);
middle.material.pattern = new Stripe(Colour.white(), Colour.black());
middle.material.pattern.transform = Transform.scaling(0.125, 1, 1);
middle.material.diffuse = 0.9;
middle.material.specular = 0.75;

const right = new Sphere();
right.transform = Transform.translation(1.5, 0.5, -0.5).multiply(Transform.scaling(0.5, 0.5, 0.5));
right.material.pattern = new Gradient(new Colour(1, 0, 0), new Colour(0, 1, 0));
right.material.pattern.transform = Transform.scaling(2, 1, 1).multiply(Transform.translation(-0.5, 0, 0));
right.material.diffuse = 0.7;
right.material.specular = 0.3;

const right2 = new Sphere();
right2.transform = Transform.translation(1.5, 1.0, -0.5).multiply(Transform.scaling(0.5, 0.5, 0.5));
right2.material.pattern = new Gradient(new Colour(1, 0, 0), new Colour(0, 1, 0));
right2.material.pattern.transform = Transform.scaling(2, 1, 1).multiply(Transform.translation(-0.5, 0, 0));
right2.material.diffuse = 0.7;
right2.material.specular = 0.3;

const right3 = new Sphere();
right3.transform = Transform.translation(1.5, 1.5, -0.5).multiply(Transform.scaling(0.5, 0.5, 0.5));
right3.material.pattern = new Gradient(new Colour(1, 0, 0), new Colour(0, 1, 0));
right3.material.pattern.transform = Transform.scaling(2, 1, 1).multiply(Transform.translation(-0.5, 0, 0));
right3.material.diffuse = 0.7;
right3.material.specular = 0.3;

const left = new Sphere();
left.transform = Transform.translation(-1.5, 0.25, -0.75).multiply(Transform.scaling(0.75, 0.75, 0.75));
left.material.pattern = new Checker(new Colour(1, 0, 0), new Colour(0, 1, 0), true);
left.material.pattern.transform = Transform.scaling(0.25, 0.25, 0.25);
left.material.diffuse = 0.9;
left.material.specular = 0.1;

const closer = new Sphere();
closer.transform = Transform.translation(0.25, 0.5, -2).multiply(Transform.scaling(0.5, 0.5, 0.5));
const closerChecker = new Checker(new Colour(0, 0, 1), new Colour(0, 1, 0.5), true);
closerChecker.transform = Transform.scaling(0.25, 0.25, 0.25);
closer.material.pattern = new Perturb(closerChecker, 0.5);
closer.material.diffuse = 0.9;
closer.material.specular = 0.1;

const light = new PointLight(Tuple.point(-10, 10, -10), new Colour(1, 1, 1));
const world = new World(light, [floor, wall, closer, left, middle, right, right2, right3]);

const camera = new Camera(512, 512, Math.PI / 3);
const from = Tuple.point(0, 1.5, -5);
const to = Tuple.point(0, 1, 0);
const up = Tuple.vector(0, 1, 0);
camera.transform = Transform.viewTransform(from, to, up);

const hrstart = process.hrtime();
const canvas = camera.render(world);
const hrend = process.hrtime(hrstart);
console.log(`Time ${hrend[0]}s ${hrend[1] / 1000000}ms`);

canvas.toPPMBinary('chapter10.ppm');
