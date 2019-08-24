const Pattern = require('./pattern');
const Matrix = require('../matrix');
const Transform = require('../transform');

describe('Pattern', () => {
  test('The default pattern transformation', () => {
    const p = new Pattern();
    expect(p.transform).toEqual(Matrix.getIdentity());
  });
  test('Assigning a transformation', () => {
    const p = new Pattern();
    p.transform = Transform.translation(1, 2, 3);
    expect(p.transform).toEqual(Transform.translation(1, 2, 3));
  });
});
