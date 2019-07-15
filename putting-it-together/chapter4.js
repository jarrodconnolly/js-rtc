/* eslint-disable no-console */
const fs = require('fs');
const Tuple = require('../lib/tuple');
const Canvas = require('../lib/canvas');
const Colour = require('../lib/colour');
const Transform = require('../lib/transform');

const canvas = new Canvas(1000, 1000);
const white = new Colour(1, 1, 1);

const offsetX = canvas.width / 2;
const offsetY = canvas.height / 2;

const radius = canvas.width / 4;
const twelve = Tuple.point(0, -1, 0);

for (let h = 1; h <= 12; h++) {
  const r = Transform.rotationZ(h * (Math.PI / 6));
  const p = r.multiply(twelve);
  const x = Math.round((p.x * radius) + offsetX);
  const y = Math.round((p.y * radius) + offsetY);

  canvas.writePixel(x, y, white);
}

fs.writeFileSync('chapter4.ppm', canvas.toPPM());
