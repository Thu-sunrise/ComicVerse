module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'coverage', 'node_modules'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      // Enforce Clean Architecture Domain Boundary rules
      files: ['**/src/domain/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/presentation/**', '**/infrastructure/**', '**/application/**', 'react', 'react-dom', 'vite', 'axios'],
                message: 'Domain layer must remain pure TypeScript with zero dependencies on React, Vite, HTTP clients, or outer layers.',
              },
            ],
          },
        ],
      },
    },
    {
      // Enforce Clean Architecture Application Boundary rules
      files: ['**/src/application/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/presentation/**', '**/infrastructure/**', 'react', 'react-dom'],
                message: 'Application layer must not depend on Presentation or Infrastructure layers.',
              },
            ],
          },
        ],
      },
    },
  ],
};
