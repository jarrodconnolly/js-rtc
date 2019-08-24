const Checker = require('./checker');
const Colour = require('../colour');
const Tuple = require('../tuple');
const Sphere = require('../shapes/sphere');

describe('Checker Pattern', () => {
  test('Checkers should repeat in x', () => {
    const p = new Checker(Colour.white(), Colour.black());
    const s = new Sphere();
    expect(p.patternAt(s, Tuple.point(0, 0, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0.99, 0, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(1.01, 0, 0))).toEqual(Colour.black());
  });
  test('Checkers should repeat in y', () => {
    const p = new Checker(Colour.white(), Colour.black());
    const s = new Sphere();
    expect(p.patternAt(s, Tuple.point(0, 0, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0, 0.99, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0, 1.01, 0))).toEqual(Colour.black());
  });
  test('Checkers should repeat in z', () => {
    const p = new Checker(Colour.white(), Colour.black());
    const s = new Sphere();
    expect(p.patternAt(s, Tuple.point(0, 0, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0, 0, 0.99))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0, 0, 1.01))).toEqual(Colour.black());
  });
});
