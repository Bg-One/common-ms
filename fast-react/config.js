// 全局变量配置

/*
 * 配置默认字体大小  便于字体使用rem单位
 */
document.head.insertAdjacentHTML('beforeend', '<style>html { font-size: 80%; } body { margin: 0;}</style>')
/**
 * 一些常量
 */
let httpType = 'http'           //http or https
let ip = '127.0.0.1'
let port = '8081'
let entryName = ''   //接口的项目名
let scriptUrl = '//at.alicdn.com/t/c/font_4326503_37sslr4k0bc.js' // 在 iconfont.cn 上生成  //图标库地址
