const path = require('path')
const config = require('./config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/index.tsx')
  },
  output: {
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json']
  },

  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          config.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false, // 默认就是 false, 若要开启，可在官网具体查看可配置项
              sourceMap: config.isDev, // 开启后与 devtool 设置一致, 开发环境开启，生产环境关闭
              importLoaders: 0 // 指定在 CSS loader 处理前使用的 laoder 数量
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  !config.isDev && [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        grid: true,
                        flexbox: 'no-2009'
                      },
                      stage: 3
                    }
                  ]
                ].filter(Boolean)
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          config.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: config.isDev,
              importLoaders: 1 // 需要先被 less-loader 处理，所以这里设置为 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  !config.isDev && [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        grid: true,
                        flexbox: 'no-2009'
                      },
                      stage: 3
                    }
                  ]
                ].filter(Boolean)
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: config.isDev
            }
          }
        ]
      },
      {
        /*只能处理css文件中的图片文件*/ test: /\.(png|jpg|gif|jpeg)$/ /*匹配图片文件*/,
        loader: 'url-loader',
        options: {
          outputPath: path.resolve(__dirname, '../build') /*指定打包文件夹*/,
          limit: 1024 * 8 /*不设置限定大小，会默认将图片转成base64编码格式*/,
          name: '[name][fullhash:10].[ext]' /*不设置名称，会默认生成一个hash名，hash:10--留10位hash值*/
        }
      },
      {
        /*html种引入图片文件的处理*/
        test: '/.html$/',
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
      minify: config.isDev
        ? false
        : {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            useShortDoctype: true
          }
    }),
    new CopyPlugin({
      patterns: [
        {
          context: path.join(__dirname, '../public'),
          from: '*',
          to: path.join(__dirname, '../dist'),
          toType: 'dir',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new WebpackBar({
      name: config.isDev ? '正在启动' : '正在打包',
      color: '#fa8c16'
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, '../tsconfig.json')
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: false
    })
  ]
}
