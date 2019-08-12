class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  position(t) {
    return this.origin.add(this.direction.multiply(t));
  }

  static transform(ray, matrix) {
    const o = matrix.multiply(ray.origin);
    const d = matrix.multiply(ray.direction);
    return new Ray(o, d);
  }
}

module.exports = Ray;
