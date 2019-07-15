const RtError = require('./rt-error');
const Matrix = require('./matrix');
const Tuple = require('./tuple');

describe('Matrix', () => {
  test('create an empty Matrix', () => {
    const m = new Matrix(2, 2);
    expect(m.rows).toBe(2);
    expect(m.columns).toBe(2);
    expect(m.data).toHaveLength(4);
    m.data.forEach((d) => {
      expect(d).toEqual(0);
    });
  });

  test('create a Matrix 4x4', () => {
    const data = [1, 2, 3, 4, 5.5, 6.5, 7.5, 8.5, 9, 10, 11, 12, 13.5, 14.5, 15.5, 16.5];
    const m = new Matrix(4, 4, data);
    expect(m.rows).toBe(4);
    expect(m.columns).toBe(4);
    expect(m.data).toHaveLength(16);
    expect(m.at(0, 0)).toEqual(1);
    expect(m.at(0, 3)).toEqual(4);
    expect(m.at(1, 0)).toEqual(5.5);
    expect(m.at(1, 2)).toEqual(7.5);
    expect(m.at(2, 2)).toEqual(11);
    expect(m.at(3, 0)).toEqual(13.5);
    expect(m.at(3, 2)).toEqual(15.5);
  });

  test('create a Matrix 2x2', () => {
    const data = [-3, 5, 1, -2];
    const m = new Matrix(2, 2, data);
    expect(m.rows).toBe(2);
    expect(m.columns).toBe(2);
    expect(m.data).toHaveLength(4);
    expect(m.at(0, 0)).toEqual(-3);
    expect(m.at(0, 1)).toEqual(5);
    expect(m.at(1, 0)).toEqual(1);
    expect(m.at(1, 1)).toEqual(-2);
  });

  test('create a Matrix 3x3', () => {
    const data = [-3, 5, 0, 1, -2, -7, 0, 1, 1];
    const m = new Matrix(3, 3, data);
    expect(m.rows).toBe(3);
    expect(m.columns).toBe(3);
    expect(m.data).toHaveLength(9);
    expect(m.at(0, 0)).toEqual(-3);
    expect(m.at(1, 1)).toEqual(-2);
    expect(m.at(2, 2)).toEqual(1);
  });

  test('create a Matrix error', () => {
    const data = [];
    let m;
    try {
      m = new Matrix(3, 3, data);
    } catch (e) {
      expect(e instanceof RtError).toEqual(true);
    }
    return m;
  });

  test('equality true', () => {
    const m1 = new Matrix(4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
    const m2 = new Matrix(4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
    expect(m1.equals(m2)).toEqual(true);
  });

  test('equality false', () => {
    const m1 = new Matrix(4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
    const m2 = new Matrix(4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 1]);
    expect(m1.equals(m2)).toEqual(false);
  });

  test('equality different size', () => {
    const m1 = new Matrix(4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
    const m2 = new Matrix(2, 2, [1, 2, 3, 4]);
    expect(m1.equals(m2)).toEqual(false);
  });

  test('multiply matrix x matrix', () => {
    const m1 = new Matrix(4, 4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2]);
    const m2 = new Matrix(4, 4, [-2, 1, 2, 3, 3, 2, 1, -1, 4, 3, 6, 5, 1, 2, 7, 8]);
    const result = new Matrix(4, 4,
      [20, 22, 50, 48, 44, 54, 114, 108, 40, 58, 110, 102, 16, 26, 46, 42]);
    expect(m1.multiply(m2)).toEqual(result);
  });

  test('multiply matrix x tuple', () => {
    const m = new Matrix(4, 4, [1, 2, 3, 4, 2, 4, 4, 2, 8, 6, 4, 1, 0, 0, 0, 1]);
    const t = new Tuple(1, 2, 3, 1);
    const result = new Tuple(18, 24, 33, 1);
    expect(m.multiply(t)).toEqual(result);
  });

  test('multiply matrix x []', () => {
    const m = new Matrix(4, 4, [1, 2, 3, 4, 2, 4, 4, 2, 8, 6, 4, 1, 0, 0, 0, 1]);
    expect(() => m.multiply([])).toThrowError(RtError);
  });

  test('multiply matrix x identity matrix', () => {
    const m = new Matrix(4, 4, [0, 1, 2, 4, 1, 2, 4, 8, 2, 4, 8, 16, 4, 8, 16, 32]);
    expect(m.multiply(Matrix.getIdentity())).toEqual(m);
  });

  test('multiply identity matrix x tuple', () => {
    const m = Matrix.getIdentity();
    const t = new Tuple(1, 2, 3, 4);
    expect(m.multiply(t)).toEqual(t);
  });

  test('matrix transpose', () => {
    const m = new Matrix(4, 4, [0, 9, 3, 0, 9, 8, 0, 8, 1, 8, 5, 3, 0, 0, 5, 8]);
    const result = new Matrix(4, 4, [0, 9, 1, 0, 9, 8, 8, 0, 3, 0, 5, 5, 0, 8, 3, 8]);
    expect(m.transpose()).toEqual(result);
  });

  test('identity matrix transpose', () => {
    const m = Matrix.getIdentity();
    expect(m.transpose()).toEqual(m);
  });

  test('determinant of 2x2 matrix', () => {
    const m = new Matrix(2, 2, [1, 5, -3, 2]);
    expect(m.determinant()).toEqual(17);
  });

  test('submatrix of 3x3', () => {
    const m = new Matrix(3, 3, [1, 5, 0, -3, 2, 7, 0, 6, -3]);
    expect(m.submatrix(0, 2)).toEqual(new Matrix(2, 2, [-3, 2, 0, 6]));
  });

  test('submatrix of 4x4', () => {
    const m = new Matrix(4, 4, [-6, 1, 1, 6, -8, 5, 8, 6, -1, 0, 8, 2, -7, 1, -1, 1]);
    expect(m.submatrix(2, 1)).toEqual(new Matrix(3, 3, [-6, 1, 6, -8, 8, 6, -7, -1, 1]));
  });

  test('minor of 3x3 matrix', () => {
    const m = new Matrix(3, 3, [3, 5, 0, 2, -1, -7, 6, -1, 5]);
    expect(m.minor(1, 0)).toEqual(25);
  });

  test('cofactor of 3x3 matrix', () => {
    const m = new Matrix(3, 3, [3, 5, 0, 2, -1, -7, 6, -1, 5]);
    expect(m.minor(0, 0)).toEqual(-12);
    expect(m.cofactor(0, 0)).toEqual(-12);
    expect(m.minor(1, 0)).toEqual(25);
    expect(m.cofactor(1, 0)).toEqual(-25);
  });

  test('determinant of 3x3 matrix', () => {
    const m = new Matrix(3, 3, [1, 2, 6, -5, 8, -4, 2, 6, 4]);
    expect(m.cofactor(0, 0)).toEqual(56);
    expect(m.cofactor(0, 1)).toEqual(12);
    expect(m.cofactor(0, 2)).toEqual(-46);
    expect(m.determinant()).toEqual(-196);
  });

  test('determinant of 4x4 matrix', () => {
    const m = new Matrix(4, 4, [-2, -8, 3, 5, -3, 1, 7, 3, 1, 2, -9, 6, -6, 7, 7, -9]);
    expect(m.cofactor(0, 0)).toEqual(690);
    expect(m.cofactor(0, 1)).toEqual(447);
    expect(m.cofactor(0, 2)).toEqual(210);
    expect(m.cofactor(0, 3)).toEqual(51);
    expect(m.determinant()).toEqual(-4071);
  });

  test('is invertable', () => {
    const m = new Matrix(4, 4, [6, 4, 4, 4, 5, 5, 7, 6, 4, -9, 3, -7, 9, 1, 7, -6]);
    expect(m.isInvertible()).toEqual(true);
  });

  test('is not invertable', () => {
    const m = new Matrix(4, 4, [-4, 2, -2, -3, 9, 6, 2, 6, 0, -5, 1, -5, 0, 0, 0, 0]);
    expect(m.isInvertible()).toEqual(false);
  });

  test('matrix inverse first', () => {
    const m = new Matrix(4, 4, [-5, 2, 6, -8, 1, -5, 1, 8, 7, 7, -6, -7, 1, -3, 7, 4]);
    const inverse = m.inverse();
    expect(m.determinant()).toEqual(532);
    expect(m.cofactor(2, 3)).toEqual(-160);
    expect(inverse.at(3, 2)).toBeCloseTo(-160 / 532);
    expect(m.cofactor(3, 2)).toEqual(105);
    expect(inverse.at(2, 3)).toBeCloseTo(105 / 532);
    const result = new Matrix(4, 4, [
      0.21805, 0.45113, 0.24060, -0.04511,
      -0.80827, -1.45677, -0.44361, 0.52068,
      -0.07895, -0.22368, -0.05263, 0.19737,
      -0.52256, -0.81391, -0.30075, 0.30639,
    ]);
    expect(inverse).matrixEquals(result, 5);
  });

  test('matrix inverse second', () => {
    const m = new Matrix(4, 4, [8, -5, 9, 2, 7, 5, 6, 1, -6, 0, 9, 6, -3, 0, -9, -4]);
    const inverse = m.inverse();
    const result = new Matrix(4, 4, [
      -0.15385, -0.15385, -0.28205, -0.53846,
      -0.07692, 0.12308, 0.02564, 0.03077,
      0.35897, 0.35897, 0.43590, 0.92308,
      -0.69231, -0.69231, -0.76923, -1.92308,
    ]);
    expect(inverse).matrixEquals(result, 5);
  });

  test('matrix inverse third', () => {
    const m = new Matrix(4, 4, [9, 3, 0, 9, -5, -2, -6, -3, -4, 9, 6, 4, -7, 6, 6, 2]);
    const inverse = m.inverse();
    const result = new Matrix(4, 4, [
      -0.04074, -0.07778, 0.14444, -0.22222,
      -0.07778, 0.03333, 0.36667, -0.33333,
      -0.02901, -0.14630, -0.10926, 0.12963,
      0.17778, 0.06667, -0.26667, 0.33333,
    ]);
    expect(inverse).matrixEquals(result, 5);
  });

  test('matrix inverse failed', () => {
    const m = new Matrix(4, 4, [-4, 2, -2, -3, 9, 6, 2, 6, 0, -5, 1, -5, 0, 0, 0, 0]);
    expect(() => m.inverse()).toThrowError(RtError);
  });

  test('multiply product by inverse', () => {
    const A = new Matrix(4, 4, [3, -9, 7, 3, 3, -8, 2, -9, -4, 4, 4, 1, -6, 5, -1, 1]);
    const B = new Matrix(4, 4, [8, 2, 2, 2, 3, -1, 7, 0, 7, 0, 5, 4, 6, -2, 0, 5]);

    const C = A.multiply(B);

    expect(C.multiply(B.inverse())).matrixEquals(A, 5);
  });
});
