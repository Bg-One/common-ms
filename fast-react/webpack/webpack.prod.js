const merge = require('webpack-merge')
const common = require('./base.config')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        //清理生成的文件
        new CleanWebpackPlugin(),

        // 压缩 JavaScript
        new TerserPlugin({//是一个用于在Webpack构建过程中压缩和优化JavaScript代码的插件，它是基于Terser进行了封装。
            test: /\.js(\?.*)?$/i,//用来匹配需要压缩的文件
            parallel: true,//类型为布尔值或数字，指定是否使用多进程并行执行压缩任务。默认为 true，启用多进程压缩。
            extractComments: false,//类型为布尔值、字符串或正则表达式，用于控制是否提取和保存注释。默认为 true，提取并保存所有注释。
            terserOptions: {}//类型为对象，用于传递给Terser压缩器的配置选项。可以在这里指定更详细的压缩设置，如混淆变量名、移除无用代码等。
        }),

        // // 压缩和优化css
        // new CssMinimizerPlugin({
        //     test: /\.css$/i,
        //     include: /\/includes/,
        //     parallel: true,
        // }),
    ],
    // 打包大小限制
    performance: {
        maxEntrypointSize: 5120000,
        maxAssetSize: 5120000
    }
})
