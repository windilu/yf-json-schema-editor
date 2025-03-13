import typescriptEslint from '@typescript-eslint/eslint-plugin';
import parser from 'vue-eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [...compat.extends(
  'plugin:vue/vue3-recommended',
  'plugin:vue/recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
), {
  plugins: {
    '@typescript-eslint': typescriptEslint,
  },

  languageOptions: {
    globals: {
      // 添加 Vue 环境的全局变量
      vue: true,
      // ...vue.environments["setup-compiler-macros"]["setup-compiler-macros"],
    },

    parser: parser,
    ecmaVersion: 6,
    sourceType: 'module',

    parserOptions: {
      parser: '@typescript-eslint/parser',
    },
  },

  rules: {
    'vue/valid-v-slot': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'vue/require-valid-default-prop': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/one-component-per-file': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    'dot-notation': 'error',
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    eqeqeq: ['error', 'smart'],
    'no-explicit-any': 'off',
    'keyword-spacing': 'error',
    'linebreak-style': ['error', 'unix'],
    'no-unreachable': 'warn',
    'no-caller': 'error',
    'no-catch-shadow': 'error',
    'no-console': 'warn',
    'no-div-regex': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-floating-decimal': 'error',
    'no-global-assign': 'error',
    'no-implied-eval': 'error',
    'no-invalid-this': 'off',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-label-var': 'error',
    'no-lone-blocks': 'error',
    'no-loop-func': 'error',
    'no-multi-str': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal': 'error',
    'no-octal-escape': 'error',
    'no-proto': 'error',
    'no-return-assign': 'off',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow': 'off',
    'no-shadow-restricted-names': 'error',
    'no-throw-literal': 'error',
    'no-undef': 'error',
    'no-unneeded-ternary': 'error',
    'no-unexpected-multiline': 'error',
    'no-unused-vars': 'warn',
    'no-useless-escape': 'off',
    'no-void': 'error',
    'no-warning-comments': 'warn',
    'no-with': 'error',
    'no-use-before-define': ['off', 'nofunc'],
    radix: ['error', 'always'],
    semi: ['error', 'always'],
    'semi-spacing': 'error',
    'space-unary-ops': 'error',
    'wrap-regex': 'off',
    quotes: ['error', 'single'],
  },


}, { ignores: ['node_modules', 'dist'] }];