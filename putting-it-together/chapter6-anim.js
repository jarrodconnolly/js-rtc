/* eslint-disable no-console */
const fs = require('fs');
const Tuple = require('../lib/tuple');
const Canvas = require('../lib/canvas');
const Colour = require('../lib/colour');
const Sphere = require('../lib/shapes/sphere');
const Ray = require('../lib/ray');
const Intersect = require('../lib/intersect');
const PointLight = require('../lib/lights');
const Transform = require('../lib/transform');

const wallZ = 10;
const wallSize = 7;
const wallHalf = wallSize / 2;
const canvasPixels = 512;
const pixelSize = wallSize / canvasPixels;

const rayOrigin = Tuple.point(0, 0, -5);

const lightPosition = Tuple.point(-10, 10, -10);
const lightColour = new Colour(1, 1, 1);
const light = new PointLight(lightPosition, lightColour);

// sphere.transform = Transform.scaling(1, 0.5, 1);
// sphere.transform = Transform.rotationZ(Math.PI / 4).multiply(Transform.scaling(0.5, 1, 1));
// sphere.transform = Transform.shearing(1, 0, 0, 0, 0, 0).multiply(Transform.scaling(0.5, 1, 1));

const fps = 15;
const totalSeconds = 3;
const totalFrames = fps * totalSeconds;
let scaleY = 1;
const diff = 0.9 / totalFrames;
for (let f = 0; f < totalFrames; f++) {
  const canvas = new Canvas(canvasPixels, canvasPixels);
  const sphere = new Sphere();
  sphere.material.colour = new Colour(1, 0.2, 0.2);
  sphere.transform = Transform.scaling(1, scaleY, 1);

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
  scaleY -= diff;

  process.stdout.write('.');

  fs.writeFileSync(`frames/chapter6-anim-${f.toString(10).padStart(3, '0')}.ppm`, canvas.toPPM());
}

console.log('\nDone.');

// ffmpeg -framerate 15 -i "chapter6-anim-%03d.ppm" output.gif
// ffmpeg -framerate 15 -i "chapter6-anim-%03d.ppm" -c:v libx264 -preset slow -pix_fmt yuv420p output.mp4
