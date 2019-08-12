/* eslint-disable no-console */
const fs = require('fs');
const Tuple = require('../lib/tuple');
const Canvas = require('../lib/canvas');
const Colour = require('../lib/colour');
const Sphere = require('../lib/sphere');
const Ray = require('../lib/ray');
const Intersect = require('../lib/intersect');
// const Transform = require('../lib/transform');

const wallZ = 10;
const wallSize = 7;
const wallHalf = wallSize / 2;
const canvasPixels = 256;
const pixelSize = wallSize / canvasPixels;

const rayOrigin = Tuple.point(0, 0, -5);

const canvas = new Canvas(canvasPixels, canvasPixels);
const red = new Colour(1, 0, 0);
const sphere = new Sphere();

const start = Date.now();
for (let y = 0; y < canvasPixels; y++) {
  const worldY = wallHalf - pixelSize * y;
  for (let x = 0; x < canvasPixels; x++) {
    const worldX = -wallHalf + pixelSize * x;
    const position = Tuple.point(worldX, worldY, wallZ);
    const rayVector = position.subtract(rayOrigin).normalize();
    const r = new Ray(rayOrigin, rayVector);
    const xs = Intersect.intersect(sphere, r);
    if (Intersect.hit(xs)) {
      canvas.writePixel(x, y, red);
    }
  }
}

console.log(`Rays: ${canvasPixels * canvasPixels}`);
console.log(`Time: ${Date.now() - start}ms`);

fs.writeFileSync('chapter5.ppm', canvas.toPPM());
