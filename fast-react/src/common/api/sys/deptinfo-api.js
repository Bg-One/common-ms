import http from "../../../utils/http"

export let listDeptApi = (obj = {}) => {
    return http.post('dept/listDept', obj)
}
export let addDeptApi = (obj = {}) => {
    return http.post('dept/addDept', obj)
}
export let updateDeptApi = (obj = {}) => {
    return http.post('dept/updateDept', obj)
}
export let deleteDeptApi = (obj = {}) => {
    return http.post('dept/deleteDept', obj)
}
