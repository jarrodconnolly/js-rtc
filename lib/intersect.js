const Tuple = require('./tuple');
const Ray = require('./ray');

class Intersect {
  static intersect(shape, ray) {
    const ray2 = Ray.transform(ray, shape.transformInv);
    const sphereToRay = ray2.origin.subtract(Tuple.point(0, 0, 0));
    const a = ray2.direction.dotProduct(ray2.direction);
    const b = 2 * ray2.direction.dotProduct(sphereToRay);
    const c = sphereToRay.dotProduct(sphereToRay) - 1;

    const discriminant = (b ** 2) - 4 * a * c;

    // ray missed
    if (discriminant < 0) {
      return [];
    }

    // hit
    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x1 = this.intersection(t1, shape);
    const x2 = this.intersection(t2, shape);
    return [x1, x2];
  }

  static intersection(t, shape) {
    return {
      t: t,
      object: shape,
    };
  }

  static intersections(...rest) {
    return rest.filter(i => i.t >= 0);
  }

  static hit(xs) {
    return xs.sort((a, b) => a.t - b.t)[0];
  }
}

module.exports = Intersect;
