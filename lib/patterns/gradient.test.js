const Gradient = require('./gradient');
const Colour = require('../colour');
const Tuple = require('../tuple');
const Sphere = require('../shapes/sphere');

describe('Gradient Pattern', () => {
  test('A gradient linearly interpolates between colors', () => {
    const p = new Gradient(Colour.white(), Colour.black());
    const s = new Sphere();
    expect(p.patternAt(s, Tuple.point(0, 0, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0.25, 0, 0))).toEqual(new Colour(0.75, 0.75, 0.75));
    expect(p.patternAt(s, Tuple.point(0.5, 0, 0))).toEqual(new Colour(0.5, 0.5, 0.5));
    expect(p.patternAt(s, Tuple.point(0.75, 0, 0))).toEqual(new Colour(0.25, 0.25, 0.25));
  });
});
