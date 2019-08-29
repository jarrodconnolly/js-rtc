const Matrix = require('./lib/matrix');

describe('jest expect shallowEpsilonEquals', () => {
  test('shallowEpsilonEquals equals', () => {
    const o1 = {
      a: 0.1 + 0.2,
    };
    const o2 = {
      a: 0.3,
    };
    expect(o1).shallowEpsilonEquals(o2);
  });

  test('shallowEpsilonEquals not equals', () => {
    const o1 = {
      a: 0.1 + 0.2,
    };
    const o2 = {
      a: 0.300001,
    };
    expect(o1).not.shallowEpsilonEquals(o2);
  });

  test('shallowEpsilonEquals failure', () => {
    expect.assertions(3);
    const o1 = {
      a: 0.1 + 0.2,
    };
    const o2 = {
      a: 0.4,
    };
    try {
      expect(o1).shallowEpsilonEquals(o2);
    } catch (e) {
      expect(e.message).toContain(0.3000000000);
      expect(e.matcherResult.pass).toBe(false);
    }
  });

  test('matrixEquals failure', () => {
    expect.assertions(4);
    const m1 = new Matrix(2, 2, [1, 2, 3, 4]);
    const m2 = new Matrix(2, 2, [1, 2, 3, 6]);
    try {
      expect(m1).matrixEquals(m2);
    } catch (e) {
      expect(e.message).toContain(4.00000);
      expect(e.message).toContain(6.00000);
      expect(e.matcherResult.pass).toBe(false);
    }
  });
});
