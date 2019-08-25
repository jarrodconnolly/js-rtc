const Pattern = require('./pattern');

class Checker extends Pattern {
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
   * @param {Tuple} patternPoint
   * @returns {Colour}
   */
  localPatternAt(patternPoint) {
    // uvmap for spheres
    if (this.uvMap) {
      const theta = Math.atan2(patternPoint.x, patternPoint.z) + Math.PI;
      const r = patternPoint.magnitude();
      const phi = Math.acos(patternPoint.y / r);

      const u = theta / (2 * Math.PI);
      const v = phi / Math.PI;

      if ((Math.floor(u * 20) + Math.floor(v * 10)) % 2 === 0) {
        return this.a;
      }
      return this.b;
    }

    // regular checker pattern
    const value = Math.floor(patternPoint.x) + Math.floor(patternPoint.y) + Math.floor(patternPoint.z);
    if (value % 2 === 0) {
      return this.a;
    }
    return this.b;
  }
}

module.exports = Checker;
