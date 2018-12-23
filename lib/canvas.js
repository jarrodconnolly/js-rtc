const Colour = require('./colour');

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.pixels.push(new Colour(0, 0, 0));
      }
    }
  }
}

module.exports = Canvas;
