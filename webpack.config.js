var path = require('path')
var webpack = require('webpack')

var paths = {
	appSrc: path.resolve('src'),
	appIndex: path.resolve('src', 'index.jsx'),
	appPublic: path.resolve('public'),
}

module.exports = function(webpackEnv) {
	var isEnvProduction = webpackEnv === 'production'
	var isEnvDevelopment = webpackEnv === 'development' || !isEnvProduction

	return {
		mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
		bail: isEnvProduction,
		devtool: isEnvProduction ? false : isEnvDevelopment && 'cheap-module-source-map',
		entry: [
			isEnvDevelopment && require.resolve('react-hot-loader/patch'),
			isEnvDevelopment && require.resolve('webpack-hot-middleware/client') + '?/',
			paths.appIndex,
		].filter(Boolean),
		output: {
			path: isEnvProduction ? paths.appPublic : undefined,
			pathinfo: isEnvDevelopment,
			publicPath: '/',
			filename: 'js/mapa-fogo-cruzado-public.js',
			futureEmitAssets: true,
		},
		optimization: {
			minimize: isEnvProduction,
		},
		resolve: {
			extensions: ['.js', '.jsx'],
			alias: {
				'react-dom': '@hot-loader/react-dom',
			},
		},
		module: {
			strictExportPresence: true,
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: ['babel-loader', 'eslint-loader', 'prettier-loader'],
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(webpackEnv),
			}),
			isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
			new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		].filter(Boolean),
	}
}
