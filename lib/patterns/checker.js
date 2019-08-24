const Pattern = require('./pattern');

class Gradient extends Pattern {
  /**
   *
   * @param {Colour} a
   * @param {Colour} b
   */
  constructor(a, b) {
    super();

    this.a = a;
    this.b = b;
  }

  /**
   *
   * @param {Shape} shape
   * @param {Tuple} worldPoint
   */
  patternAt(shape, worldPoint) {
    super.patternAt(shape, worldPoint);
    const value = Math.floor(this.patternPoint.x) + Math.floor(this.patternPoint.y) + Math.floor(this.patternPoint.z);
    if (value % 2 === 0) {
      return this.a;
    }
    return this.b;
  }
}

module.exports = Gradient;
