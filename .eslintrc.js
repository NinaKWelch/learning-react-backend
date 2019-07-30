module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true
  },
  "extends": "airbnb-base",
  'rules': {
    'semi': [
      'error',
      'never'
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'no-underscore-dangle': [
      'error', 
      { 'allow': ['_id', '__v'] }
    ],
    'no-console': 0
  }
};