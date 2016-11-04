module.exports = {
    "extends": "airbnb",
    "plugins": [],
    "rules": {
        // http://eslint.org/docs/rules/semi
        // no semi-colons (YOLO) .. if you really want semicolons, remove this rule and run
        // '.\node_modules\.bin\eslint --fix src' from the app root to re-add
        "semi": [ 2, "never" ],
        // http://eslint.org/docs/rules/indent
        // indent 4 spaces (rather than airbnb's default of 2)
        "indent": [ 2, 4, { "SwitchCase": 1 } ],
        "comma-dangle": ["error", "always-multiline"],
        "no-underscore-dangle": [0],
        "func-names": "off",
        // http://eslint.org/docs/rules/linebreak-style
        "linebreak-style": [
            "off"
        ],

        // doesn't work in node v4 :(
        "strict": "off",
        "prefer-rest-params": "off",
        "react/require-extension" : "off",
        "import/no-extraneous-dependencies" : "off"
    },
    "env": {
        "mocha": true,
        "node": true,
        "jest": true,
    }
};