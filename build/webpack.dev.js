const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const config = require('./config')
const Webpack = require('webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: config.SERVER_HOST, // 指定 host，不设置的话默认是 localhost
    port: config.SERVER_PORT, // 指定端口，默认是8080
    stats: 'errors-only', // 终端仅打印 error
    clientLogLevel: 'silent', // 日志等级
    compress: true, // 是否启用 gzip 压缩
    hot: true, // 热更新
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin()
  ]
})
