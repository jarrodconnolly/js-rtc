const Shape = require('./shape');
const Tuple = require('../tuple');
const Intersect = require('../intersect');
const Helpers = require('../helpers');

class Plane extends Shape {
  constructor() {
    super();
    this.localNormal = Tuple.vector(0, 1, 0);
  }

  // eslint-disable-next-line no-unused-vars
  localNormalAt(localPoint) {
    return this.localNormal;
  }

  intersect(ray) {
    super.intersect(ray);
    if (Math.abs(this.localRay.direction.y) < Helpers.EPSILON) {
      return [];
    }

    const t = -this.localRay.origin.y / this.localRay.direction.y;
    return [Intersect.intersection(t, this)];
  }
}

module.exports = Plane;
