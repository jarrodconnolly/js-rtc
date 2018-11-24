
const errorCodes = {
  INVALID_TYPE: 1000,
};

const errorMessages = {
  [errorCodes.INVALID_TYPE]: 'Invalid Type',
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
