const Shape = require('./shape');
const Matrix = require('./matrix');

class Sphere extends Shape {
  constructor(props) {
    super(props);
    this._transform = Matrix.getIdentity();
    this._transformInv = this._transform.inverse();
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
}

module.exports = Sphere;
