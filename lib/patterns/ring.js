const Pattern = require('./pattern');

class Ring extends Pattern {
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

    const p2x = this.patternPoint.x ** 2;
    const p2z = this.patternPoint.z ** 2;
    if (Math.floor(Math.sqrt(p2x + p2z)) % 2 === 0) {
      return this.a;
    }
    return this.b;
  }
}

module.exports = Ring;
