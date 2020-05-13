const YWorksOptimizerPlugin = require('@yworks/optimizer/webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = function(config) {
  config.optimization.splitChunks = {
    cacheGroups: {
      yfiles: {
        test: /[\\/]yfiles[\\/]/,
        name: 'yfiles',
        chunks: 'all',
        priority: 10
      },
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  }

  if (config.mode === 'production') {
    // Obfuscate yFiles modules and usages for production build
    config.plugins.push(
      new YWorksOptimizerPlugin({
        logLevel: 'info',
        blacklist: ['update']
      })
    )
    config.module.rules.unshift({
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript']
        }
      }
    })
  } else {
    // Add yFiles debugging support for development build
    config.entry.main.unshift('../../../ide-support/yfiles-typeinfo.js')
  }

  return config
}
