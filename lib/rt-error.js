
const errorCodes = {
  INVALID_TYPE: 1000,
  INVALID_SIZE: 1001,
  NOT_INVERTIBLE: 1002,
  MUST_OVERRIDE: 1003,
};

const errorMessages = {
  [errorCodes.INVALID_TYPE]: 'Invalid Type',
  [errorCodes.INVALID_SIZE]: 'Invalid Size',
  [errorCodes.NOT_INVERTIBLE]: 'Not Invertible',
  [errorCodes.MUST_OVERRIDE]: 'Must override',
};

class RtError extends Error {
  constructor(errorCode, message) {
    super();
    this.errorCode = errorCode;
    this.errorMessage = errorMessages[this.errorCode];
    this.message = `[${this.errorCode} - ${this.errorMessage}] ${message}`;
  }

  static get Code() {
    return errorCodes;
  }
}

module.exports = RtError;
