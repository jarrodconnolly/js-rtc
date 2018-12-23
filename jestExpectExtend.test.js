
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
      a: 0.300000000000001,
    };
    expect(o1).not.shallowEpsilonEquals(o2);
  });
  test('shallowEpsilonEquals failure', () => {
    const o1 = {
      a: 0.1 + 0.2,
    };
    const o2 = {
      a: 0.4,
    };
    try {
      expect(o1).shallowEpsilonEquals(o2);
    } catch (e) {
      expect(e.message).toContain(0.30000000000000004);
      expect(e.matcherResult.pass).toBe(false);
    }
  });
});
