'use strict'

const path = require('path')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

const MOCK_URL = 'http://localhost:3000'

module.exports = {
  publicPath: '/',
  productionSourceMap: false,

  configureWebpack(config) {
    config.name = 'Workflow'
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("views", resolve("src/views"));

    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

  },

  devServer: {
    proxy: {
      '/mock': {
        target: MOCK_URL,
        changeOrigin: true,
        pathRewrite: {
          ['^' + '/mock']: ''
        }
      }
    }
  }
}
