const { merge } = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  plugins: [
    new CleanWebpackPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: { pure_funcs: ['console.log'] },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
    },
  },
})
