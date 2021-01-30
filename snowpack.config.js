module.exports = {
  mount: {
    "src": "/dist",
    "public": "/"
  },
  plugins: [
    '@snowpack/plugin-webpack',
    ['snowpack-plugin-less', {javascriptEnabled: true}],
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv'
  ],
  alias: {
    '@components': './src/components',
  },
}