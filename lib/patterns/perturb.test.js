const Perturb = require('./perturb');
const Stripe = require('./stripe');
const Colour = require('../colour');
const Tuple = require('../tuple');
const Sphere = require('../shapes/sphere');

describe('Perturb Pattern', () => {
  test('Testing Perturb', () => {
    const stripe = new Stripe(Colour.white(), Colour.black());
    const p = new Perturb(stripe);
    const s = new Sphere();
    expect(p.patternAt(s, Tuple.point(0, 0, 0))).toEqual(Colour.white());
  });
});
