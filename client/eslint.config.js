import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{js,jsx}'],

    plugins: {
      react,
      'react-hooks': reactHooks,
    },

    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    settings: {
      react: {
        version: 'detect',
      },
    },

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },

    rules: {
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/static-components': 'error',
      'react-hooks/use-memo': 'error',
      'react-hooks/void-use-memo': 'error',
      'react-hooks/preserve-manual-memoization': 'error',
      'react-hooks/incompatible-library': 'warn',
      'react-hooks/immutability': 'error',
      'react-hooks/globals': 'error',
      'react-hooks/refs': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/error-boundaries': 'error',
      'react-hooks/purity': 'error',
      'react-hooks/set-state-in-render': 'error',
      'react-hooks/unsupported-syntax': 'warn',
      'react-hooks/config': 'error',
      'react-hooks/gating': 'error',

      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
    },
  },

  {
    files: ['tailwind.config.js'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
      },
      sourceType: 'commonjs',
    },
  },
])
