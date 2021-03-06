module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    "no-console": "off",
    "new-cap": "off",
    "camelcase": [0, {"properties": "never"}]
  }
}
