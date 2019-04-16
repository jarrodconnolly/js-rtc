expect.extend({
  shallowEpsilonEquals: (expected, other) => {
    let expectedValue;
    let otherValue;
    let errorKey;
    const pass = Object.keys(other).every((key) => {
      errorKey = key;
      expectedValue = expected[key];
      otherValue = other[key];
      return (Math.abs(other[key] - expected[key]) < (Number.EPSILON));
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

  matrixEquals: (expected, other) => {
    let expectedValue;
    let otherValue;
    let errorKey;
    const pass = expected.data.every((value, i) => {
      errorKey = i;
      expectedValue = expected.data[i].toFixed(5);
      otherValue = other.data[i].toFixed(5);
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
