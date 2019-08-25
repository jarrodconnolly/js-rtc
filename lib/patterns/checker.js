const Pattern = require('./pattern');

class Gradient extends Pattern {
  /**
   *
   * @param {Colour} a
   * @param {Colour} b
   * @param {Boolean} uvMap Use spherical uv mapping
   */
  constructor(a, b, uvMap = false) {
    super();

    this.a = a;
    this.b = b;
    this.uvMap = uvMap;
  }

  /**
   *
   * @param {Shape} shape
   * @param {Tuple} worldPoint
   */
  patternAt(shape, worldPoint) {
    super.patternAt(shape, worldPoint);

    // uvmap for spheres
    if (this.uvMap) {
      const theta = Math.atan2(this.patternPoint.x, this.patternPoint.z) + Math.PI;
      const r = this.patternPoint.magnitude();
      const phi = Math.acos(this.patternPoint.y / r);

      const u = theta / (2 * Math.PI);
      const v = phi / Math.PI;

      if ((Math.floor(u * 20) + Math.floor(v * 10)) % 2 === 0) {
        return this.a;
      }
      return this.b;
    }

    // regular checker pattern
    const value = Math.floor(this.patternPoint.x) + Math.floor(this.patternPoint.y) + Math.floor(this.patternPoint.z);
    if (value % 2 === 0) {
      return this.a;
    }
    return this.b;
  }
}

module.exports = Gradient;
