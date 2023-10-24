'use strict'

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path')
const fs = require('fs')


function setEntries(directories) {
    let entry = {};
    directories.forEach(function(directory) {
        try {
            let type = directory.toString().split("/").slice(2)[0];
            fs.readdirSync(directory).forEach(function (file) {
                if (file != '.DS_Store') {
                    entry[file] = directory+ '/' + file + '/';
                }
            });
        } catch (e) {
        }
    })
    return entry;
}
const entries = setEntries(['./dev/pages']);

let components_dir = [];
function createComponentDirectoryArray(dir) {
    try {
        fs.readdirSync(dir).forEach(function (file) {
            if (file != '.DS_Store') {
                components_dir.push(path.resolve(__dirname, 'dev/components', file));
            }
        })
    } catch (e) {
    }
    components_dir.push(path.resolve(__dirname, 'dev/components'));
    components_dir.push(path.resolve(__dirname, 'dev/templates'));
    components_dir.push(path.resolve(__dirname, 'node_modules'));
}
createComponentDirectoryArray('./dev/components');

let plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    }),
    new CopyPlugin({
        patterns: [
            {
                from: 'images/*',
                to: 'assets/',
                context: 'dev/assets/',
            },
            {
                from: "public"
            }
        ]
    }),
    new ExtractCssChunks({
        "filename":  "css/[name].css"
    })
];

for (const entry of Object.entries(entries)) {
    let type = entry.toString().split("/").slice(2)[0];
    let directory = entry.toString().split("/").slice(-2)[0];
    plugins.push(
        new HtmlWebpackPlugin({
            "template": path.resolve(__dirname, 'dev/'+type+'/'+directory+'/view.pug'),
            "filename": directory + '.html',
            "chunks": [directory, 'vendors', 'runtime'],
            "hash": false,
            "minify": false
        })
    )
}

module.exports = {
  "entry": entries,
    "output": {
        pathinfo: false,
        "path": path.resolve(__dirname, 'dist'),
        "publicPath": "../",
        "filename": "js/[name].js"
    },
    "plugins": plugins,

    "optimization": {
        minimize: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        occurrenceOrder: true,
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                modules: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    priority: -10,
                    chunks: 'all'
                },
                gt2: {
                    minChunks: 2,
                    priority: -20,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    "resolve": {
        "modules": components_dir,
    },
    "module": {
        "rules": [
            {
                "test": require.resolve('jquery'),
                loader: 'expose-loader',
                options: {
                    exposes: ['$', 'jQuery'],
                }
            },
            {
                "test": /\.(webp|svg|ico|png|gif|jp(e*)g)(\?v=\d+\.\d+\.\d+)?$/,
                "exclude": ['/dev/assets/fonts/'],
                "use": [
                    {
                        "loader": 'url-loader',
                        "options": {
                            //"limit": 8000, // Convert images < 8kb to base64 strings
                            "limit": false,
                            "name": (process.env.NODE_ENV == "development"? "[name].[ext]": "[name].[ext]?[hash]") || "[name].[ext]",
                            "outputPath": (url, resourcePath, context) => {
                                var folder = resourcePath.slice(resourcePath.lastIndexOf('images/') + 'images/'.length)
                                if (/images/.test(resourcePath)) {
                                    return `assets/images/${folder}`;
                                }
                            },
                            esModule: false
                        }
                    }
                ]
            },
            {
                "test": /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
                "exclude": ['/dev/assets/images/'],
                "use": [
                    {
                        "loader": 'file-loader',
                        "options": {
                            "name": (process.env.NODE_ENV == "development"? "[name].[ext]": "[name].[ext]?[hash]") || "[name].[ext]",
                            "outputPath": (url, resourcePath, context) => {
                                if (/fonts/.test(resourcePath)) {
                                    return `assets/fonts/${url}`;
                                }
                                if (/pdf/.test(resourcePath)) {
                                    return `assets/pdf/${url}`;
                                }
                            },
                        }
                    }
                ]
            },
            {
                "test": /\.(s(a|c)ss?|css)(\?v=\d+\.\d+\.\d+)?$/,
                "use": [
                    {
                        "loader": ExtractCssChunks.loader
                    },
                    {
                        "loader": "css-loader"
                    },
                    {
                        "loader": 'resolve-url-loader',
                        "options": {
                            root: __dirname
                        }
                    },
                    {
                        "loader": "sass-loader",
                        "options": {
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, "dev")]
                            }
                        }
                    }
                ]
            },
            {
                "test": /\.js$/,
                "exclude": /node_modules/,
                "use": [
                    {
                        "loader": "babel-loader",
                        "options": {
                            "sourceType": "unambiguous"
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      watchContentBase: true,
    },
}