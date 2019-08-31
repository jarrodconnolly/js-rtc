const Pattern = require('./pattern');
const Colour = require('../colour');

class TestPattern extends Pattern {
  constructor() {
    super();
  }

  /**
   *
   * @param {Tuple} patternPoint
   * @returns {Colour}
   */
  // eslint-disable-next-line class-methods-use-this
  localPatternAt(patternPoint) {
    return new Colour(patternPoint.x, patternPoint.y, patternPoint.z);
  }
}

module.exports = TestPattern;
