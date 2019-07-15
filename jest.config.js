module.exports = {
  collectCoverage: true,
  coverageDirectory: './coverage/',
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jestExpectExtend.js'],
};
