const fs = require('node:fs')
const { join } = require('node:path')
const { defineConfig } = require('eslint-define-config')

const tsconfig =
  process.env.ESLINT_TSCONFIG ||
  (fs.existsSync(join(process.cwd(), 'tsconfig.eslint.json'))
    ? 'tsconfig.eslint.json'
    : 'tsconfig.json')

const isTSExist = fs.existsSync(join(process.cwd(), tsconfig))

module.exports = defineConfig({
  root: true,
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es2023: true
  },
  reportUnusedDisableDirectives: true,
  extends: [
    'plugin:tailwindcss/recommended',
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'import',
    'unused-imports'
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.cjs',
          '.mjs',
          '.ts',
          '.cts',
          '.mts',
          '.tsx',
          '.d.ts',
          '.vue'
        ]
      }
    }
  },
  overrides: [
    {
      files: ['*.{js,cjs,mjs,jsx}'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-require-imports': 'off'
      }
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-duplicates': 'off',
        '@typescript-eslint/triple-slash-reference': 'off' // 允许使用 /// <reference path="" />
      }
    },
    ...(isTSExist
      ? [
          {
            files: ['*.{ts,tsx,cts,mts}'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
              project: [tsconfig],
              tsconfigRootDir: process.cwd(),
              ecmaVersion: 'latest',
              sourceType: 'module'
            },
            rules: {
              'no-unused-vars': 'off',
              '@typescript-eslint/no-unused-vars': 'off',
              'no-shadow': 'off',
              '@typescript-eslint/no-shadow': 'error',
              'no-undef': 'off',
              '@typescript-eslint/no-explicit-any': 'off', // 由 TS 静态检查
              '@typescript-eslint/comma-dangle': 'off', // 由 Prettier 处理
              '@typescript-eslint/consistent-type-imports': 'error', // 强制使用 import type
              '@typescript-eslint/triple-slash-reference': 'off'
            }
          }
        ]
      : []),
    ...(isTSExist
      ? [
          {
            files: ['*.vue'],
            parser: 'vue-eslint-parser',
            parserOptions: {
              parser: '@typescript-eslint/parser',
              extraFileExtensions: ['.vue'],
              project: [tsconfig],
              tsconfigRootDir: process.cwd(),
              ecmaVersion: 'latest',
              sourceType: 'module'
            },
            rules: {
              'no-unused-vars': 'off',
              '@typescript-eslint/no-unused-vars': 'off',
              'no-shadow': 'off',
              '@typescript-eslint/no-shadow': 'error',
              'no-undef': 'off',
              '@typescript-eslint/no-explicit-any': 'off', // 由 TS 静态检查
              '@typescript-eslint/comma-dangle': 'off', // 由 Prettier 处理
              '@typescript-eslint/consistent-type-imports': 'error', // 强制使用 import type
              '@typescript-eslint/triple-slash-reference': 'off',

              'vue/no-v-html': 'off', // 允许使用 v-html
              'vue/multi-word-component-names': 'off', // 允许单个单词的组件名，例如 index.vue
              'vue/component-tags-order': [
                'error',
                {
                  order: ['script', 'template', 'style']
                }
              ] // 优先 script，其次 template，最后 style
            }
          }
        ]
      : [
          {
            files: ['*.vue'],
            extends: ['plugin:@typescript-eslint/disable-type-checked'],
            parser: 'vue-eslint-parser',
            parserOptions: {
              extraFileExtensions: ['.vue'],
              ecmaVersion: 'latest',
              sourceType: 'module'
            },
            rules: {
              'vue/no-v-html': 'off', // 允许使用 v-html
              'vue/multi-word-component-names': 'off', // 允许单个单词的组件名，例如 index.vue
              'vue/component-tags-order': [
                'error',
                {
                  order: ['script', 'template', 'style']
                }
              ] // 优先 script，其次 template，最后 style
            }
          }
        ])
  ],
  rules: {
    quotes: ['error', 'single'], // 强制使用单引号
    semi: ['error', 'never'], // 禁止使用分号
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_'
      }
    ],
    'class-methods-use-this': 'off', // 允许类方法不使用 this
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'target',
          'descriptor',
          'req',
          'request',
          'args'
        ]
      }
    ],

    // eslint-plugin-simple-import-sort
    'simple-import-sort/imports': 'error', // import 排序
    'simple-import-sort/exports': 'error', // export 排序

    // eslint-plugin-import
    'import/order': 'off', // 禁用 import 排序，使用 simple-import-sort
    'import/first': 'error', // import 必须放在文件顶部
    'import/newline-after-import': 'error', // import 之后必须空一行
    'import/no-unresolved': 'off', // 允许导入未解析的模块
    'import/no-absolute-path': 'off', // 允许导入绝对路径
    'import/no-duplicates': 'error', // 禁止重复导入
    'import/extensions': 'off', // 允许导入时带文件扩展名
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        peerDependencies: true,
        optionalDependencies: false
      }
    ], // 允许 devDependencies，peerDependencies，不允许 optionalDependencies
    'import/no-mutable-exports': 'error', // 禁止导出 let, var 声明的变量
    'import/no-self-import': 'error', // 禁止自导入
    'import/prefer-default-export': 'off', // 仅导出一个变量时，不要求默认导出

    // TailwindCSS
    'tailwindcss/classnames-order': 'error', // TailwindCSS 类名排序
    'tailwindcss/enforces-shorthand': 'error', // TailwindCSS 简写合并
    'tailwindcss/no-custom-classname': 'off' // TailwindCSS 中允许自定义类名
  }
})
