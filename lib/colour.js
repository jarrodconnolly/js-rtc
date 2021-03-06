const RtError = require('./rt-error');
const Helpers = require('./helpers');

class Colour {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static white() {
    return new Colour(1, 1, 1);
  }

  static black() {
    return new Colour(0, 0, 0);
  }

  equals(other) {
    if (!(other instanceof Colour)) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Colour equals can only accept a Colour');
    }

    return Math.abs(this.r - other.r) < Helpers.EPSILON
      && Math.abs(this.g - other.g) < Helpers.EPSILON
      && Math.abs(this.b - other.b) < Helpers.EPSILON;
  }

  /**
   *
   * @param other
   * @return {Colour}
   */
  add(other) {
    if (!(other instanceof Colour)) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Colour can only be added to Colour');
    }

    return new Colour(this.r + other.r,
      this.g + other.g,
      this.b + other.b);
  }

  /**
   *
   * @param other
   * @return {Colour}
   */
  subtract(other) {
    if (!(other instanceof Colour)) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Colour can only be subtracted from Colour');
    }

    return new Colour(this.r - other.r,
      this.g - other.g,
      this.b - other.b);
  }

  /**
   *
   * @param other
   * @return {Colour}
   */
  multiply(other) {
    if (other instanceof Colour) {
      return new Colour(this.r * other.r,
        this.g * other.g,
        this.b * other.b);
    }

    if (typeof other === 'number') {
      return new Colour(this.r * other,
        this.g * other,
        this.b * other);
    }

    throw new RtError(RtError.Code.INVALID_TYPE, 'Colour can only be multiplied by Colour or scalar');
  }
}

module.exports = Colour;
