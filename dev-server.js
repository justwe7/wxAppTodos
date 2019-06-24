// var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackDevMiddlewareHardDisk = require('webpack-dev-middleware-hard-disk')//可在 dev 时，将编译结果，保存到配置的 output path 路径中
var portfinder = require('portfinder')//查找下一个可用端口
// var webpackConfig = require('./webpack.dev.conf')
var webpackConfig = require('./webpack.config.js')


var config = {
  dev: {
    port: 9527,
    // 在小程序开发者工具中不需要自动打开浏览器
    autoOpenBrowser: false,
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    // fileExt: fileExt
  }
}

// default port where dev server listens for incoming traffic
var port = process.env.PORT || 9888
// automatically open browser, if not set will be false
var autoOpenBrowser = false
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

// var devMiddleware = require('webpack-dev-middleware')(compiler, {
//   publicPath: webpackConfig.output.publicPath,
//   quiet: true
// })

// var hotMiddleware = require('webpack-hot-middleware')(compiler, {
//   log: false,
//   heartbeat: 2000
// })
// force page reload when html-webpack-plugin template changes
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// serve webpack bundle output
// app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
// app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

// var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  console.log('启动成功');
  _resolve = resolve
})

// console.log('> Starting dev server...')
// devMiddleware.waitUntilValid(() => {
//   console.log('> Listening at ' + uri + '\n')
//   // when env is testing, don't need open it
//   if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
//     opn(uri)
//   }
//   _resolve()
// })

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = port
  portfinder.getPortPromise()
  .then(newPort => {
      if (port !== newPort) {
        console.log(`${port}端口被占用，开启新端口${newPort}`)
      }
      var server = app.listen(newPort, 'localhost')
      // for 小程序的文件保存机制
      webpackDevMiddlewareHardDisk(compiler, {
        publicPath: webpackConfig.output.publicPath,
        quiet: true
      })
      resolve({
        ready: readyPromise,
        close: () => {
          server.close()
        }
      })
  }).catch(error => {
    console.log('没有找到空闲端口，请打开任务管理器杀死进程端口再试', error)
  })
})
