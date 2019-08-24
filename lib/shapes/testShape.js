const Shape = require('./shape');
const Tuple = require('../tuple');

class TestShape extends Shape {
  constructor() {
    super();
  }

  // eslint-disable-next-line class-methods-use-this
  localNormalAt(localPoint) {
    return Tuple.vector(localPoint.x, localPoint.y, localPoint.z);
  }

  intersect(ray) {
    super.intersect(ray);
    this.savedRay = this.localRay;
  }
}

module.exports = TestShape;
