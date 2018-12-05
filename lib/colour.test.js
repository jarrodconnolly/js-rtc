const RtError = require('./rt-error');
const Colour = require('./colour');

describe('Colour', () => {
  describe('Creation', () => {
    test('create a colour', () => {
      const c = new Colour(-0.5, 0.4, 1.7);
      expect(c.r).toBe(-0.5);
      expect(c.g).toBe(0.4);
      expect(c.b).toBe(1.7);
    });
  });

  test('equality', () => {
    const c1 = new Colour(4.3, -4.2, 3.1);
    const c2 = new Colour(4.3, -4.2, 3.1);
    const c3 = new Colour(4.1, 4.7, -3.2);
    expect(c1.equals(c2)).toBe(true);
    expect(c1.equals(c3)).toBe(false);
    expect(() => c1.equals(5)).toThrowError(RtError);
    expect(() => c1.equals(undefined)).toThrowError(RtError);
    expect(() => c1.equals(null)).toThrowError(RtError);
  });

  describe('addition', () => {
    test('colour + colour', () => {
      const c1 = new Colour(0.9, 0.6, 0.75);
      const c2 = new Colour(0.7, 0.1, 0.25);
      expect(c1.add(c2)).toEqual(new Colour(1.6, 0.7, 1.0));
    });

    test('colour + object', () => {
      const c1 = new Colour(0.9, 0.6, 0.75);
      expect(() => c1.add({})).toThrowError(RtError);
    });
  });

  describe('subtraction', () => {
    test('colour - colour', () => {
      const c1 = new Colour(0.9, 0.6, 0.75);
      const c2 = new Colour(0.7, 0.1, 0.25);
      const equal = c1.subtract(c2).equals(new Colour(0.2, 0.5, 0.5));
      expect(equal).toBe(true);
    });

    test('colour - object', () => {
      const c1 = new Colour(0.9, 0.6, 0.75);
      expect(() => c1.subtract({})).toThrowError(RtError);
    });
  });

  test('colour * scalar', () => {
    const c1 = new Colour(0.2, 0.3, 0.4);
    expect(c1.multiply(2)).toEqual(new Colour(0.4, 0.6, 0.8));
  });
});
