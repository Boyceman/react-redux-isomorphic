/**
 * Created by boyce on 17-6-24.
 */
const debug = require('debug')('app:bin:client-server')
import Koa from 'koa'
import compress from 'koa-compress'
import staticServer from 'koa-static'
import webpack from 'webpack'
import WebpackDevServer from 'koa-webpack-dev-middleware'
import WebpackHotServer from 'webpack-hot-middleware'
import { webpackConfig, OUTPUT_PATH, SRC_PATH, PUBLIC_PATH } from '../config/webpack.config'
const app = new Koa()
const server_port = 5000

app.use(compress({
  threshold: 2048,
  flush: require("zlib").Z_SYNC_FLUSH
}))

if (process.env.NODE_ENV === 'dev') {
  const compiler = webpack(webpackConfig)

  debug('Enabling webpack dev and HMR middleware')
  app.use(WebpackDevServer(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: SRC_PATH,
    hot: true,
    quiet: false,
    noInfo: false,
    lazy: false,
    stats: {
      chunks: false,
      chunkModules: false,
      colors: true
    }
  }))
  app.use(WebpackHotServer(compiler, {
    path: '/__webpack_hmr'
  }))

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(staticServer(PUBLIC_PATH))

  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  app.use(function (ctx, next) {
    const filename = path.join(compiler.outputPath, 'index.html')
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
} else {
  debug(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(staticServer(OUTPUT_PATH))
}

app.listen(server_port)
debug(`Server is now running at http://localhost:${server_port}.`)