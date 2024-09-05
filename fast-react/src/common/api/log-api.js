import http from "../../utils/http"

export let listSysLogininforApi = (obj = {}) => {
    return http.post('log/listSysLogininfor', obj)
}
export let removeLoginLogByGuidsApi = (obj = {}) => {
    return http.post('log/removeLoginLogByGuids', obj)
}
export let cleanLoginLogApi = (obj = {}) => {
    return http.post('log/cleanLoginLog', obj)
}


export let listOperLogApi = (obj = {}) => {
    return http.post('log/listOperLog', obj)
}
export let removeOperLogByGuidsApi = (obj = {}) => {
    return http.post('log/removeOperLogByGuids', obj)
}
export let cleanOperLogApi = (obj = {}) => {
    return http.post('log/cleanOperLog', obj)
}
