class Shape {
  constructor() {
    const hrTime = process.hrtime();
    this.ID = hrTime[0] * 1000000 + hrTime[1];
  }
}

module.exports = Shape;
