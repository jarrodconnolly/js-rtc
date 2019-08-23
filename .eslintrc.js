module.exports = {
  "parserOptions": {
    "ecmaVersion": 7,
  },
  "env": {
    "node": true,
    "es6": true,
    "jest": true,
  },
  "globals": {
    "SharedArrayBuffer" : "readonly",
  },
  "extends": "airbnb-base",
  "plugins": ["promise", "node"],
  "rules": {
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
    "promise/catch-or-return": ["error"],
    "node/no-unsupported-features/es-builtins": ["error"],
    "node/no-unsupported-features/es-syntax": ["error"],
    "node/no-unsupported-features/node-builtins": ["error", {
      ignores: ["worker_threads"],
    }],
    "node/no-deprecated-api": ["error"],
    "object-shorthand": ["error", "consistent-as-needed"],
    "no-underscore-dangle": ["off"],
    "max-len": ["error", 120],
    "no-useless-constructor": ["off"],
  },
};
