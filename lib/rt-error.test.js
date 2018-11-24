const RtError = require('./rt-error');

const throwsError = (code, message) => () => {
  const e = new RtError(code, message);
  throw e;
};

describe('RtError', () => {
  test('custom error', () => {
    const errFunc = throwsError(RtError.Code.INVALID_TYPE, 'Unit Test');
    expect(errFunc).toThrowError(RtError);
    expect(errFunc).toThrowError(/1000/);
    expect(errFunc).toThrowError(/Invalid Type/);
    expect(errFunc).toThrowError(/Unit Test/);
  });

  test('throw custom error', () => {
    const errFunc = throwsError(RtError.Code.INVALID_TYPE, 'Unit Test');
    try {
      errFunc();
    } catch (e) {
      expect(e).toBeInstanceOf(RtError);
      expect(e.errorCode).toBe(1000);
      expect(e.errorMessage).toBe('Invalid Type');
      expect(e.message).toBe('[1000 - Invalid Type] Unit Test');
    }
  });
});
