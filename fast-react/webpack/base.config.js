var webpack = require('webpack')
var path = require('path')
const ROOT_PATH = path.resolve(__dirname, '..')
const BUILD_PATH = path.resolve(ROOT_PATH, 'build')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require("terser-webpack-plugin")
// 项目编辑后，拷贝一些文件到指定目录
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    // 指定入口文件
    entry: {
        index: './index.js',
    },
    // 输出
    output: {
        path: BUILD_PATH, //输出路径
        filename: 'js/[name][hash:5].min.js',  //输出文件的文件名
    },

    // 优化
    optimization: {
        minimize: true,
        minimizer: [
            // 压缩 JavaScript
            new TerserPlugin({//是一个用于在Webpack构建过程中压缩和优化JavaScript代码的插件，它是基于Terser进行了封装。
                test: /\.js(\?.*)?$/i,//用来匹配需要压缩的文件
                parallel: true,//类型为布尔值或数字，指定是否使用多进程并行执行压缩任务。默认为 true，启用多进程压缩。
                extractComments: false,//类型为布尔值、字符串或正则表达式，用于控制是否提取和保存注释。默认为 true，提取并保存所有注释。
                terserOptions: {}//类型为对象，用于传递给Terser压缩器的配置选项。可以在这里指定更详细的压缩设置，如混淆变量名、移除无用代码等。
            }),
        ],
    },
    module: {
        rules: [{
            test: /(\.js)$/i,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    "cacheDirectory": true,
                    "presets": [
                        ["@babel/preset-env", { targets: { browsers: "last 2 versions" } }],
                        "@babel/react"
                    ],
                    "plugins": [
                        '@babel/plugin-proposal-class-properties',
                        ["@babel/plugin-transform-runtime", {
                            "helpers": false,
                        }],
                    ]
                }
            }
        }, {
            test: /\.(scss|css)$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        }, {
            test: /\.(ttf|eot|woff|woff2|svg|TTF|otf)$/i,
            type: 'asset',
            parser: {
                dataUrlCondition: {
                    maxSize: 8 * 1024 // 限制于 8kb
                }
            },
            generator: {
                filename: 'fonts/[name].[hash][ext][query]' // 局部指定输出位置
            }
        }, {
            test: /\.(png|svg|jpg|Jpeg|jpeg|gif|mp3)$/i,
            type: 'asset',
            parser: {
                dataUrlCondition: {
                    maxSize: 8 * 1024 // 限制于 8kb
                }
            },
            generator: {
                filename: 'images/[name].[hash][ext][query]' // 局部指定输出位置
            }
        }, {
            test: /\.(mp3)(\?.*)?$/i,
            type: 'asset',
            parser: {
                dataUrlCondition: {
                    maxSize: 8 * 1024 // 限制于 8kb
                }
            },
            generator: {
                filename: 'audios/[name].[hash][ext][query]' // 局部指定输出位置
            }
        }],
    },
    context: path.resolve(__dirname, '..'), //webpack 的主目录 entry和modules.rules与此有关
    target: "web",
    resolve: {
        extensions: ['.web.js', '.js', '.json']
    },
    plugins: [

        // 将CSS提取到单独的文件中
        new MiniCssExtractPlugin({
            filename: '[name][hash:5].min.css',
        }),

        //自动为你生成一个HTML文件
        new HtmlWebpackPlugin({
            template: 'index.html', //定义插件读取的模板文件是根目录下的index.html
            inject: true, //注入位置
            hash: true, //给文件添加hash
        }),

        //不必通过 import/require 使用模块 直接使用三方库的导出模块
        new webpack.ProvidePlugin({
            React: "react",
            Component: ['react', 'Component'] //import {Component} from 'react'
        }),

        new CopyPlugin([    //复制不参与编译的文件
            { from: "libraries", to: "libraries" },
            { from: "config.js", to: "" },
        ]),
    ],
    externals: {
        'Bmob': 'Bmob'
    },
}
