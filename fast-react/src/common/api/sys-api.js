import http from "../../utils/http"

export let loginApi = (obj = {}) => {
    return http.post('sys/login', obj)
}
export let logoutApi = (obj = {}) => {
    return http.post('sys/logout', obj)
}
export let captchaImageApi = (obj = {}) => {
    return http.post('captchaImage', obj)
}
export let getUserInfoApi = (obj = {}) => {
    return http.post('sys/getUserInfo', obj)
}
export let getRoutersApi = (obj = {}) => {
    return http.post('sys/getRouters', obj)
}
