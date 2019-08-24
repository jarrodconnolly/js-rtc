const Ring = require('./ring');
const Colour = require('../colour');
const Tuple = require('../tuple');
const Sphere = require('../shapes/sphere');

describe('Ring Pattern', () => {
  test('A ring should extend in both x and z', () => {
    const p = new Ring(Colour.white(), Colour.black());
    const s = new Sphere();
    expect(p.patternAt(s, Tuple.point(0, 0, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(1, 0, 0))).toEqual(Colour.black());
    expect(p.patternAt(s, Tuple.point(0, 0, 1))).toEqual(Colour.black());
    // 0.708 = just slightly more than √2/2
    expect(p.patternAt(s, Tuple.point(0.708, 0, 0.708))).toEqual(Colour.black());
  });
});
