/* eslint-disable no-console */
const fs = require('fs');
const Tuple = require('../lib/tuple');
const Canvas = require('../lib/canvas');
const Colour = require('../lib/colour');
const Sphere = require('../lib/shapes/sphere');
const Ray = require('../lib/ray');
const Intersect = require('../lib/intersect');
const PointLight = require('../lib/lights');
// const Transform = require('../lib/transform');

const wallZ = 10;
const wallSize = 7;
const wallHalf = wallSize / 2;
const canvasPixels = 512;
const pixelSize = wallSize / canvasPixels;

const rayOrigin = Tuple.point(0, 0, -5);

const canvas = new Canvas(canvasPixels, canvasPixels);
const sphere = new Sphere();
sphere.material.colour = new Colour(1, 0.2, 0.5);

const lightPosition = Tuple.point(-10, 10, -10);
const lightColour = new Colour(1, 1, 1);
const light = new PointLight(lightPosition, lightColour);

// sphere.transform = Transform.scaling(1, 0.5, 1);
// sphere.transform = Transform.rotationZ(Math.PI / 4).multiply(Transform.scaling(0.5, 1, 1));
// sphere.transform = Transform.shearing(1, 0, 0, 0, 0, 0).multiply(Transform.scaling(0.5, 1, 1));

const hrstart = process.hrtime();
for (let y = 0; y < canvasPixels; y++) {
  const worldY = wallHalf - pixelSize * y;
  for (let x = 0; x < canvasPixels; x++) {
    const worldX = -wallHalf + pixelSize * x;
    const position = Tuple.point(worldX, worldY, wallZ);
    const rayVector = position.subtract(rayOrigin).normalize();
    const r = new Ray(rayOrigin, rayVector);
    const xs = Intersect.intersect(sphere, r);
    const hit = Intersect.hit(xs);
    if (hit) {
      const point = r.position(hit.t);
      const normal = hit.object.normalAt(point);
      const eye = r.direction.multiply(-1);
      const colour = hit.object.material.lighting(light, point, eye, normal);
      canvas.writePixel(x, y, colour);
    }
  }
}

const hrend = process.hrtime(hrstart);
console.log(`Rays: ${canvasPixels * canvasPixels}`);
console.log(`Time ${hrend[0]}s ${hrend[1] / 1000000}ms`);

fs.writeFileSync('chapter6.ppm', canvas.toPPM());
