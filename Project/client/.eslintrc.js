// // https://eslint.org/docs/user-guide/configuring

// module.exports = {
//   root: true,
//   parserOptions: {
//     parser: 'babel-eslint'
//   },
//   env: {
//     browser: true
//   },
//   extends: [
//     // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
//     // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
//     'plugin:vue/essential',
//     // https://github.com/standard/standard/blob/master/docs/RULES-en.md
//     'standard'
//   ],
//   // required to lint *.vue files
//   plugins: [],
//   // add your custom rules here
//   rules: {
//     // allow async-await
//     'generator-star-spacing': 'off',
//     // allow debugger during development
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
//   }
// }

module.exports = {
  parserOptions: {
    parser: 'babel-eslint'
  },
  "root": true,
  "extends": [
    "plugin:vue/essential",
    "plugin:prettier/recommended",
    "eslint:recommended"
  ],
  rules: {
    "max-len": ["error", { "code": 200 }],
    "endOfLine":"auto",
    'no-console': 'off',
    'no-trailing-spaces': 'off'
  }
}