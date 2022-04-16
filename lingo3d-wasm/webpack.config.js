const path = require("path")
module.exports = (env, argv) => ({
	"module": {
		"rules": [
			{
				"oneOf": [
					{
						"test": /\.(ts|tsx|jsx|js)$/i,
						"exclude": [/webpack/, /babel/, /core-js/],
						"use": [
							{
								"loader": "babel-loader",
								"options": {
									"babelrc": false,
									"presets": [
										[
											"@babel/preset-env",
											{
												"useBuiltIns": "usage",
												"corejs": "core-js@3",
												"targets": {
													"chrome": "73"
												}
											}
										],
										"@babel/preset-typescript"
									],
									"sourceType": "unambiguous"
								}
							}
						]
					},
					{
						"type": "asset/resource",
						"exclude": [/.(js|mjs|jsx|ts|tsx)$/i, /.json$/i]
					}
				]
			}
		]
	},
	"resolve": {
		"extensions": [
			".js",
			".ts",
			".jsx",
			".tsx",
			".css",
			".json"
		],
		"fallback": {
			"fs": false,
			"assert": false
		}
	},
	"plugins": [
		new (require('html-webpack-plugin'))({
            meta: {
                viewport: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
            },
            templateContent: '<head><title>Webpack App</title></head><body><div id=\"app\"></div></body>'
        }),
		new (require('fork-ts-checker-webpack-plugin'))(),
		new (require('webpack-notifier'))({ alwaysNotify: true })
	],
	"experiments": {
		"asyncWebAssembly": true
	},
	"optimization": {
		"minimizer": [
			new (require('terser-webpack-plugin'))({
                terserOptions: {
                    safari10: true
                }
            })
		]
	},
	"mode": "development",
	"stats": "minimal",
	"devtool": argv.mode === 'production' ? undefined : 'eval-cheap-source-map',
	"devServer": {
		"compress": true,
		"open": true,
		"host": "localhost",
		"port": 3000,
		"static": path.resolve('./test'),
		"https": false,
		"hot": true
	},
	"entry": path.resolve('./src/test'),
	"output": {
		"path": path.resolve('./test')
	}
})