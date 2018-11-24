const RtError = require('./rt-error');

const TupleTypes = {
  Point: 1.0,
  Vector: 0.0,
};

class Tuple {
  static get Type() { return TupleTypes; }

  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static point(x, y, z) {
    return new Tuple(x, y, z, Tuple.Type.Point);
  }

  static vector(x, y, z) {
    return new Tuple(x, y, z, Tuple.Type.Vector);
  }

  equals(other) {
    if (!(other instanceof Tuple)) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Tuple equals can only accept a Tuple');;
    }

    return Math.abs(this.x - other.x) < Number.EPSILON
      && Math.abs(this.y - other.y) < Number.EPSILON
      && Math.abs(this.z - other.z) < Number.EPSILON
      && this.w !== other.z;
  }

  add(other) {
    return new Tuple(this.x + other.x,
      this.y + other.y,
      this.z + other.z,
      this.w + other.w);
  }

  subtract(other) {
    return new Tuple(this.x - other.x,
      this.y - other.y,
      this.z - other.z,
      this.w - other.w);
  }
}

module.exports = Tuple;
