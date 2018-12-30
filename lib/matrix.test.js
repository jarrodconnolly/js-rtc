const RtError = require('./rt-error');
const Matrix = require('./matrix');

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
});
