const RtError = require('./rt-error');
const Helpers = require('./helpers');

const TupleTypes = {
  Point: 1.0,
  Vector: 0.0,
};

/**
 * @class Tuple
 */
class Tuple {
  static get Type() { return TupleTypes; }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @param {Number} w
   */
  constructor(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   *
   * @param x
   * @param y
   * @param z
   * @return {Tuple}
   */
  static point(x, y, z) {
    return new Tuple(x, y, z, Tuple.Type.Point);
  }

  static vector(x, y, z) {
    return new Tuple(x, y, z, Tuple.Type.Vector);
  }

  get type() {
    return this.w;
  }

  /**
   * @param {Tuple} other
   * @return {boolean}
   */
  equals(other) {
    if (!(other instanceof Tuple)) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Tuple equals can only accept a Tuple');
    }

    return this.w === other.w
      && Math.abs(this.x - other.x) < Helpers.EPSILON
      && Math.abs(this.y - other.y) < Helpers.EPSILON
      && Math.abs(this.z - other.z) < Helpers.EPSILON;
  }

  /**
   *
   * @param {Tuple} other
   * @return {Tuple}
   */
  add(other) {
    if (this.w === TupleTypes.Point && other.w === TupleTypes.Point) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Can not add Point to Point');
    }

    return new Tuple(this.x + other.x,
      this.y + other.y,
      this.z + other.z,
      this.w + other.w);
  }

  /**
   *
   * @param {Tuple} other
   * @return {Tuple}
   */
  subtract(other) {
    if (this.w === TupleTypes.Vector && other.w === TupleTypes.Point) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Can not subtract Point from Vector');
    }

    return new Tuple(this.x - other.x,
      this.y - other.y,
      this.z - other.z,
      this.w - other.w);
  }

  /**
   *
   * @return {Tuple}
   */
  negate() {
    return new Tuple(-this.x, -this.y, -this.z, -this.w);
  }

  /**
   *
   * @param {Number} scalar
   * @return {Tuple}
   */
  multiply(scalar) {
    return new Tuple(this.x * scalar,
      this.y * scalar,
      this.z * scalar,
      this.w * scalar);
  }

  /**
   *
   * @param {Number} scalar
   * @return {Tuple}
   */
  divide(scalar) {
    return new Tuple(this.x / scalar,
      this.y / scalar,
      this.z / scalar,
      this.w / scalar);
  }

  /**
   *
   * @return {number}
   */
  magnitude() {
    // TODO: commented out, checker uvmap for sphere needed magnitude of points ?
    // if (this.w !== TupleTypes.Vector) {
    // throw new RtError(RtError.Code.INVALID_TYPE, 'Magnitude can only be used with vectors');
    // }

    return Math.sqrt((this.x ** 2)
      + (this.y ** 2)
      + (this.z ** 2));
  }

  /**
   *
   * @return {Tuple}
   */
  normalize() {
    if (this.w !== TupleTypes.Vector) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'Normalize can only be used with vectors');
    }
    const magnitude = this.magnitude();
    return this.divide(magnitude);
  }

  /**
   *
   * @param {Tuple} other
   * @return {number}
   */
  dotProduct(other) {
    if (this.w !== TupleTypes.Vector || other.w !== TupleTypes.Vector) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'dotProduct can only be used with vectors');
    }

    return (this.x * other.x)
      + (this.y * other.y)
      + (this.z * other.z)
      + (this.w * other.w);
  }

  /**
   *
   * @param {Tuple} other
   * @return {Tuple}
   */
  crossProduct(other) {
    if (this.w !== TupleTypes.Vector || other.w !== TupleTypes.Vector) {
      throw new RtError(RtError.Code.INVALID_TYPE, 'crossProduct can only be used with vectors');
    }

    return Tuple.vector(this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x);
  }

  /**
   *
   * @param {Tuple} normal
   * @return {Tuple}
   */
  reflect(normal) {
    const dot = this.dotProduct(normal);
    const right = normal.multiply(2).multiply(dot);
    return this.subtract(right);
  }
}

module.exports = Tuple;
