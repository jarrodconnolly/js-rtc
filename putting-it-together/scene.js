const Scene = require('../scene');

const scene = new Scene();
scene.load('scenes/jamis-ch11-schlick.yaml');
// scene.render();
scene.renderPixel(125, 125);
