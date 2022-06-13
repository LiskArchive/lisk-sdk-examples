const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:react/recommended', 'plugin:prettier/recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es2020: true,
    'jest/globals': true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, 'config', 'webpack.common.js'),
      },
    },
  },
  plugins: ['react', 'jsx-a11y', 'import', 'jest'],
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
};
