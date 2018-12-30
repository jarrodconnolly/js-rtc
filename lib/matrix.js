const RtError = require('./rt-error');

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
}

module.exports = Matrix;
