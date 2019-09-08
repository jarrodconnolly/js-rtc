/* eslint-disable no-console, no-param-reassign */
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const Tuple = require('./lib/tuple');
const Camera = require('./lib/camera');
const Transform = require('./lib/transform');
const PointLight = require('./lib/lights');
const Colour = require('./lib/colour');
const World = require('./lib/world');
const Sphere = require('./lib/shapes/sphere');
const Matrix = require('./lib/matrix');
const Plane = require('./lib/shapes/plane');
const Checker = require('./lib/patterns/checker');

class Scene {
  constructor() {
    /**
     * @type {Camera}
     */
    this.camera = undefined;
    this.world = new World();
  }

  _add(o) {
    console.log(`add: ${o.add}`);
    const objectName = o.add;
    switch (objectName) {
      case 'camera': {
        this.camera = new Camera(o.width, o.height, o['field-of-view']);
        if (o.from && o.to && o.up) {
          const from = Tuple.point(o.from[0], o.from[1], o.from[2]);
          const to = Tuple.point(o.to[0], o.to[1], o.to[2]);
          const up = Tuple.vector(o.up[0], o.up[1], o.up[2]);
          this.camera.transform = Transform.viewTransform(from, to, up);
        }
        break;
      }
      case 'light': {
        const position = Tuple.point(o.at[0], o.at[1], o.at[2]);
        const intensity = new Colour(o.intensity[0], o.intensity[1], o.intensity[2]);
        this.world.light = new PointLight(position, intensity);
        break;
      }
      case 'sphere': {
        const sphere = new Sphere();
        Scene.setMaterial(sphere, o);
        Scene.setTransform(sphere, o);
        Scene.setPattern(sphere, o);
        this.world.objects.push(sphere);
        break;
      }
      case 'plane': {
        const plane = new Plane();
        Scene.setMaterial(plane, o);
        Scene.setTransform(plane, o);
        Scene.setPattern(plane, o);
        this.world.objects.push(plane);
        break;
      }
      default: {
        throw new Error(`add unknown object type: ${objectName}`);
      }
    }
  }

  static setPattern(shape, o) {
    if (o.material.pattern) {
      switch (o.material.pattern.type) {
        case 'checkers': {
          const c1 = new Colour(o.material.pattern.colors[0][0],
            o.material.pattern.colors[0][1],
            o.material.pattern.colors[0][2]);
          const c2 = new Colour(o.material.pattern.colors[1][0],
            o.material.pattern.colors[1][1],
            o.material.pattern.colors[1][2]);
          const isSphere = shape instanceof Sphere;
          const checker = new Checker(c1, c2, isSphere);
          shape.material.pattern = checker;
          break;
        }
        default: {
          throw new Error(`unknown pattern type: ${o.material.pattern.type}`);
        }
      }
    }
  }

  static setTransform(shape, o) {
    if (o.transform) {
      let finalTransform = Matrix.getIdentity();
      o.transform.forEach((t) => {
        switch (t[0]) {
          case 'scale': {
            console.log('  scale');
            const scale = Transform.scaling(t[1], t[2], t[3]);
            finalTransform = finalTransform.multiply(scale);
            break;
          }
          case 'translate': {
            console.log('  translate');
            const translate = Transform.translation(t[1], t[2], t[3]);
            finalTransform = finalTransform.multiply(translate);
            break;
          }
          case 'rotate-x': {
            console.log('  rotate-x');
            const rx = Transform.rotationX(t[1]);
            finalTransform = finalTransform.multiply(rx);
            break;
          }
          default: {
            throw new Error(`Unknown transform type: ${t}`);
          }
        }
      });
      shape.transform = finalTransform;
    }
  }

  static setMaterial(shape, o) {
    if (o.material.color) {
      shape.material.colour = new Colour(o.material.color[0], o.material.color[1], o.material.color[2]);
    }
    Scene.setValueExists(shape, o, 'id', 'ID');
    Scene.setValueExists(shape.material, o.material, 'ambient');
    Scene.setValueExists(shape.material, o.material, 'diffuse');
    Scene.setValueExists(shape.material, o.material, 'specular');
    Scene.setValueExists(shape.material, o.material, 'shininess');
    Scene.setValueExists(shape.material, o.material, 'reflective');
    Scene.setValueExists(shape.material, o.material, 'transparency');
    Scene.setValueExists(shape.material, o.material, 'refractive-index', 'refractiveIndex');
  }

  static setValueExists(m, o, value, internalValue) {
    if (Object.hasOwnProperty.call(o, value)) {
      m[internalValue || value] = o[value];
    }
  }

  _createScene() {
    this.data.forEach((o) => {
      if (o.add) {
        this._add(o);
      } else if (o.define) {
        console.log(`define: ${o.define}`);
      } else {
        throw new Error(`Unknown scene node: ${JSON.stringify(o)}`);
      }
    });
  }

  load(filename) {
    this.filename = filename;
    const fileData = fs.readFileSync(filename, 'utf-8');
    this.data = yaml.safeLoad(fileData);
    this._createScene();
  }

  render() {
    const hrstart = process.hrtime();
    const canvas = this.camera.render(this.world);
    const hrend = process.hrtime(hrstart);
    // eslint-disable-next-line no-console
    console.log(`Time ${hrend[0]}s ${hrend[1] / 1000000}ms`);
    const outputFile = `${path.basename(this.filename, '.yaml')}.ppm`;
    canvas.toPPMBinary(outputFile);
  }

  renderPixel(x, y) {
    this.camera.renderPixel(this.world, x, y);
  }
}

module.exports = Scene;
