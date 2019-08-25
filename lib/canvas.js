const fs = require('fs');
const Colour = require('./colour');

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = [];
    this.clear();
  }

  clear() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.pixels.push(new Colour(0, 0, 0));
      }
    }
  }

  writePixel(x, y, c) {
    this.pixels[(y * this.width) + x] = c;
  }

  pixelAt(x, y) {
    return this.pixels[(y * this.width) + x];
  }

  static ppmScale(value) {
    if (value < 0) {
      return 0;
    }
    if (value > 1) {
      return 255;
    }
    return Math.round(255 * value);
  }

  write(value) {
    if (this.lineLength + value.toString().length > 70) {
      this.ppm += value.replace(' ', '\n');
      this.lineLength = 0;
    } else {
      this.ppm += value;
    }
    this.lineLength += value.toString().length;
  }

  toPPMBinary(filename) {
    const f = fs.createWriteStream(filename);
    f.write(`P6 ${this.width} ${this.height} 255\n`, 'utf-8');
    for (let i = 0; i < this.pixels.length; i++) {
      const b = Buffer.alloc(3);
      b.writeUInt8(Canvas.ppmScale(this.pixels[i].r), 0);
      b.writeUInt8(Canvas.ppmScale(this.pixels[i].g), 1);
      b.writeUInt8(Canvas.ppmScale(this.pixels[i].b), 2);
      f.write(b);
    }
    f.end();
  }

  toPPM() {
    this.ppm = 'P3\n';
    this.ppm += `${this.width} ${this.height}\n`;
    this.ppm += '255\n';
    for (let y = 0; y < this.height; y++) {
      this.lineLength = 0;
      for (let x = 0; x < this.width; x++) {
        const c = this.pixels[(y * this.width) + x];

        let red = '';
        if (x > 0) {
          red += ' ';
        }
        red += Canvas.ppmScale(c.r);
        this.write(red);

        const green = ` ${Canvas.ppmScale(c.g)}`;
        this.write(green);

        const blue = ` ${Canvas.ppmScale(c.b)}`;
        this.write(blue);
      }

      this.ppm += '\n';
    }
    return this.ppm;
  }
}

module.exports = Canvas;
