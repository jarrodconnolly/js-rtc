/* eslint-disable no-console */
const Tuple = require('../lib/tuple');

const projectile = {
  position: Tuple.point(0, 1, 0),
  velocity: Tuple.vector(1, 1, 0).normalize(),
};

const environment = {
  gravity: Tuple.vector(0, -0.1, 0),
  wind: Tuple.vector(-0.01, 0, 0),
};

const tick = () => {
  projectile.position = projectile.position
    .add(projectile.velocity);

  projectile.velocity = projectile.velocity
    .add(environment.gravity)
    .add(environment.wind);

  if (projectile.position.y >= 0) {
    console.log(`x:${projectile.position.x} y:${projectile.position.y}`);
    setTimeout(tick, 50);
  } else {
    console.log('done.');
  }
};

setTimeout(tick, 50);
