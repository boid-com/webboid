process.env.VUE_CLI_BABEL_TARGET_NODE = true
process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true

module.exports = {
  'globals': {
    '__DEV__': true,
  },
  'verbose': true, // false since we want to see console.logs inside tests
  'bail': false,
  'testURL': 'http://localhost/',
  'testEnvironment': 'jsdom',
  'collectCoverage': true,
  'collectCoverageFrom': [
    '<rootDir>/src/**/*.{js}',
    '<rootDir>/src/**/*.{vue}'
  ],
  'coverageDirectory': '<rootDir>/test/coverage',
  'coverageThreshold': {
    'global': {
      'branches': 50,
      'functions': 50,
      'lines': 50,
      'statements': 50
    },
    './src/components/': {
      'branches': 40,
      'statements': 40
    },
  },
  'testMatch': [
    '<rootDir>/test/*/*.*.js?(x)',
    '<rootDir>/test/*.*.js?(x)'

  ],
  'testPathIgnorePatterns': [
    '<rootDir>/components/coverage/',
    '<rootDir>/test/coverage/',
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
  ],
  'moduleFileExtensions': ['js', 'json', 'vue'],
  'moduleNameMapper': {
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    'quasar': '<rootDir>/test/quasar-framework/dist/umd/quasar.mat.umd.js',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@/(.*)$': '<rootDir>/src/components/$1',
    '^variables/(.*)$': '<rootDir>/src/themes/quasar.variables.sty/$1',
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules'
  },
  'resolver': null,
  'transformIgnorePatterns': [
    '/node_modules/',
    'node_modules/core-js',
    'node_modules/babel-runtime',
    'node_modules/lodash',
    'node_modules/vue',
    'node_modules/(?!@babel\/runtime)'
  ],
  'transform': {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  'snapshotSerializers': [
    '<rootDir>/node_modules/jest-serializer-vue'
  ],
};
