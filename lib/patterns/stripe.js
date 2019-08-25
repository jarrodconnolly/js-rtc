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
   * @param {Tuple} patternPoint
   * @returns {Colour}
   */
  localPatternAt(patternPoint) {
    return Math.floor(patternPoint.x) % 2 === 0 ? this.a : this.b;
  }
}

module.exports = Stripe;
