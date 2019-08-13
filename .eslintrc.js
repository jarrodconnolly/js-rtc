module.exports = {
  "parserOptions": {
    "ecmaVersion": 7,
  },
  "env": {
    "node": true,
    "es6": true,
    "jest": true,
  },
  "extends": "airbnb-base",
  "plugins": ["promise", "node"],
  "rules": {
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "promise/catch-or-return": ["error"],
    "node/no-unsupported-features/es-builtins": ["error"],
    "node/no-unsupported-features/es-syntax": ["error"],
    "node/no-unsupported-features/node-builtins": ["error"],
    "node/no-deprecated-api": ["error"],
    "object-shorthand": ["error", "consistent-as-needed"],
    "no-underscore-dangle": ["off"]
  },
};
