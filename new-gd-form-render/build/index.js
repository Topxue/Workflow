let webpackconfig = require('./webpack.prod')
const webpack = require('webpack')
// 执行webpack 构建
webpack(webpackconfig(), (err, state) => {
  if (err || state.hasErrors()) {
    console.log(err)
    console.log(state.toString({
      colors: true
    }))
    process.exit(7)
  }
  console.log(state.toString({
    chunks: false,  // Makes the build much quieter
    colors: true    // Shows colors in the console
  }));
})