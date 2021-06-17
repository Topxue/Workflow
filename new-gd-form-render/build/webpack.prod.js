/*
 * @Author: caohao
 * @Date: 2020-09-02 17:44:33
 * @LastEditors: caohao
 * @LastEditTime: 2020-09-28 15:27:59
 * @Description:
 */
/**
 * 单独打包某个插件
 *
 */
const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const path = require('path')
let public
module.exports = filename => {
  public = common()
  return merge(public, {
    entry: path.join(__dirname, '../main.js'),
    output: {
      filename: 'gd-form-render.js',
      library: 'gdFormRender',
      libraryTarget: 'umd',
      libraryExport: 'default'
    },
    stats: 'verbose',
    externals: [
      {
        vue: {
          root: 'Vue',
          commonjs: 'vue',
          commonjs2: 'vue',
          amd: 'vue'
        },
        seajs: {
          root: 'seajs',
          commonjs: 'seajs',
          commonjs2: 'seajs',
          amd: 'seajs'
        }
      }
    ],
    mode: 'development',
    devtool: 'cheap-source-map'
  })
}
