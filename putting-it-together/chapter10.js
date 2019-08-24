/* eslint-disable no-console */
const fs = require('fs');
const Sphere = require('../lib/shapes/sphere');
const Colour = require('../lib/colour');
const Transform = require('../lib/transform');
const World = require('../lib/world');
const PointLight = require('../lib/lights');
const Tuple = require('../lib/tuple');
const Camera = require('../lib/camera');
const Plane = require('../lib/shapes/plane');
const Stripe = require('../lib/patterns/stripe');

const floor = new Plane();
floor.material.colour = new Colour(0.6, 0.6, 0.6);
floor.material.specular = 0;

const wall = new Plane();
wall.transform = Transform.translation(0, 0, 2).multiply(Transform.rotationX(Math.PI / 2));
wall.material.colour = new Colour(0.15, 0.15, 0.75);
wall.material.specular = 0;

const middle = new Sphere();
middle.transform = Transform.translation(-0.5, 1, 0.5);
middle.material.pattern = new Stripe(Colour.white(), Colour.black());
middle.material.pattern.transform = Transform.scaling(0.125, 1, 1);
middle.material.diffuse = 0.9;
middle.material.specular = 0.75;

const right = new Sphere();
right.transform = Transform.translation(1.5, 0.5, -0.5).multiply(Transform.scaling(0.5, 0.5, 0.5));
right.material.colour = new Colour(0.5, 1, 0.1);
right.material.diffuse = 0.7;
right.material.specular = 0.3;

const left = new Sphere();
left.transform = Transform.translation(-1.5, 0.33, -0.75).multiply(Transform.scaling(0.33, 0.33, 0.33));
left.material.colour = new Colour(1, 0.8, 0.1);
left.material.diffuse = 0.7;
left.material.specular = 0.3;

const light = new PointLight(Tuple.point(-10, 10, -10), new Colour(1, 1, 1));
const world = new World(light, [floor, wall, left, middle, right]);

const camera = new Camera(512, 512, Math.PI / 3);
const from = Tuple.point(0, 1.5, -5);
const to = Tuple.point(0, 1, 0);
const up = Tuple.vector(0, 1, 0);
camera.transform = Transform.viewTransform(from, to, up);

const hrstart = process.hrtime();
const canvas = camera.render(world);
const hrend = process.hrtime(hrstart);
console.log(`Time ${hrend[0]}s ${hrend[1] / 1000000}ms`);

fs.writeFileSync('chapter10.ppm', canvas.toPPM());
