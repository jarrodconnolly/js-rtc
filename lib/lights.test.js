const PointLight = require('./lights');
const Colour = require('./colour');
const Tuple = require('./tuple');

describe('Lights', () => {
  test('A point light has a position and intensity', () => {
    const intensity = new Colour(1, 1, 1);
    const position = Tuple.point(0, 0, 0);
    const l = new PointLight(position, intensity);
    expect(l.position).toEqual(position);
    expect(l.intensity).toEqual(intensity);
  });
});
