var browserSync = require('browser-sync')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var webpackConfig = require('./webpack.config')('development')
var bundler = webpack(webpackConfig)

browserSync({
	proxy: 'localhost:8080',
	browser: 'google chrome',
	rewriteRules: [
		{
			match: /(src)=('|").*?mapa-fogo-cruzado\/public\/(.*?)('|")/gi,
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
	// files: ['app/css/*.css', 'app/*.html'],
})
