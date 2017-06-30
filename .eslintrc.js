module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "plugins": [
      "mocha",
      "chai-expect"
    ],
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-console": "off",
        "mocha/no-exclusive-tests": "error",
        "chai-expect/missing-assertion": 2,
        "chai-expect/terminating-properties": 1
    }
};
