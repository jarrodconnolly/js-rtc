const RtError = require('./rt-error');

class Colour {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  equals(other) {
    if (!(other instanceof Colour)) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Colour equals can only accept a Colour');
    }

    return Math.abs(this.r - other.r) < Number.EPSILON
      && Math.abs(this.g - other.g) < Number.EPSILON
      && Math.abs(this.b - other.b) < Number.EPSILON;
  }

  add(other) {
    if (!(other instanceof Colour)) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Colour can only be added to Colour');
    }

    return new Colour(this.r + other.r,
      this.g + other.g,
      this.b + other.b);
  }

  subtract(other) {
    if (!(other instanceof Colour)) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Colour can only be subtracted from Colour');
    }

    return new Colour(this.r - other.r,
      this.g - other.g,
      this.b - other.b);
  }

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
