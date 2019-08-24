const Stripe = require('./stripe');
const Colour = require('../colour');
const Tuple = require('../tuple');
const Sphere = require('../shapes/sphere');
const Transform = require('../transform');

describe('Stripe Patterns', () => {
  test('Creating a stripe pattern', () => {
    const p = new Stripe(Colour.white(), Colour.black());
    expect(p.a).toEqual(Colour.white());
    expect(p.b).toEqual(Colour.black());
  });
  test('A stripe pattern is constant in y', () => {
    const s = new Sphere();
    const p = new Stripe(Colour.white(), Colour.black());
    expect(p.patternAt(s, Tuple.point(0, 0, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0, 1, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0, 2, 0))).toEqual(Colour.white());
  });
  test('A stripe pattern is constant in z', () => {
    const s = new Sphere();
    const p = new Stripe(Colour.white(), Colour.black());
    expect(p.patternAt(s, Tuple.point(0, 0, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0, 0, 1))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0, 0, 2))).toEqual(Colour.white());
  });
  test('A stripe pattern alternates in x', () => {
    const s = new Sphere();
    const p = new Stripe(Colour.white(), Colour.black());
    expect(p.patternAt(s, Tuple.point(0, 0, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(0.9, 0, 0))).toEqual(Colour.white());
    expect(p.patternAt(s, Tuple.point(1, 0, 0))).toEqual(Colour.black());
    expect(p.patternAt(s, Tuple.point(-0.1, 0, 0))).toEqual(Colour.black());
    expect(p.patternAt(s, Tuple.point(-1, 0, 0))).toEqual(Colour.black());
    expect(p.patternAt(s, Tuple.point(-1.1, 0, 0))).toEqual(Colour.white());
  });
  test('Stripes with an object transformation', () => {
    const s = new Sphere();
    s.transform = Transform.scaling(2, 2, 2);
    const p = new Stripe(Colour.white(), Colour.black());
    const c = p.patternAt(s, Tuple.point(1.5, 0, 0));
    expect(c).toEqual(Colour.white());
  });
  test('Stripes with a pattern transformation', () => {
    const s = new Sphere();
    const p = new Stripe(Colour.white(), Colour.black());
    p.transform = Transform.scaling(2, 2, 2);
    const c = p.patternAt(s, Tuple.point(1.5, 0, 0));
    expect(c).toEqual(Colour.white());
  });
  test('Stripes with both an object and a pattern transformation', () => {
    const s = new Sphere();
    s.transform = Transform.scaling(2, 2, 2);
    const p = new Stripe(Colour.white(), Colour.black());
    p.transform = Transform.translation(0.5, 0, 0);
    const c = p.patternAt(s, Tuple.point(2.5, 0, 0));
    expect(c).toEqual(Colour.white());
  });
});
