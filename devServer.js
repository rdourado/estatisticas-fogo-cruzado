var path = require('path')
var browserSync = require('browser-sync')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var webpackConfig = require('./webpack.config')('development')
var bundler = webpack(webpackConfig)
var pluginFolder = path.basename(__dirname)

browserSync({
	proxy: 'localhost:8080',
	browser: 'google chrome',
	rewriteRules: [
		{
			match: new RegExp('(src)=(\'|").*?' + pluginFolder + '/public/(.*?)(\'|")', 'gi'),
			replace: '$1=$2/$3$4',
		},
	],
	middleware: [
		webpackDevMiddleware(bundler, {
			publicPath: webpackConfig.output.publicPath,
			stats: { colors: true },
		}),
		webpackHotMiddleware(bundler),
	],
})
