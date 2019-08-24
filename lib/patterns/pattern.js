const Matrix = require('../matrix');

class Pattern {
  constructor() {
    this._transform = Matrix.getIdentity();
    this._transformInv = this._transform.inverse();
  }

  get transform() {
    return this._transform;
  }

  set transform(value) {
    this._transform = value;
    this._transformInv = this._transform.inverse();
  }

  get transformInv() {
    return this._transformInv;
  }

  /**
   *
   * @param {Shape} shape
   * @param {Tuple} worldPoint
   */
  patternAt(shape, worldPoint) {
    const objectPoint = shape.transformInv.multiply(worldPoint);
    this.patternPoint = this.transformInv.multiply(objectPoint);
  }
}

module.exports = Pattern;
