const Pattern = require('./pattern');

class Stripe extends Pattern {
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
    return Math.floor(this.patternPoint.x) % 2 === 0 ? this.a : this.b;
  }
}

module.exports = Stripe;
