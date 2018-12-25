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

    test('write a pixel', () => {
      const c = new Canvas(10, 20);
      const red = new Colour(1, 0, 0);
      c.writePixel(2, 3, red);
      expect(c.pixels[(3 * c.width) + 2]).toEqual(red);
    });

    test('ppm header', () => {
      const c = new Canvas(5, 3);
      const ppm = c.toPPM().split('\n');
      expect(ppm[0]).toEqual('P3');
      expect(ppm[1]).toEqual('5 3');
      expect(ppm[2]).toEqual('255');
    });

    test('ppm pixel data', () => {
      const c = new Canvas(5, 3);
      const c1 = new Colour(1.5, 0, 0);
      const c2 = new Colour(0, 0.5, 0);
      const c3 = new Colour(-0.5, 0, 1);
      c.writePixel(0, 0, c1);
      c.writePixel(2, 1, c2);
      c.writePixel(4, 2, c3);
      const ppm = c.toPPM().split('\n');
      expect(ppm[3]).toEqual('255 0 0 0 0 0 0 0 0 0 0 0 0 0 0');
      expect(ppm[4]).toEqual('0 0 0 0 0 0 0 128 0 0 0 0 0 0 0');
      expect(ppm[5]).toEqual('0 0 0 0 0 0 0 0 0 0 0 0 0 0 255');
    });

    test('ppm pixel data2', () => {
      const c = new Canvas(10, 2);
      const c1 = new Colour(1, 0.8, 0.6);
      for (let y = 0; y < c.height; y++) {
        for (let x = 0; x < c.width; x++) {
          c.writePixel(x, y, c1);
        }
      }
      const ppm = c.toPPM().split('\n');
      expect(ppm[3]).toEqual('255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204');
      expect(ppm[4]).toEqual('153 255 204 153 255 204 153 255 204 153 255 204 153');
      expect(ppm[5]).toEqual('255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204');
      expect(ppm[6]).toEqual('153 255 204 153 255 204 153 255 204 153 255 204 153');
    });

    test('ppm newline termination', () => {
      const c = new Canvas(5, 3);
      const ppm = c.toPPM();
      const lastCharacter = ppm[ppm.length - 1];
      expect(lastCharacter).toEqual('\n');
    });
  });
});
