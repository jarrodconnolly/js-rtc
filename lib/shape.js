const Matrix = require('./matrix');
const Material = require('./materials');
const Tuple = require('./tuple');
const Ray = require('./ray');
const RtError = require('./rt-error');

class Shape {
  constructor() {
    const hrTime = process.hrtime();
    this.ID = hrTime[0] * 1000000 + hrTime[1];

    this.origin = Tuple.point(0, 0, 0);

    this._transform = Matrix.getIdentity();
    this._transformInv = this._transform.inverse();

    this.material = new Material();

    this._localRay = null;
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

  intersect(ray) {
    this._localRay = Ray.transform(ray, this.transformInv);
  }

  // eslint-disable-next-line no-unused-vars,class-methods-use-this
  localNormalAt(localPoint) {
    throw new RtError(RtError.Code.MUST_OVERRIDE, 'shapes must override localNormalAt');
  }

  normalAt(point) {
    const localPoint = this._transformInv.multiply(point);
    const localNormal = this.localNormalAt(localPoint);
    const worldNormal = this._transformInv.transpose().multiply(localNormal);
    worldNormal.w = 0;
    return worldNormal.normalize();
  }
}

module.exports = Shape;
