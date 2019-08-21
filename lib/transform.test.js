const Transform = require('./transform');
const Tuple = require('./tuple');
const Matrix = require('./matrix');

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

    test('Reflection is scaling by a negative value', () => {
      const s = Transform.scaling(-1, 1, 1);
      const p = Tuple.point(2, 3, 4);
      expect(s.multiply(p)).toEqual(Tuple.point(-2, 3, 4));
    });
  });

  describe('Rotation', () => {
    test('Rotating a point around the x axis', () => {
      const p = Tuple.point(0, 1, 0);
      const halfQuarter = Transform.rotationX(Math.PI / 4);
      const fullQuarter = Transform.rotationX(Math.PI / 2);
      expect(halfQuarter.multiply(p))
        .shallowEpsilonEquals(Tuple.point(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2));
      expect(fullQuarter.multiply(p))
        .shallowEpsilonEquals(Tuple.point(0, 0, 1));
    });

    test('The inverse of an x-rotation rotates in the opposite direction', () => {
      const p = Tuple.point(0, 1, 0);
      const halfQuarter = Transform.rotationX(Math.PI / 4);
      const inv = halfQuarter.inverse();
      expect(inv.multiply(p))
        .shallowEpsilonEquals(Tuple.point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
    });

    test('Rotating a point around the y axis', () => {
      const p = Tuple.point(0, 0, 1);
      const halfQuarter = Transform.rotationY(Math.PI / 4);
      const fullQuarter = Transform.rotationY(Math.PI / 2);
      expect(halfQuarter.multiply(p))
        .shallowEpsilonEquals(Tuple.point(Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2));
      expect(fullQuarter.multiply(p))
        .shallowEpsilonEquals(Tuple.point(1, 0, 0));
    });

    test('Rotating a point around the z axis', () => {
      const p = Tuple.point(0, 1, 0);
      const halfQuarter = Transform.rotationZ(Math.PI / 4);
      const fullQuarter = Transform.rotationZ(Math.PI / 2);
      expect(halfQuarter.multiply(p))
        .shallowEpsilonEquals(Tuple.point(-Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0));
      expect(fullQuarter.multiply(p))
        .shallowEpsilonEquals(Tuple.point(-1, 0, 0));
    });
  });

  describe('Shearing', () => {
    test('A shearing transformation moves x in proportion to y', () => {
      const s = Transform.shearing(1, 0, 0, 0, 0, 0);
      const p = Tuple.point(2, 3, 4);
      expect(s.multiply(p))
        .shallowEpsilonEquals(Tuple.point(5, 3, 4));
    });
    test('A shearing transformation moves x in proportion to z', () => {
      const s = Transform.shearing(0, 1, 0, 0, 0, 0);
      const p = Tuple.point(2, 3, 4);
      expect(s.multiply(p))
        .shallowEpsilonEquals(Tuple.point(6, 3, 4));
    });
    test('A shearing transformation moves y in proportion to x', () => {
      const s = Transform.shearing(0, 0, 1, 0, 0, 0);
      const p = Tuple.point(2, 3, 4);
      expect(s.multiply(p))
        .shallowEpsilonEquals(Tuple.point(2, 5, 4));
    });
    test('A shearing transformation moves y in proportion to z', () => {
      const s = Transform.shearing(0, 0, 0, 1, 0, 0);
      const p = Tuple.point(2, 3, 4);
      expect(s.multiply(p))
        .shallowEpsilonEquals(Tuple.point(2, 7, 4));
    });
    test('A shearing transformation moves z in proportion to x', () => {
      const s = Transform.shearing(0, 0, 0, 0, 1, 0);
      const p = Tuple.point(2, 3, 4);
      expect(s.multiply(p))
        .shallowEpsilonEquals(Tuple.point(2, 3, 6));
    });
    test('A shearing transformation moves z in proportion to y', () => {
      const s = Transform.shearing(0, 0, 0, 0, 0, 1);
      const p = Tuple.point(2, 3, 4);
      expect(s.multiply(p))
        .shallowEpsilonEquals(Tuple.point(2, 3, 7));
    });
  });

  describe('Transformation Sequence', () => {
    test('Individual transformations are applied in sequence', () => {
      const p = Tuple.point(1, 0, 1);
      const A = Transform.rotationX(Math.PI / 2);
      const B = Transform.scaling(5, 5, 5);
      const C = Transform.translation(10, 5, 7);

      const p2 = A.multiply(p);
      expect(p2).shallowEpsilonEquals(Tuple.point(1, -1, 0));

      const p3 = B.multiply(p2);
      expect(p3).shallowEpsilonEquals(Tuple.point(5, -5, 0));

      const p4 = C.multiply(p3);
      expect(p4).shallowEpsilonEquals(Tuple.point(15, 0, 7));

      const T = C.multiply(B).multiply(A);
      const p5 = T.multiply(p);
      expect(p5).shallowEpsilonEquals(Tuple.point(15, 0, 7));
    });
  });

  describe('View Transform', () => {
    test('The transformation matrix for the default orientation', () => {
      const from = Tuple.point(0, 0, 0);
      const to = Tuple.point(0, 0, -1);
      const up = Tuple.vector(0, 1, 0);
      const t = Transform.viewTransform(from, to, up);
      expect(t).toEqual(Matrix.getIdentity());
    });
    test('A view transformation matrix looking in positive z direction', () => {
      const from = Tuple.point(0, 0, 0);
      const to = Tuple.point(0, 0, 1);
      const up = Tuple.vector(0, 1, 0);
      const t = Transform.viewTransform(from, to, up);
      expect(t).toEqual(Transform.scaling(-1, 1, -1));
    });
    test('The view transformation moves the world', () => {
      const from = Tuple.point(0, 0, 8);
      const to = Tuple.point(0, 0, 0);
      const up = Tuple.vector(0, 1, 0);
      const t = Transform.viewTransform(from, to, up);
      expect(t).toEqual(Transform.translation(0, 0, -8));
    });
    test('An arbitrary view transformation', () => {
      const from = Tuple.point(1, 3, 2);
      const to = Tuple.point(4, -2, 8);
      const up = Tuple.vector(1, 1, 0);
      const t = Transform.viewTransform(from, to, up);
      expect(t).matrixEquals(new Matrix(4, 4, [
        -0.50709, 0.50709, 0.67612, -2.36643,
        0.76772, 0.60609, 0.12122, -2.82843,
        -0.35857, 0.59761, -0.71714, 0.00000,
        0.00000, 0.00000, 0.00000, 1.00000]), 5);
    });
  });
});
