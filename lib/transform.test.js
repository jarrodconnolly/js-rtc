const Transform = require('./transform');
const Tuple = require('./tuple');

describe('Matrix Transform', () => {
  describe('Translation', () => {
    test('Multiplying by a translation matrix', () => {
      const t = Transform.translation(5, -3, 2);
      const p = Tuple.point(-3, 4, 5);
      expect(t.multiply(p)).toEqual(Tuple.point(2, 1, 7));
    });

    test('Multiplying by the inverse of a translation matrix', () => {
      const t = Transform.translation(5, -3, 2);
      const inv = t.inverse();
      const p = Tuple.point(-3, 4, 5);
      expect(inv.multiply(p)).toEqual(Tuple.point(-8, 7, 3));
    });

    test('Translation does not affect vectors', () => {
      const t = Transform.translation(5, -3, 2);
      const v = Tuple.vector(-3, 4, 5);
      expect(t.multiply(v)).toEqual(v);
    });
  });

  describe('Scaling', () => {
    test('A scaling matrix applied to a point', () => {
      const s = Transform.scaling(2, 3, 4);
      const p = Tuple.point(-4, 6, 8);
      expect(s.multiply(p)).toEqual(Tuple.point(-8, 18, 32));
    });

    test('A scaling matrix applied to a vector', () => {
      const s = Transform.scaling(2, 3, 4);
      const v = Tuple.vector(-4, 6, 8);
      expect(s.multiply(v)).toEqual(Tuple.vector(-8, 18, 32));
    });

    test('Multiplying by the inverse of a scaling matrix', () => {
      const t = Transform.scaling(2, 3, 4);
      const inv = t.inverse();
      const v = Tuple.vector(-4, 6, 8);
      expect(inv.multiply(v)).shallowEpsilonEquals(Tuple.vector(-2, 2, 2));
    });
  });
});