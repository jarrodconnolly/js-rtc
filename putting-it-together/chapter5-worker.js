const {
  parentPort,
  workerData,
// eslint-disable-next-line import/no-unresolved
} = require('worker_threads');
const Tuple = require('../lib/tuple');
const Sphere = require('../lib/sphere');
const Ray = require('../lib/ray');
const Intersect = require('../lib/intersect');

const {
  start,
  end,
  canvasPixels,
  data,
  workerIndex,
} = workerData;

// eslint-disable-next-line no-console
console.log(`Worker: ${workerIndex} - ${start} : ${end}`);

const wallZ = 10;
const wallSize = 7;
const wallHalf = wallSize / 2;
const pixelSize = wallSize / canvasPixels;

const rayOrigin = Tuple.point(0, 0, -5);

const sphere = new Sphere();

parentPort.once('message', () => {
  const hrstart = process.hrtime();

  for (let i = start; i <= end; i++) {
    const x = (i % canvasPixels);
    const y = Math.floor(i / canvasPixels);

    const worldX = -wallHalf + pixelSize * x;
    const worldY = wallHalf - pixelSize * y;
    const position = Tuple.point(worldX, worldY, wallZ);
    const rayVector = position.subtract(rayOrigin).normalize();
    const r = new Ray(rayOrigin, rayVector);
    const xs = Intersect.intersect(sphere, r);
    if (Intersect.hit(xs)) {
      data[i] = 1;
    }
  }

  const hrend = process.hrtime(hrstart);

  parentPort.postMessage({
    workerIndex: workerIndex,
    time: `${hrend[0]}s ${hrend[1] / 1000000}ms`,
  });
});
