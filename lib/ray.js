class Ray {
  /**
   *
   * @param {Tuple} origin
   * @param {Tuple} direction
   */
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
    const hrTime = process.hrtime();
    this.ID = hrTime[0] * 1000000 + hrTime[1];
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
