import http from "../../utils/http"

export let listRoleApi = (obj = {}) => {
    return http.post('role/listRole', obj)
}
export let deleteRoleApi = (obj = {}) => {
    return http.post('role/deleteRole', obj)
}
export let allocatedListApi = (obj = {}) => {
    return http.post('role/allocatedList', obj)
}
export let authUserApi = (obj = {}) => {
    return http.post('role/authUser', obj)
}
export let cancelCuthUserApi = (obj = {}) => {
    return http.post('role/cancelCuthUser', obj)
}
export let editRoleApi = (obj = {}) => {
    return http.post('role/editRole', obj)
}
export let addRoleApi = (obj = {}) => {
    return http.post('role/addRole', obj)
}
