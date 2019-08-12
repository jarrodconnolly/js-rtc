const Shape = require('./shape');
const Matrix = require('./matrix');

class Sphere extends Shape {
  constructor(props) {
    super(props);
    this.transform = Matrix.getIdentity();
  }
}

module.exports = Sphere;
