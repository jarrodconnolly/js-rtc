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
   * @param {Tuple} patternPoint
   * @returns {Colour}
   */
  localPatternAt(patternPoint) {
    const distance = this.b.subtract(this.a);
    const fraction = patternPoint.x - Math.floor(patternPoint.x);
    return distance.multiply(fraction).add(this.a);
  }
}

module.exports = Gradient;
