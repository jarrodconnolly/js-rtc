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
    const distance = this.b.subtract(this.a);
    const fraction = this.patternPoint.x - Math.floor(this.patternPoint.x);
    return distance.multiply(fraction).add(this.a);
  }
}

module.exports = Gradient;
