import http from "../../../utils/http"

export let listPostApi = (obj = {}) => {
    return http.post('post/listSysPost', obj)
}

export let delPostApi = (obj = {}) => {
    return http.post('post/delSysPost', obj)
}
export let editPostApi = (obj = {}) => {
    return http.post('post/updateSysPost', obj)
}
export let addPostApi = (obj = {}) => {
    return http.post('post/addSysPost', obj)
}
