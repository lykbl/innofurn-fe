module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['unused-imports'],
  rules: {
    'no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
    'prefer-arrow-callback': 'error',
    'func-style': ['error', 'declaration'], //TODO verify this
  },
  ignorePatterns: ['gql/**/*', 'lib/**/*'],
};
