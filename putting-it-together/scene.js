const Scene = require('../scene');

const sceneFile = process.argv[2];
const scene = new Scene();
scene.load(sceneFile);
//scene.render();

scene.renderPixel(125, 125);
