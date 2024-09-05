import http from "../../utils/http"

export let listUserApi = (obj = {}) => {
    return http.post('user/listUser', obj)
}
export let insertUserApi = (obj = {}) => {
    return http.post('user/addUser', obj)
}
export let changeStatusApi = (obj = {}) => {
    return http.post('user/changeStatus', obj)
}
export let deleteUserApi = (obj = {}) => {
    return http.post('user/deleteUser', obj)
}
export let editUserApi = (obj = {}) => {
    return http.post('user/editUser', obj)
}
export let resetPwdApi = (obj = {}) => {
    return http.post('user/resetPwd', obj)
}
