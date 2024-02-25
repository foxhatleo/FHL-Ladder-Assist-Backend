const customRules = {
    "import/extensions": "off",
    "import/prefer-default-export": "off",
    "class-methods-use-this": "off",
    "indent": ["error", 4],
    "max-len": ["error", { code: 120 }],
    "no-continue": "off",
    "no-console": "off",
    "no-shadow": "off",
    "no-unused-vars": "off",
    "no-restricted-syntax": "off",
    "no-underscore-dangle": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
        "warn",
        {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
        },
    ],
    "quotes": ["error", "double"],
    "quote-props": ["error", "consistent-as-needed"],
    "jsx-quotes": ["error", "prefer-double"],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-shadow": "off",
    "@next/next/no-img-element": "off",
};

module.exports = {
    extends: ["eslint:recommended"],
    plugins: ["unused-imports", "import"],
    parserOptions: {
        ecmaVersion: "latest",
    },
    env: {
        es6: true,
        node: true,
    },
    rules: customRules,
};
