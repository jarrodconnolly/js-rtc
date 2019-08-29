const Helpers = require('./lib/helpers');

expect.extend({
  shallowEpsilonEquals: (expected, other, precision) => {
    let expectedValue;
    let otherValue;
    let errorKey;
    const comparisionPrecision = (precision !== undefined) ? precision : 14;
    const pass = Object.keys(other).every((key) => {
      errorKey = key;
      expectedValue = expected[key].toFixed(comparisionPrecision);
      otherValue = other[key].toFixed(comparisionPrecision);
      return (Math.abs(otherValue - expectedValue) < (Helpers.EPSILON));
    });
    if (pass) {
      return {
        message: () => (`expected ${expectedValue} NOT to be close to ${otherValue} for [${errorKey}]`),
        pass: true,
      };
    }
    return {
      message: () => (`expected ${expectedValue} to be close to ${otherValue} for [${errorKey}]`),
      pass: false,
    };
  },

  matrixEquals: (expected, other, precision) => {
    let expectedValue;
    let otherValue;
    let errorKey;
    const pass = expected.data.every((value, i) => {
      errorKey = i;
      expectedValue = expected.data[i].toFixed(precision || 14);
      otherValue = other.data[i].toFixed(precision || 14);
      return (Math.abs(otherValue - expectedValue)) < Helpers.EPSILON;
    });
    if (pass) {
      return {
        pass: true,
      };
    }
    return {
      message: () => (`expected ${expectedValue} to be close to ${otherValue} for [${errorKey}]`),
      pass: false,
    };
  },
});
