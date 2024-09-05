import {message} from 'antd'
import axios from 'axios'
import qs from 'qs'
import {getToken} from "./auth";

let Allow_Origin = httpType + '://' + ip + port
let baseURL = httpType + '://' + ip + ':' + port + '/' + entryName
console.log(baseURL)
//创建自定义实例
const http = axios.create({
    // timeout: 10000,
    withCredentials: false, // 是否允许带cookie这些   //这个会导致报跨域的错
    headers: {
        'Accept': "application/json, text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        'Access-Control-Allow-Origin': Allow_Origin,
        //  'Access-Control-Allow-Origin':'http://171.168.1.96',//nginx代理
        'Access-Control-Allow-Credentials': 'true',
    }
})
http.websocketURL = baseURL.replace('http:', 'ws:')

//根据所处环境设置baseURL（mock下不能加baseURL）
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
    http.defaults.baseURL = baseURL
} else if (process.env.NODE_ENV == 'production') {
    http.defaults.baseURL = baseURL
    //  http.defaults.baseURL = 'http://171.168.1.96/ddlz/'//nginx代理
}

//POST传参序列化(添加请求拦截器)
http.interceptors.request.use(
    config => {
        getToken()
        let accessToken = getToken()
        if (accessToken) {
            config.headers['Authorization'] = 'Bearer ' + accessToken // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        // 在发送请求之前做某件事
        if (
            config.method === "post" ||
            config.method === "put" ||
            config.method === "delete"
        ) {
            // 序列化
            if (Object.prototype.toString.call(config.data) !== '[object FormData]') {
                config.data = qs.stringify(config.data)
            }
        }
        return config
    },
    error => {
        return Promise.reject(error.data.error.message)
    }
)
// 添加响应拦截器   对响应数据做点什么(可以处理响应状态码)
http.interceptors.response.use((response) => {

    // 独立处理某些接口
    if (['userinfo/userAuthByCode1'].some(item => new RegExp(item + '$').test(response.config.url))) {
        console.log(response)
        return response
    }

    //返回 blob 文件时
    if (Object.prototype.toString.call(response.data) === '[object Blob]') {
        return response.data
    }

    // 返回数据不对时，打断流程
    if (response.data.code !== 1) {
        message.error(response.data.message)
        return Promise.reject(response.data.message)
    }

    // // 正常接口处理
    // try {
    //     // 当 response.data.data 为json时 返回转化后的值
    //     response.data = JSON.parse(response.data.data)//解json
    // } catch (e) {
    //     // 当 response.data 不为json 时不处理
    //     console.log('注:' + response.config.url + ' 接口返回值不是json，请联系后端更改')
    //     console.log('返回值是', response.data)
    //     return response.data
    // }
    return response.data
}, (error) => {
    // 对响应错误做点什么
    return Promise.reject(error)
})

export default http
