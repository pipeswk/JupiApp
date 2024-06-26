module.exports = {
  "root": true,
  "env": {
    es6: true,
    node: true,
  },
  "extends": [
    "eslint:recommended",
    "google",
  ],
  "rules": {
    "quotes": ["error", "double"],
    "linebreak-style": 0,
    "max-len": "off",
    "indent": "off",
    "no-trailing-spaces": "off",
  },
  "parserOptions": {
    // Required for certain syntax usages
    "ecmaVersion": 2020,
  },
};
