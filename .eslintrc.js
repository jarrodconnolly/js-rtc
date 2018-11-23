module.exports = {
  "parserOptions": {
    "ecmaVersion": 6,
  },
  "env": {
    "node": true,
    "es6": true,
    "jest": true,
  },
  "extends": "airbnb-base",
  "plugins": ["promise", "node"],
  "rules": {
    "promise/catch-or-return": ["error"],
    "node/no-unsupported-features/es-builtins": ["error"],
    "node/no-unsupported-features/es-syntax": ["error"],
    "node/no-unsupported-features/node-builtins": ["error"],
    "node/no-deprecated-api": ["error"],
  },
};
