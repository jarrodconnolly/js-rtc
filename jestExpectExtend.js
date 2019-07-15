expect.extend({
  shallowEpsilonEquals: (expected, other) => {
    let expectedValue;
    let otherValue;
    let errorKey;
    const pass = Object.keys(other).every((key) => {
      errorKey = key;
      expectedValue = expected[key].toFixed(14);
      otherValue = other[key].toFixed(14);
      return (Math.abs(otherValue - expectedValue) < (Number.EPSILON));
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
      return (Math.abs(otherValue - expectedValue)) < Number.EPSILON;
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
