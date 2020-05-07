module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    node: true,
    commonjs: true,
  },
  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'prefer-const': ['off'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/ban-ts-ignore': ['off'],
  },
}
