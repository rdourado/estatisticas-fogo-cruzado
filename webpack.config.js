/**
 * External dependencies
 */
const path = require('path')
const webpack = require('webpack')
const isWsl = require('is-wsl')
const postcssPresetEnv = require('postcss-preset-env')
const safePostCssParser = require('postcss-safe-parser')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const ManifestPlugin = require('webpack-manifest-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

const paths = {
	appSrc: path.resolve('src'),
	appIndexJs: path.resolve('src', 'index.js'),
	appBuild: path.resolve('public'),
}

module.exports = function(webpackEnv) {
	const isEnvDevelopment = webpackEnv === 'development'
	const isEnvProduction = webpackEnv === 'production'

	const getStyleLoaders = cssOptions =>
		[
			isEnvDevelopment && 'style-loader',
			isEnvProduction && {
				loader: MiniCssExtractPlugin.loader,
				options: { publicPath: '../' },
			},
			{ loader: 'css-loader', options: cssOptions },
			{
				loader: 'postcss-loader',
				options: {
					ident: 'postcss',
					plugins: () => [postcssPresetEnv()],
				},
			},
		].filter(Boolean)

	return {
		mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
		bail: isEnvProduction,
		devtool: isEnvProduction ? false : isEnvDevelopment && 'cheap-module-source-map',
		entry: [
			isEnvDevelopment && require.resolve('webpack-dev-server/client') + '?/',
			isEnvDevelopment && require.resolve('webpack/hot/dev-server'),
			paths.appIndexJs,
		].filter(Boolean),
		output: {
			path: isEnvProduction ? paths.appBuild : undefined,
			pathinfo: isEnvDevelopment,
			publicPath: '/',
			filename: 'js/mapa-fogo-cruzado-public.js',
			// filename: isEnvProduction
			// 	? 'js/[name].[contenthash:8].js'
			// 	: isEnvDevelopment && 'js/bundle.js',
			futureEmitAssets: true,
			chunkFilename: 'js/mapa-fogo-cruzado-public.chunk.js',
			// chunkFilename: isEnvProduction
			// 	? 'js/[name].[contenthash:8].chunk.js'
			// 	: isEnvDevelopment && 'js/[name].chunk.js',
			devtoolModuleFilenameTemplate: isEnvProduction
				? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
				: isEnvDevelopment &&
				  (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')), // eslint-disable-line no-mixed-spaces-and-tabs
		},
		optimization: {
			minimize: isEnvProduction,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						parse: { ecma: 8 },
						compress: { ecma: 5, warnings: false, comparisons: false, inline: 2 },
						output: { ecma: 5, comments: false, ascii_only: true },
						mangle: { safari10: true },
					},
					parallel: !isWsl,
					cache: true,
					sourceMap: false,
				}),
				new OptimizeCSSAssetsPlugin({
					cssProcessorOptions: { parser: safePostCssParser, map: false },
				}),
			],
			splitChunks: { chunks: 'all', name: true },
			// runtimeChunk: true,
		},
		resolve: {
			extensions: ['.js', '.jsx'],
		},
		module: {
			strictExportPresence: true,
			rules: [
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: ['babel-loader', 'eslint-loader', 'prettier-loader'],
				},
				{
					test: /\.css$/,
					exclude: /\.module\.css$/,
					use: getStyleLoaders({ importLoaders: 1 }),
				},
				{
					test: /\.module\.css$/,
					use: getStyleLoaders({
						importLoaders: 2,
						modules: true,
						localIdentName: isEnvProduction
							? '[local]---[hash:base64:5]'
							: isEnvDevelopment && '[local]---[hash:base64:6]',
					}),
				},
			],
		},
		devServer: {
			compress: true,
			hot: true,
			publicPath: '/wp-content/plugins/mapa-fogo-cruzado/public/',
			overlay: true,
			historyApiFallback: { disableDotRule: true },
			proxy: {
				'/': {
					target: 'http://localhost:8000',
					changeOrigin: false,
					autoRewrite: true,
				},
			},
		},
		plugins: [
			new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(webpackEnv) }),
			isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
			isEnvProduction &&
				new MiniCssExtractPlugin({
					filename: 'css/mapa-fogo-cruzado-public.css',
					// filename: 'css/[name].[contenthash:8].css',
					// chunkFilename: 'css/[name].[contenthash:8].chunk.css',
				}),
			new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
			// new ManifestPlugin({
			// 	fileName: 'asset-manifest.json',
			// 	publicPath: '/',
			// 	generate: (seed, files) => ({
			// 		files: files.reduce(
			// 			(manifest, file) => ({ ...manifest, [file.name]: file.path }),
			// 			seed
			// 		),
			// 	}),
			// }),
			// new HtmlWebpackPlugin({
			// 	inject: false,
			// 	template: require('html-webpack-template'),
			// 	title: 'Dados Legais',
			// 	lang: 'pt-br',
			// 	appMountId: 'root',
			// }),
		].filter(Boolean),
	}
}
