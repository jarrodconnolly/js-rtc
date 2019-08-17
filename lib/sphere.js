const Shape = require('./shape');
const Matrix = require('./matrix');
const Tuple = require('./tuple');
const Material = require('./materials');

class Sphere extends Shape {
  constructor() {
    super();
    this._transform = Matrix.getIdentity();
    this._transformInv = this._transform.inverse();
    this.material = new Material();
  }

  get transform() {
    return this._transform;
  }

  set transform(value) {
    this._transform = value;
    this._transformInv = this._transform.inverse();
  }

  get transformInv() {
    return this._transformInv;
  }

  normalAt(point) {
    const objectPoint = this._transformInv.multiply(point);
    const objectNormal = objectPoint.subtract(Tuple.point(0, 0, 0));
    const worldNormal = this._transformInv.transpose().multiply(objectNormal);
    worldNormal.w = 0;
    return worldNormal.normalize();
  }
}

module.exports = Sphere;
