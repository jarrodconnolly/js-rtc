const Shape = require('./shape');
const Tuple = require('../tuple');
const Intersect = require('../intersect');

class Sphere extends Shape {
  constructor() {
    super();
  }

  localNormalAt(localPoint) {
    return localPoint.subtract(this.origin);
  }

  intersect(ray) {
    super.intersect(ray);

    const sphereToRay = this.localRay.origin.subtract(Tuple.point(0, 0, 0));
    const a = this.localRay.direction.dotProduct(this.localRay.direction);
    const b = 2 * this.localRay.direction.dotProduct(sphereToRay);
    const c = sphereToRay.dotProduct(sphereToRay) - 1;

    const discriminant = (b ** 2) - 4 * a * c;

    // ray missed
    if (discriminant < 0) {
      return [];
    }

    // hit
    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x1 = Intersect.intersection(t1, this);
    const x2 = Intersect.intersection(t2, this);
    return [x1, x2];
  }
}

module.exports = Sphere;
