const Colour = require('../colour');
const Tuple = require('../tuple');
const Sphere = require('../shapes/sphere');
const Transform = require('../transform');
const TestPattern = require('../patterns/testPattern');

describe('Test Patterns', () => {
  test('A pattern with an object transformation', () => {
    const s = new Sphere();
    s.transform = Transform.scaling(2, 2, 2);
    const p = new TestPattern();
    const c = p.patternAt(s, Tuple.point(2, 3, 4));
    expect(c).toEqual(new Colour(1, 1.5, 2));
  });
  test('A pattern with a pattern transformation', () => {
    const s = new Sphere();
    const p = new TestPattern();
    p.transform = Transform.scaling(2, 2, 2);
    const c = p.patternAt(s, Tuple.point(2, 3, 4));
    expect(c).toEqual(new Colour(1, 1.5, 2));
  });
  test('A pattern with both an object and a pattern transformation', () => {
    const s = new Sphere();
    s.transform = Transform.scaling(2, 2, 2);
    const p = new TestPattern();
    p.transform = Transform.translation(0.5, 1, 1.5);
    const c = p.patternAt(s, Tuple.point(2.5, 3, 3.5));
    expect(c).toEqual(new Colour(0.75, 0.5, 0.25));
  });
});
