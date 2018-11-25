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
    if (this.w === TupleTypes.Point && other.w === TupleTypes.Point) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Can not add Point to Point');
    }

    return new Tuple(this.x + other.x,
      this.y + other.y,
      this.z + other.z,
      this.w + other.w);
  }

  subtract(other) {
    if (this.w === TupleTypes.Vector && other.w === TupleTypes.Point) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Can not subtract Point from Vector');
    }

    return new Tuple(this.x - other.x,
      this.y - other.y,
      this.z - other.z,
      this.w - other.w);
  }

  negate() {
    return new Tuple(-this.x, -this.y, -this.z, -this.w);
  }
}

module.exports = Tuple;
