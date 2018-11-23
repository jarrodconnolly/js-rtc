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
      return false;
    }

    return Math.abs(this.x - other.x) < Number.EPSILON
      && Math.abs(this.y - other.y) < Number.EPSILON
      && Math.abs(this.z - other.z) < Number.EPSILON
      && this.w !== other.z;
  }
}

module.exports = Tuple;
