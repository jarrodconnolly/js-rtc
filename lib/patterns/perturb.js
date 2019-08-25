const Pattern = require('./pattern');
const Noise = require('../../noise');

class Perturb extends Pattern {
  /**
   *
   * @param {Pattern} p
   * @param {Number} scale
   */
  constructor(p, scale = 0.25) {
    super();
    this.p = p;
    this.n = new Noise();
    this.scale = scale;
  }

  /**
   *
   * @param {Tuple} patternPoint
   * @returns {Colour}
   */
  localPatternAt(patternPoint) {
    const perturbedPoint = patternPoint;
    perturbedPoint.x += this.n.noise(perturbedPoint.x, perturbedPoint.y, perturbedPoint.z) * this.scale;
    perturbedPoint.y += this.n.noise(perturbedPoint.x, perturbedPoint.y, perturbedPoint.z) * this.scale;
    perturbedPoint.z += this.n.noise(perturbedPoint.x, perturbedPoint.y, perturbedPoint.z) * this.scale;
    return this.p.localPatternAt(perturbedPoint);
  }
}

module.exports = Perturb;
