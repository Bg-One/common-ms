import axios from 'axios'
import qs from 'qs'
import {getToken} from "./auth";
import {Modal} from 'antd';

const {confirm} = Modal;
let Allow_Origin = httpType + '://' + ip + port
let baseURL = httpType + '://' + ip + ':' + port + '/' + entryName

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
        if (config.method === "post" || config.method === "put" || config.method === "delete") {
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

    // 未设置状态码则默认成功状态
    const code = response.data.code || 200;
    // 获取错误信息
    const msg = response.data.msg

    //返回 blob 文件时
    if (Object.prototype.toString.call(response.data) === '[object Blob]') {
        return response.data
    }

    if (code === 1008) {
        confirm({
            title: '会话提醒',
            content: '无效的会话，或者会话已过期，请重新登录。',
            cancelButtonProps: {
                disabled: true
            },
            onOk() {
                return new Promise((resolve, reject) => {
                    //跳到首页
                    location.href = '/#/login';
                    resolve()
                }).catch(() => isRelogin.show = false);
            },
            onCancel() {
            },
        });

        return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code !== 1) {
        Notification.error({title: msg})
        return Promise.reject('error')
    } else {
        return response.data
    }
}, (error) => {
    console.log('err' + error)
    let {message} = error;
    if (message === "Network Error") {
        message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
        message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    message.error({message: message, type: 'error', duration: 5 * 1000})
    return Promise.reject(error)
})

export default http
