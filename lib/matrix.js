const RtError = require('./rt-error');
const Tuple = require('./tuple');

class Matrix {
  constructor(rows, columns, data) {
    this.rows = rows;
    this.columns = columns;

    if (data) {
      if (rows * columns !== data.length) {
        throw new RtError(RtError.Code.INVALID_SIZE, 'Provided matrix data does not match matrix size');
      }
      this.data = new Float32Array(data);
    } else {
      this.data = new Float32Array(rows * columns);
    }
  }

  at(row, column) {
    return this.data[(row * this.columns) + column];
  }

  set(row, column, value) {
    this.data[(row * this.columns) + column] = value;
  }

  equals(b) {
    if (this.data.byteLength !== b.data.byteLength) return false;
    return this.data.every((val, i) => val === b.data[i]);
  }

  multiply(b) {
    if (b instanceof Tuple) {
      const x = this.at(0, 0) * b.x
        + this.at(0, 1) * b.y
        + this.at(0, 2) * b.z
        + this.at(0, 3) * b.w;

      const y = this.at(1, 0) * b.x
        + this.at(1, 1) * b.y
        + this.at(1, 2) * b.z
        + this.at(1, 3) * b.w;

      const z = this.at(2, 0) * b.x
        + this.at(2, 1) * b.y
        + this.at(2, 2) * b.z
        + this.at(2, 3) * b.w;

      const w = this.at(3, 0) * b.x
        + this.at(3, 1) * b.y
        + this.at(3, 2) * b.z
        + this.at(3, 3) * b.w;

      return new Tuple(x, y, z, w);
    }

    const result = new Matrix(b.rows, b.columns);
    for (let r = 0; r <= b.rows; r++) {
      for (let c = 0; c <= b.columns; c++) {
        const v = this.at(r, 0) * b.at(0, c)
          + this.at(r, 1) * b.at(1, c)
          + this.at(r, 2) * b.at(2, c)
          + this.at(r, 3) * b.at(3, c);
        result.set(r, c, v);
      }
    }
    return result;
  }
}

module.exports = Matrix;
