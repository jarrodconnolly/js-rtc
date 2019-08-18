/* eslint-disable no-console */
const fs = require('fs');
const Tuple = require('../lib/tuple');
const Canvas = require('../lib/canvas');
const Colour = require('../lib/colour');

const projectile = {
  position: Tuple.point(0, 1, 0),
  velocity: Tuple.vector(0.5, 1.3, 0).normalize().multiply(10),
};

const environment = {
  gravity: Tuple.vector(0, -0.1, 0),
  wind: Tuple.vector(-0.01, 0, 0),
};

const canvas = new Canvas(512, 512);

const tick = () => {
  projectile.position = projectile.position
    .add(projectile.velocity);

  projectile.velocity = projectile.velocity
    .add(environment.gravity)
    .add(environment.wind);

  if (projectile.position.y >= 0) {
    const x = Math.round(projectile.position.x);
    const y = Math.round(projectile.position.y);
    console.log(`x:${x} y:${y}`);
    canvas.writePixel(x, canvas.height - y, new Colour(1, 0, 0));
    canvas.writePixel(x, canvas.height - y + 1, new Colour(1, 0, 0));
    canvas.writePixel(x, canvas.height - y - 1, new Colour(1, 0, 0));
    canvas.writePixel(x + 1, canvas.height - y, new Colour(1, 0, 0));
    canvas.writePixel(x - 1, canvas.height - y, new Colour(1, 0, 0));

    setTimeout(tick, 5);
  } else {
    console.log('done.');
    fs.writeFileSync('chapter2.ppm', canvas.toPPM());
  }
};

setTimeout(tick, 5);
