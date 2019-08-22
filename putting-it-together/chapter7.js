/* eslint-disable no-console */
const fs = require('fs');
const Sphere = require('../lib/sphere');
const Colour = require('../lib/colour');
const Transform = require('../lib/transform');
const World = require('../lib/world');
const PointLight = require('../lib/lights');
const Tuple = require('../lib/tuple');
const Camera = require('../lib/camera');

const floor = new Sphere();
floor.transform = Transform.scaling(10, 0.01, 10);
floor.material.colour = new Colour(1, 0.9, 0.9);
floor.material.specular = 0;

const leftWall = new Sphere();
const leftWallTranslation = Transform.translation(0, 0, 5);
const leftWallRotation = Transform.rotationY(-Math.PI / 4).multiply(Transform.rotationX(Math.PI / 2));
const leftWallScaling = Transform.scaling(10, 0.01, 10);
leftWall.transform = leftWallTranslation.multiply(leftWallRotation).multiply(leftWallScaling);
leftWall.material = floor.material;

const rightWall = new Sphere();
const rightWallTranslation = Transform.translation(0, 0, 5);
const rightWallRotation = Transform.rotationY(Math.PI / 4).multiply(Transform.rotationX(Math.PI / 2));
const rightWallScaling = Transform.scaling(10, 0.01, 10);
rightWall.transform = rightWallTranslation.multiply(rightWallRotation).multiply(rightWallScaling);
rightWall.material = floor.material;

const middle = new Sphere();
middle.transform = Transform.translation(-0.5, 1, 0.5);
middle.material.colour = new Colour(0.1, 1, 0.5);
middle.material.diffuse = 0.7;
middle.material.specular = 0.3;

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
const world = new World(light, [floor, leftWall, rightWall, left, middle, right]);

const camera = new Camera(512, 512, Math.PI / 3);
const from = Tuple.point(0, 1.5, -5);
const to = Tuple.point(0, 1, 0);
const up = Tuple.vector(0, 1, 0);
camera.transform = Transform.viewTransform(from, to, up);

const hrstart = process.hrtime();
const canvas = camera.render(world);
const hrend = process.hrtime(hrstart);
console.log(`Time ${hrend[0]}s ${hrend[1] / 1000000}ms`);

fs.writeFileSync('chapter7.ppm', canvas.toPPM());
