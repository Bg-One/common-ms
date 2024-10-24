const merge = require('webpack-merge')
const common = require('./base.config')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = merge(common, {
    devtool: 'eval-source-map',
    mode: 'development',
    target: "web",
    devServer: {
        hot: true,
        // host: '127.0.0.1',
        host: '192.168.9.8',
        port: 1001,
        proxy: [
            // {
            //     // 跨域
            //     '/hot': {
            //         target: 'https://mp3.9ku.com',
            //         //   pathRewrite: {'^/hot' : ''},
            //         changeOrigin: true,     //是否跨域 target是域名的话，需要这个参数，
            //         secure: true,          // 设置支持https协议的代理
            //     }
            // }
        ],
        client: {
            logging: 'none',//只打印报错，其实只要这个配置就好了
            overlay: false,   //有报错发生，直接覆盖浏览器视窗，显示错误，大黑屏幕，不建议用
        },
    },
    // 控制台打印
    stats: {
        chunks: false, // 不添加chunk信息
        colors: true,
        modules: false, // 不添加构建模块信息
    },
    plugins: [
        //清理生成的文件  暂用此设置，试用能否解决内存会过高的问题
        new CleanWebpackPlugin(),
    ],
    externals: {  // 不遵循/打包这些模块，而是在运行时从环境中请求他们
        'BMap': 'BMap'
    }
})
