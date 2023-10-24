'use strict'

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path')
const fs = require('fs')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')


const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();


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
    //new webpack.ProgressPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    }),
    new CopyPlugin({
        patterns: [
            // {
            //     from: 'images/*',
            //     to: 'assets/',
            //     context: 'dev/assets/',
            // },
            {
                from: "public"
            }
        ]
    }),
    new ExtractCssChunks({
        "filename":  "css/[name].css",
        "chunkFilename": "css/[id].css",
        "hot": process.env.NODE_ENV === 'development',
    }),
    new BrowserSyncPlugin(
        // BrowserSync options
        {
            open: false,
          // browse to http://localhost:3000/ during development
          host: 'localhost',
          // proxy the Webpack Dev Server endpoint
          // (which should be serving on http://localhost:3100/)
          // through BrowserSync
          proxy: 'http://localhost:8080/'
        },
        // plugin options
        {
          // prevent BrowserSync from reloading the page
          // and let Webpack Dev Server take care of this
          reload: false
        }
      )
];

for (const entry of Object.entries(entries)) {
    let type = entry.toString().split("/").slice(2)[0];
    let directory = entry.toString().split("/").slice(-2)[0];
    plugins.push(
        new HtmlWebpackPlugin({
            "template": path.resolve(__dirname, 'dev/'+type+'/'+directory+'/view.pug'),
            "filename": directory + '.html',
            "chunks": [directory, 'vendors', 'runtime'],
            //"hash": true,
            "minify": false
        })
    )
}

module.exports = {
    "devtool": "eval-cheap-module-source-map",
    "target": "web",
    "mode": process.env.NODE_ENV || "development",
    "entry": entries,
    "output": {
        "path": path.resolve(__dirname, 'dist'),
        "publicPath": "/",
        "filename": "js/[name].[hash].js"
    },
    "plugins": plugins,

    "optimization": {
        //"minimize": true,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        //splitChunks: false,
        // "runtimeChunk": 'single',
        "splitChunks": {
            "cacheGroups": {
                "vendor": {
                    "test": /[\\/]node_modules[\\/]/,
                    "name": 'vendors',
                    "chunks": 'all'
                }
            }
        }
    },

    "resolve": {
        "modules": components_dir,
    },


    "devServer": {
		port: 3001,
        "hot": true,
        "contentBase": path.join(__dirname, 'public'),
        "publicPath": "/",
        "compress": true,
        "stats": {
            assets: false,
            moduleAssets: false,
            builtAt: false,
            chunks: false,
            errors: true,
            entrypoints: false,
            modules: false
        }
        //"writeToDisk": true
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
                "test": /\.pug$/,
                "exclude": ['/node_modules/'],
                "use": [
                    {
                        "loader": "cache-loader"
                    },
                    {
                        "loader": 'html-loader',
                        options: {
                            attributes: {
                                list: [
                                    {
                                        tag: 'img',
                                        attribute: 'src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'img',
                                        attribute: 'srcset',
                                        type: 'srcset',
                                    },
                                    {
                                        tag: 'img',
                                        attribute: 'data-src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'img',
                                        attribute: 'data-srcset',
                                        type: 'srcset',
                                    },
                                    {
                                        tag: 'video',
                                        attribute: 'src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'video',
                                        attribute: 'poster',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'source',
                                        attribute: 'src',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'link',
                                        attribute: 'href',
                                        type: 'src',
                                    },
                                    {
                                        tag: 'div',
                                        attribute: 'data-background',
                                        type: 'src',
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "loader": 'pug-html-loader',
                        "options": {
                            "basedir": path.resolve(__dirname, 'dev'),
                            "pretty": '\t'
                        }
                    }
                ]
            },
            {
                "test": /\.mp4$/,
                "use": [
                    {
                        "loader": "cache-loader"
                    },
                    {
                        "loader": 'file-loader',
                        "options": {
                            "name": (process.env.NODE_ENV == "development"? "[name].[ext]": "[name].[ext]?[hash]") || "[name].[ext]",
                            "outputPath": (url, resourcePath, context) => {
                                if (/videos/.test(resourcePath)) {
                                    return `assets/videos/${url}`;
                                }
                            },
                            esModule: false
                        }
                    }
                ]
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
                "test": /\.(woff(2)?|ttf|svg|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
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
                        "loader": ExtractCssChunks.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                            esModule: true,
                        },
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

                    }
                ]
            },
            {
                "test": /\.js$/,
                "exclude": /node_modules\/(?!(dom7|swiper)\/).*/,
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
    }
};