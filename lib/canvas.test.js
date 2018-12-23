const Canvas = require('./canvas');
const Colour = require('./colour');

describe('Canvas', () => {
  describe('Creation', () => {
    test('create a canvas', () => {
      const c = new Canvas(10, 20);
      const c1 = new Colour(0, 0, 0);
      expect(c.width).toBe(10);
      expect(c.height).toBe(20);
      expect(c.pixels).toHaveLength(200);
      c.pixels.forEach((p) => {
        expect(p).toEqual(c1);
      });
    });
  });
});
