const Matrix = require('./matrix');
const Ray = require('./ray');
const Tuple = require('./tuple');
const Canvas = require('./canvas');

class Camera {
  constructor(hsize, vsize, fov) {
    this.hsize = hsize;
    this.vsize = vsize;
    this.fov = fov;
    this.transform = Matrix.getIdentity();

    const halfView = Math.tan(this.fov / 2);
    const aspect = this.hsize / this.vsize;

    if (aspect >= 1) {
      this.halfWidth = halfView;
      this.halfHeight = halfView / aspect;
    } else {
      this.halfWidth = halfView / aspect;
      this.halfHeight = halfView;
    }

    this.pixelSize = (this.halfWidth * 2) / this.hsize;
  }

  rayForPixel(px, py) {
    // the offset from the edge of the canvas to the pixel's center
    const xOffset = (px + 0.5) * this.pixelSize;
    const yOffset = (py + 0.5) * this.pixelSize;
    // the untransformed coordinates of the pixel in world space.
    // (remember that the camera looks toward -z, so +x is to the *left*.)
    const worldX = this.halfWidth - xOffset;
    const worldY = this.halfHeight - yOffset;
    // using the camera matrix, transform the canvas point and the origin,
    // and then compute the ray's direction vector.
    // (remember that the canvas is at z=-1)
    const pixel = this.transform.inverse().multiply(Tuple.point(worldX, worldY, -1));
    const origin = this.transform.inverse().multiply(Tuple.point(0, 0, 0));
    const direction = pixel.subtract(origin).normalize();
    return new Ray(origin, direction);
  }

  render(world) {
    const image = new Canvas(this.hsize, this.vsize);
    for (let y = 0; y <= this.vsize; y++) {
      for (let x = 0; x <= this.hsize; x++) {
        const ray = this.rayForPixel(x, y);
        const colour = world.colorAt(ray);
        image.writePixel(x, y, colour);
      }
    }
    return image;
  }
}

module.exports = Camera;
