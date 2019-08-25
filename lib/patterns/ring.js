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
   * @param {Tuple} patternPoint
   * @returns {Colour}
   */
  localPatternAt(patternPoint) {
    const p2x = patternPoint.x ** 2;
    const p2z = patternPoint.z ** 2;
    if (Math.floor(Math.sqrt(p2x + p2z)) % 2 === 0) {
      return this.a;
    }
    return this.b;
  }
}

module.exports = Ring;
