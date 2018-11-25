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

    return this.w === other.w
      && Math.abs(this.x - other.x) < Number.EPSILON
      && Math.abs(this.y - other.y) < Number.EPSILON
      && Math.abs(this.z - other.z) < Number.EPSILON;
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

  multiply(scalar) {
    return new Tuple(this.x * scalar,
      this.y * scalar,
      this.z * scalar,
      this.w * scalar);
  }

  divide(scalar) {
    return new Tuple(this.x / scalar,
      this.y / scalar,
      this.z / scalar,
      this.w / scalar);
  }

  magnitude() {
    if (this.w !== TupleTypes.Vector) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Magnitude can only be used with vectors');
    }

    return Math.sqrt((this.x ** 2)
      + (this.y ** 2)
      + (this.z ** 2));
  }

  normalize() {
    if (this.w !== TupleTypes.Vector) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Normalize can only be used with vectors');
    }
    const magnitude = this.magnitude();
    return this.divide(magnitude);
  }

  dotProduct(other) {
    if (this.w !== TupleTypes.Vector || other.w !== TupleTypes.Vector) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'dotProduct can only be used with vectors');
    }

    return (this.x * other.x)
      + (this.y * other.y)
      + (this.z * other.z);
  }

  crossProduct(other) {
    if (this.w !== TupleTypes.Vector || other.w !== TupleTypes.Vector) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'dotProduct can only be used with vectors');
    }

    return Tuple.vector(this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x);
  }
}

module.exports = Tuple;
