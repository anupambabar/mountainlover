module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./backend/tsconfig.json', './frontend/tsconfig.json'],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'unused-imports', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    '**/dist/**',
    '**/coverage/**',
    '**/node_modules/**',
    'backend/prisma/migrations/**',
  ],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['backend/**/*.{ts,tsx}'],
      env: {
        node: true,
      },
    },
    {
      files: ['frontend/**/*.{ts,tsx}'],
      env: {
        browser: true,
      },
      parserOptions: {
        project: ['./frontend/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  ],
}

