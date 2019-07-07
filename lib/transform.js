const Matrix = require('./matrix');

class Transform {
  static translation(x, y, z) {
    return new Matrix(4, 4, [
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1]);
  }

  static scaling(x, y, z) {
    return new Matrix(4, 4, [
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1]);
  }

  static rotationX(r) {
    const cosR = Math.cos(r);
    const sinR = Math.sin(r);
    return new Matrix(4, 4, [
      1, 0, 0, 0,
      0, cosR, -sinR, 0,
      0, sinR, cosR, 0,
      0, 0, 0, 1]);
  }
}

module.exports = Transform;
